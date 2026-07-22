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

        # Obtener historial
        cursor.execute("""
            SELECT contenido, rol
            FROM mensajes
            WHERE conversacion_id = %s
            ORDER BY fecha_creacion ASC
        """, (conversacion_id,))

        mensajes_bd = cursor.fetchall()

        historial = []

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