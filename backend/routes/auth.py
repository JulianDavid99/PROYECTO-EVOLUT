from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
from db import obtener_conexion

auth = Blueprint("auth", __name__)


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
        "SELECT * FROM usuarios WHERE correo = %s",
        (correo,)
    )

    usuario_existente = cursor.fetchone()

    if usuario_existente:

        cursor.close()
        conexion.close()

        return {
            "mensaje": "El correo ya está registrado"
        }, 400

    # Encriptar la contraseña antes de guardarla
    contrasena_hash = generate_password_hash(contrasena)

    cursor.execute(
        """
        INSERT INTO usuarios
        (nombre_completo, correo, contrasena)
        VALUES (%s, %s, %s)
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

    # Comparar la contraseña ingresada con el hash almacenado
    if not check_password_hash(usuario[3], contrasena):

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