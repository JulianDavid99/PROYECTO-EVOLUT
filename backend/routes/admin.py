from flask import Blueprint
from db import obtener_conexion

admin = Blueprint("admin", __name__)


@admin.route("/conversaciones", methods=["GET"])
def obtener_todas_conversaciones():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            conversaciones.id,
            conversaciones.titulo,
            usuarios.nombre_completo,
            categorias.nombre,
            conversaciones.fecha_creacion
        FROM conversaciones
        INNER JOIN usuarios
            ON conversaciones.usuario_id = usuarios.id
        INNER JOIN categorias
            ON conversaciones.categoria_id = categorias.id
        ORDER BY conversaciones.id
    """)

    conversaciones = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for fila in conversaciones:
        resultado.append({
            "id": fila[0],
            "titulo": fila[1],
            "usuario": fila[2],
            "categoria": fila[3],
            "fecha_creacion": str(fila[4])
        })

    return resultado, 200


@admin.route("/mensajes", methods=["GET"])
def obtener_todos_mensajes():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            mensajes.id,
            mensajes.contenido,
            mensajes.rol,
            conversaciones.titulo
        FROM mensajes
        INNER JOIN conversaciones
            ON mensajes.conversacion_id = conversaciones.id
        ORDER BY mensajes.id
    """)

    mensajes = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for fila in mensajes:
        resultado.append({
            "id": fila[0],
            "contenido": fila[1],
            "rol": fila[2],
            "conversacion": fila[3]
        })

    return resultado, 200