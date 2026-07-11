import psycopg2

def obtener_conexion():
    conexion = psycopg2.connect(
        host="localhost",
        database="evolut",
        user="postgres",
        password="3134553"
    )

    return conexion