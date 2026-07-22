from flask import Blueprint, request

from db import obtener_conexion
from services.openai_service import generar_respuesta

ia = Blueprint("ia", __name__)


@ia.route("/analizar", methods=["POST"])
def analizar():

    datos = request.get_json()

    mensaje = datos.get("mensaje")
    conversacion_id = datos.get("conversacion_id")

    if not mensaje:
        return {
            "mensaje": "El mensaje es obligatorio"
        }, 400

    if not conversacion_id:
        return {
            "mensaje": "La conversación es obligatoria"
        }, 400

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

        # Obtener respuesta de OpenAI
        respuesta = generar_respuesta(mensaje)

        # Guardar respuesta de la IA
        cursor.execute("""
            INSERT INTO mensajes
            (contenido, rol, fecha_creacion, conversacion_id)
            VALUES
            (%s, %s, NOW(), %s)
        """, (respuesta, "ia", conversacion_id))

        conexion.commit()

        return {
            "respuesta": respuesta
        }, 200

    except Exception as e:

        conexion.rollback()

        return {
            "mensaje": "Error al comunicarse con OpenAI",
            "error": str(e)
        }, 500

    finally:

        cursor.close()
        conexion.close()