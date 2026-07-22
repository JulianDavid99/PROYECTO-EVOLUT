from db import obtener_conexion
from services.openai_service import generar_respuesta


def procesar_conversacion(conversacion_id, mensaje):

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:

        # Guardar mensaje del usuario
        cursor.execute("""
            INSERT INTO mensajes
            (contenido, rol, fecha_creacion, conversacion_id)
            VALUES
            (%s, %s, NOW(), %s)
        """, (mensaje, "usuario", conversacion_id))

        conexion.commit()

        # Obtener información de la conversación
        cursor.execute("""
            SELECT
                c.titulo,
                cat.nombre
            FROM conversaciones c
            JOIN categorias cat
                ON c.categoria_id = cat.id
            WHERE c.id = %s
        """, (conversacion_id,))

        conversacion = cursor.fetchone()

        titulo = conversacion[0]
        categoria = conversacion[1]

        # Obtener historial
        cursor.execute("""
            SELECT contenido, rol
            FROM mensajes
            WHERE conversacion_id = %s
            ORDER BY fecha_creacion ASC
        """, (conversacion_id,))

        mensajes_bd = cursor.fetchall()

        historial = []

        # Contexto de la conversación
        historial.append({
            "role": "system",
            "content": f"""
Categoría de la conversación: {categoria}

Título de la conversación: {titulo}

Utiliza esta información únicamente como contexto para comprender mejor de qué trata la conversación.
"""
        })

        # Historial de mensajes
        for contenido, rol in mensajes_bd:

            historial.append({
                "role": "user" if rol == "usuario" else "assistant",
                "content": contenido
            })

        # Obtener respuesta de OpenAI
        respuesta = generar_respuesta(historial)

        # Guardar respuesta de la IA
        cursor.execute("""
            INSERT INTO mensajes
            (contenido, rol, fecha_creacion, conversacion_id)
            VALUES
            (%s, %s, NOW(), %s)
        """, (respuesta, "ia", conversacion_id))

        conexion.commit()

        return respuesta

    except Exception:
        conexion.rollback()
        raise

    finally:
        cursor.close()
        conexion.close()