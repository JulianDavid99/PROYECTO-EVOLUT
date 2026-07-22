import os

from dotenv import load_dotenv
from openai import OpenAI

# Cargar variables del archivo .env
load_dotenv()

# Crear cliente de OpenAI
cliente = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

MODELO = os.getenv("OPENAI_MODEL")


def generar_respuesta(mensaje_usuario):

    system_prompt = """
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

    respuesta = cliente.responses.create(
        model=MODELO,
        input=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": mensaje_usuario
            }
        ]
    )

    return respuesta.output_text