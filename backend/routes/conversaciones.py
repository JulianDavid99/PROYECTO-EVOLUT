from flask import Blueprint, request
from db import obtener_conexion

conversaciones = Blueprint("conversaciones", __name__)


@conversaciones.route("/", methods=["GET"])
def obtener_conversaciones():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        """
        SELECT *
        FROM conversaciones
        ORDER BY id
        """
    )

    conversaciones_db = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for conversacion in conversaciones_db:
        resultado.append({
            "id": conversacion[0],
            "titulo": conversacion[1],
            "fecha_creacion": str(conversacion[2]),
            "usuario_id": conversacion[3],
            "categoria_id": conversacion[4]
        })

    return resultado, 200


@conversaciones.route("/", methods=["POST"])
def crear_conversacion():

    datos = request.get_json()

    titulo = datos.get("titulo")
    usuario_id = datos.get("usuario_id")
    categoria_id = datos.get("categoria_id")

    if not titulo or not usuario_id or not categoria_id:
        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM usuarios WHERE id = %s",
        (usuario_id,)
    )

    usuario = cursor.fetchone()

    if not usuario:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "El usuario no existe"
        }, 404

    cursor.execute(
        "SELECT * FROM categorias WHERE id = %s",
        (categoria_id,)
    )

    categoria = cursor.fetchone()

    if not categoria:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "La categoría no existe"
        }, 404

    cursor.execute(
        """
        INSERT INTO conversaciones
        (titulo, usuario_id, categoria_id)
        VALUES (%s, %s, %s)
        """,
        (titulo, usuario_id, categoria_id)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Conversación creada correctamente"
    }, 201


@conversaciones.route("/<int:id>", methods=["PUT"])
def actualizar_conversacion(id):

    datos = request.get_json()

    titulo = datos.get("titulo")

    if not titulo:
        return {
            "mensaje": "El título es obligatorio"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM conversaciones WHERE id = %s",
        (id,)
    )

    conversacion = cursor.fetchone()

    if not conversacion:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "La conversación no existe"
        }, 404

    cursor.execute(
        """
        UPDATE conversaciones
        SET titulo = %s
        WHERE id = %s
        """,
        (titulo, id)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Conversación actualizada correctamente"
    }, 200


@conversaciones.route("/<int:id>", methods=["DELETE"])
def eliminar_conversacion(id):

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM conversaciones WHERE id = %s",
        (id,)
    )

    conversacion = cursor.fetchone()

    if not conversacion:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "La conversación no existe"
        }, 404

    cursor.execute(
        "DELETE FROM conversaciones WHERE id = %s",
        (id,)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Conversación eliminada correctamente"
    }, 200