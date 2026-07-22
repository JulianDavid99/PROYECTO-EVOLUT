from flask import Blueprint, request

from services.conversacion_service import procesar_conversacion

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

    try:

        respuesta = procesar_conversacion(
            conversacion_id,
            mensaje
        )

        return {
            "respuesta": respuesta
        }, 200

    except Exception as e:

        return {
            "mensaje": "Error al comunicarse con OpenAI",
            "error": str(e)
        }, 500