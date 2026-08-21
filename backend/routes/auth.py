from flask import Blueprint, request

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from db import obtener_conexion


auth = Blueprint("auth", __name__)


# =========================================================
# REGISTRO
# =========================================================

@auth.route("/register", methods=["POST"])
def register():

    datos = request.get_json()

    nombre = datos.get("nombre")
    correo = datos.get("correo")
    contrasena = datos.get("contrasena")


    if not nombre or not correo or not contrasena:

        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400


    conexion = obtener_conexion()
    cursor = conexion.cursor()


    cursor.execute(
        """
        SELECT id
        FROM usuarios
        WHERE correo = %s
        """,
        (correo,)
    )

    usuario_existente = cursor.fetchone()


    if usuario_existente:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "El correo ya está registrado"
        }, 400


    contrasena_hash = generate_password_hash(
        contrasena
    )


    cursor.execute(
        """
        INSERT INTO usuarios
        (
            nombre_completo,
            correo,
            contrasena
        )
        VALUES
        (
            %s,
            %s,
            %s
        )
        """,
        (
            nombre,
            correo,
            contrasena_hash
        )
    )


    conexion.commit()

    cursor.close()
    conexion.close()


    return {
        "mensaje": "Usuario registrado correctamente"
    }, 201


# =========================================================
# LOGIN
# =========================================================

@auth.route("/login", methods=["POST"])
def login():

    datos = request.get_json()

    correo = datos.get("correo")
    contrasena = datos.get("contrasena")


    if not correo or not contrasena:

        return {
            "mensaje": "Todos los campos son obligatorios"
        }, 400


    conexion = obtener_conexion()
    cursor = conexion.cursor()


    cursor.execute(
        """
        SELECT
            id,
            nombre_completo,
            correo,
            contrasena
        FROM usuarios
        WHERE correo = %s
        """,
        (correo,)
    )


    usuario = cursor.fetchone()


    if not usuario:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "El usuario no existe"
        }, 404


    if not check_password_hash(
        usuario[3],
        contrasena
    ):

        cursor.close()
        conexion.close()

        return {
            "mensaje": "Contraseña incorrecta"
        }, 401


    cursor.close()
    conexion.close()


    return {

        "mensaje": "Inicio de sesión exitoso",

        "usuario": {

            "id": usuario[0],

            "nombre": usuario[1],

            "correo": usuario[2]

        },

        "token": "TEMPORAL"

    }, 200


# =========================================================
# OBTENER PERFIL DEL USUARIO
# =========================================================

@auth.route(
    "/usuario/<int:usuario_id>",
    methods=["GET"]
)
def obtener_usuario(usuario_id):

    conexion = obtener_conexion()
    cursor = conexion.cursor()


    cursor.execute(
        """
        SELECT
            id,
            nombre_completo,
            correo
        FROM usuarios
        WHERE id = %s
        """,
        (usuario_id,)
    )


    usuario = cursor.fetchone()


    cursor.close()
    conexion.close()


    if not usuario:

        return {
            "mensaje": "Usuario no encontrado"
        }, 404


    return {

        "id": usuario[0],

        "nombre": usuario[1],

        "correo": usuario[2]

    }, 200


# =========================================================
# ACTUALIZAR NOMBRE DEL USUARIO
# =========================================================

@auth.route(
    "/usuario/<int:usuario_id>",
    methods=["PUT"]
)
def actualizar_usuario(usuario_id):

    datos = request.get_json()


    nombre = datos.get("nombre")


    if not nombre:

        return {
            "mensaje": "El nombre es obligatorio"
        }, 400


    conexion = obtener_conexion()
    cursor = conexion.cursor()


    # Verificar que el usuario exista

    cursor.execute(
        """
        SELECT
            id,
            correo
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
            "mensaje": "Usuario no encontrado"
        }, 404


    # Actualizar únicamente el nombre

    cursor.execute(
        """
        UPDATE usuarios
        SET nombre_completo = %s
        WHERE id = %s
        """,
        (
            nombre,
            usuario_id
        )
    )


    conexion.commit()


    # Consultar los datos actualizados

    cursor.execute(
        """
        SELECT
            id,
            nombre_completo,
            correo
        FROM usuarios
        WHERE id = %s
        """,
        (usuario_id,)
    )


    usuario_actualizado = cursor.fetchone()


    cursor.close()
    conexion.close()


    return {

        "mensaje": "Nombre actualizado correctamente",

        "usuario": {

            "id": usuario_actualizado[0],

            "nombre": usuario_actualizado[1],

            "correo": usuario_actualizado[2]

        }

    }, 200