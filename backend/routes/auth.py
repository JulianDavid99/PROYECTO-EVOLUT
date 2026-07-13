from flask import Blueprint, request
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

    cursor.execute(
        """
        INSERT INTO usuarios (nombre_completo, correo, contrasena)
        VALUES (%s, %s, %s)
        """,
        (nombre, correo, contrasena)
    )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Usuario registrado correctamente"
    }