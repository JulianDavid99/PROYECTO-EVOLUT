from flask import Blueprint, request
from db import obtener_conexion

categorias = Blueprint("categorias", __name__)


@categorias.route("/", methods=["GET"])
def obtener_categorias():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM categorias ORDER BY id"
    )

    categorias_db = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for categoria in categorias_db:
        resultado.append({
            "id": categoria[0],
            "nombre": categoria[1],
            "descripcion": categoria[2],
            "fecha_creacion": str(categoria[3])
        })

    return resultado, 200


@categorias.route("/", methods=["POST"])
def crear_categoria():

    datos = request.get_json()

    nombre = datos.get("nombre")
    descripcion = datos.get("descripcion")

    if not nombre or not descripcion:
        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        """
        INSERT INTO categorias (nombre, descripcion)
        VALUES (%s, %s)
        """,
        (nombre, descripcion)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Categoría creada correctamente"
    }, 201


@categorias.route("/<int:id>", methods=["PUT"])
def actualizar_categoria(id):

    datos = request.get_json()

    nombre = datos.get("nombre")
    descripcion = datos.get("descripcion")

    if not nombre or not descripcion:
        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM categorias WHERE id = %s",
        (id,)
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
        UPDATE categorias
        SET nombre = %s,
            descripcion = %s
        WHERE id = %s
        """,
        (nombre, descripcion, id)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Categoría actualizada correctamente"
    }, 200


@categorias.route("/<int:id>", methods=["DELETE"])
def eliminar_categoria(id):

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM categorias WHERE id = %s",
        (id,)
    )

    categoria = cursor.fetchone()

    if not categoria:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "La categoría no existe"
        }, 404

    cursor.execute(
        "DELETE FROM categorias WHERE id = %s",
        (id,)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Categoría eliminada correctamente"
    }, 200