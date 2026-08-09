from flask import Blueprint, request
from db import obtener_conexion


mensajes = Blueprint(
    "mensajes",
    __name__
)


# =========================================================
# OBTENER MENSAJES DE UNA CONVERSACIÓN
# =========================================================

@mensajes.route("/<int:conversacion_id>", methods=["GET"])
def obtener_mensajes(conversacion_id):

    usuario_id = request.args.get("usuario_id")

    if not usuario_id:
        return {
            "mensaje": "El usuario es obligatorio"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # Verificar que la conversación pertenezca
    # al usuario que está haciendo la solicitud
    cursor.execute(
        """
        SELECT id
        FROM conversaciones
        WHERE id = %s
        AND usuario_id = %s
        """,
        (
            conversacion_id,
            usuario_id
        )
    )

    conversacion = cursor.fetchone()

    if not conversacion:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "No tienes permiso para acceder a esta conversación"
        }, 403

    # Obtener mensajes
    cursor.execute(
        """
        SELECT
            id,
            contenido,
            rol,
            fecha_creacion,
            conversacion_id
        FROM mensajes
        WHERE conversacion_id = %s
        ORDER BY fecha_creacion ASC
        """,
        (
            conversacion_id,
        )
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


# =========================================================
# CREAR MENSAJE
# =========================================================

@mensajes.route("/", methods=["POST"])
def crear_mensaje():

    datos = request.get_json()

    contenido = datos.get("contenido")
    rol = datos.get("rol")
    conversacion_id = datos.get("conversacion_id")
    usuario_id = datos.get("usuario_id")

    if (
        not contenido
        or not rol
        or not conversacion_id
        or not usuario_id
    ):
        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400

    if rol not in ["usuario", "ia"]:
        return {
            "mensaje": "El rol debe ser 'usuario' o 'ia'"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # Verificar que la conversación pertenezca
    # al usuario
    cursor.execute(
        """
        SELECT id
        FROM conversaciones
        WHERE id = %s
        AND usuario_id = %s
        """,
        (
            conversacion_id,
            usuario_id
        )
    )

    conversacion = cursor.fetchone()

    if not conversacion:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "No tienes permiso para utilizar esta conversación"
        }, 403

    # Crear mensaje
    cursor.execute(
        """
        INSERT INTO mensajes
        (
            contenido,
            rol,
            conversacion_id
        )
        VALUES
        (
            %s,
            %s,
            %s
        )
        RETURNING id
        """,
        (
            contenido,
            rol,
            conversacion_id
        )
    )

    mensaje_id = cursor.fetchone()[0]

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Mensaje creado correctamente",
        "id": mensaje_id,
        "contenido": contenido,
        "rol": rol,
        "conversacion_id": conversacion_id
    }, 201


# =========================================================
# ACTUALIZAR MENSAJE
# =========================================================

@mensajes.route("/<int:id>", methods=["PUT"])
def actualizar_mensaje(id):

    datos = request.get_json()

    contenido = datos.get("contenido")
    usuario_id = datos.get("usuario_id")

    if not contenido or not usuario_id:
        return {
            "mensaje": "El contenido y el usuario son obligatorios"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # Verificar que el mensaje pertenezca
    # a una conversación del usuario
    cursor.execute(
        """
        SELECT
            m.id
        FROM mensajes m
        INNER JOIN conversaciones c
            ON m.conversacion_id = c.id
        WHERE m.id = %s
        AND c.usuario_id = %s
        """,
        (
            id,
            usuario_id
        )
    )

    mensaje = cursor.fetchone()

    if not mensaje:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "No tienes permiso para modificar este mensaje"
        }, 403

    # Actualizar mensaje
    cursor.execute(
        """
        UPDATE mensajes
        SET contenido = %s
        WHERE id = %s
        """,
        (
            contenido,
            id
        )
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Mensaje actualizado correctamente"
    }, 200


# =========================================================
# ELIMINAR MENSAJE
# =========================================================

@mensajes.route("/<int:id>", methods=["DELETE"])
def eliminar_mensaje(id):

    datos = request.get_json(silent=True) or {}

    usuario_id = datos.get("usuario_id")

    if not usuario_id:
        return {
            "mensaje": "El usuario es obligatorio"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # Verificar que el mensaje pertenezca
    # a una conversación del usuario
    cursor.execute(
        """
        SELECT
            m.id
        FROM mensajes m
        INNER JOIN conversaciones c
            ON m.conversacion_id = c.id
        WHERE m.id = %s
        AND c.usuario_id = %s
        """,
        (
            id,
            usuario_id
        )
    )

    mensaje = cursor.fetchone()

    if not mensaje:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "No tienes permiso para eliminar este mensaje"
        }, 403

    # Eliminar mensaje
    cursor.execute(
        """
        DELETE FROM mensajes
        WHERE id = %s
        """,
        (
            id,
        )
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Mensaje eliminado correctamente"
    }, 200