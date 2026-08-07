import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def obtener_conexion():

    database_url = os.getenv("DATABASE_URL")

    # Producción (Neon / Render)
    if database_url:

        return psycopg2.connect(dsn=database_url)

    # Desarrollo local
    return psycopg2.connect(

        host="localhost",
        database="evolut",
        user="postgres",
        password="3134553"

    )