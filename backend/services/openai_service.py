import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

cliente = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

MODELO = os.getenv("OPENAI_MODEL")


def cargar_prompt():

    ruta_prompt = os.path.join(
        os.path.dirname(__file__),
        "..",
        "prompts",
        "evolut_system_prompt.md"
    )

    with open(ruta_prompt, "r", encoding="utf-8") as archivo:
        return archivo.read()


SYSTEM_PROMPT = cargar_prompt()


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