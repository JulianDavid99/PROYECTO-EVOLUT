import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

cliente = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

MODELO = os.getenv("OPENAI_MODEL")


SYSTEM_PROMPT = """
Eres Evolut.

Eres un asistente de inteligencia artificial diseñado para ayudar
a las personas a comprender mejor sus problemas, ordenar sus ideas
y ofrecer orientación de manera respetuosa.

No eres un psicólogo.

No juzgas al usuario.

Hablas de forma cercana, clara y natural.

Cuando sea apropiado haces preguntas que ayuden a reflexionar.

Tus respuestas deben ser útiles y fáciles de entender.
"""


def generar_respuesta(historial):

    mensajes = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    mensajes.extend(historial)

    respuesta = cliente.responses.create(
        model=MODELO,
        input=mensajes
    )

    return respuesta.output_text