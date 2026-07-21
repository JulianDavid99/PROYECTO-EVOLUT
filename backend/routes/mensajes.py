from flask import Blueprint, request
from db import obtener_conexion

mensajes = Blueprint("mensajes", __name__)


@mensajes.route("/", methods=["GET"])
def obtener_mensajes():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM mensajes ORDER BY id"
    )

    mensajes_db = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for mensaje in mensajes_db:
        resultado.append({
            "id": mensaje[0],
            "contenido": mensaje[1],
            "rol": mensaje[2],
            "fecha_creacion": str(mensaje[3]),
            "conversacion_id": mensaje[4]
        })

    return resultado, 200


@mensajes.route("/", methods=["POST"])
def crear_mensaje():

    datos = request.get_json()

    contenido = datos.get("contenido")
    rol = datos.get("rol")
    conversacion_id = datos.get("conversacion_id")

    if not contenido or not rol or not conversacion_id:
        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400

    if rol not in ["usuario", "ia"]:
        return {
            "mensaje": "El rol debe ser 'usuario' o 'ia'"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM conversaciones WHERE id = %s",
        (conversacion_id,)
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
        INSERT INTO mensajes (contenido, rol, conversacion_id)
        VALUES (%s, %s, %s)
        """,
        (contenido, rol, conversacion_id)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Mensaje creado correctamente"
    }, 201


@mensajes.route("/<int:id>", methods=["PUT"])
def actualizar_mensaje(id):

    datos = request.get_json()

    contenido = datos.get("contenido")

    if not contenido:
        return {
            "mensaje": "El contenido es obligatorio"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM mensajes WHERE id = %s",
        (id,)
    )

    mensaje = cursor.fetchone()

    if not mensaje:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "El mensaje no existe"
        }, 404

    cursor.execute(
        """
        UPDATE mensajes
        SET contenido = %s
        WHERE id = %s
        """,
        (contenido, id)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Mensaje actualizado correctamente"
    }, 200


@mensajes.route("/<int:id>", methods=["DELETE"])
def eliminar_mensaje(id):

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM mensajes WHERE id = %s",
        (id,)
    )

    mensaje = cursor.fetchone()

    if not mensaje:
        cursor.close()
        conexion.close()

        return {
            "mensaje": "El mensaje no existe"
        }, 404

    cursor.execute(
        "DELETE FROM mensajes WHERE id = %s",
        (id,)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Mensaje eliminado correctamente"
    }, 200