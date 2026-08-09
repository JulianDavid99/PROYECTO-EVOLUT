from flask import Blueprint, request
from db import obtener_conexion


conversaciones = Blueprint(
    "conversaciones",
    __name__
)


# =========================================================
# OBTENER CONVERSACIONES DEL USUARIO
# =========================================================

@conversaciones.route("/", methods=["GET"])
def obtener_conversaciones():

    usuario_id = request.args.get("usuario_id")

    if not usuario_id:
        return {
            "mensaje": "El usuario es obligatorio"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            id,
            titulo,
            fecha_creacion,
            usuario_id,
            categoria_id
        FROM conversaciones
        WHERE usuario_id = %s
        ORDER BY id DESC
    """, (usuario_id,))

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


# =========================================================
# CREAR CONVERSACIÓN
# =========================================================

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

    # Verificar usuario
    cursor.execute(
        """
        SELECT id
        FROM usuarios
        WHERE id = %s
        """,
        (usuario_id,)
    )

    usuario = cursor.fetchone()

    if not usuario:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "El usuario no existe"
        }, 404

    # Verificar categoría
    cursor.execute(
        """
        SELECT id
        FROM categorias
        WHERE id = %s
        """,
        (categoria_id,)
    )

    categoria = cursor.fetchone()

    if not categoria:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "La categoría no existe"
        }, 404

    # Crear conversación
    cursor.execute(
        """
        INSERT INTO conversaciones
        (
            titulo,
            usuario_id,
            categoria_id
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
            titulo,
            usuario_id,
            categoria_id
        )
    )

    conversacion_id = cursor.fetchone()[0]

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Conversación creada correctamente",
        "id": conversacion_id,
        "titulo": titulo,
        "usuario_id": usuario_id,
        "categoria_id": categoria_id
    }, 201


# =========================================================
# ACTUALIZAR CONVERSACIÓN
# =========================================================

@conversaciones.route("/<int:id>", methods=["PUT"])
def actualizar_conversacion(id):

    datos = request.get_json()

    titulo = datos.get("titulo")
    usuario_id = datos.get("usuario_id")

    if not titulo or not usuario_id:
        return {
            "mensaje": "El título y el usuario son obligatorios"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # Verificar que la conversación pertenezca
    # al usuario que está realizando la acción
    cursor.execute(
        """
        SELECT id
        FROM conversaciones
        WHERE id = %s
        AND usuario_id = %s
        """,
        (
            id,
            usuario_id
        )
    )

    conversacion = cursor.fetchone()

    if not conversacion:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "No tienes permiso para modificar esta conversación"
        }, 403

    # Actualizar
    cursor.execute(
        """
        UPDATE conversaciones
        SET titulo = %s
        WHERE id = %s
        AND usuario_id = %s
        """,
        (
            titulo,
            id,
            usuario_id
        )
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Conversación actualizada correctamente"
    }, 200


# =========================================================
# ELIMINAR CONVERSACIÓN
# =========================================================

# =========================================================
# ELIMINAR CONVERSACIÓN
# =========================================================

@conversaciones.route("/<int:id>", methods=["DELETE"])
def eliminar_conversacion(id):

    datos = request.get_json(silent=True) or {}

    usuario_id = datos.get("usuario_id")

    if not usuario_id:
        return {
            "mensaje": "El usuario es obligatorio"
        }, 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:

        # Verificar que la conversación exista
        # y pertenezca al usuario
        cursor.execute(
            """
            SELECT id
            FROM conversaciones
            WHERE id = %s
            AND usuario_id = %s
            """,
            (
                id,
                usuario_id
            )
        )

        conversacion = cursor.fetchone()

        if not conversacion:

            return {
                "mensaje": "No tienes permiso para eliminar esta conversación"
            }, 403

        # =================================================
        # ELIMINAR TODOS LOS MENSAJES DE LA CONVERSACIÓN
        # =================================================

        cursor.execute(
            """
            DELETE FROM mensajes
            WHERE conversacion_id = %s
            """,
            (
                id,
            )
        )

        # =================================================
        # ELIMINAR LA CONVERSACIÓN
        # =================================================

        cursor.execute(
            """
            DELETE FROM conversaciones
            WHERE id = %s
            AND usuario_id = %s
            """,
            (
                id,
                usuario_id
            )
        )

        conexion.commit()

        return {
            "mensaje": "Conversación eliminada correctamente"
        }, 200

    except Exception:

        conexion.rollback()

        raise

    finally:

        cursor.close()
        conexion.close()