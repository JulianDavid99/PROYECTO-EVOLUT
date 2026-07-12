from flask import Blueprint, request
from db import obtener_conexion

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():

    datos = request.get_json()

    nombre = datos.get("nombre")
    correo = datos.get("correo")
    contrasena = datos.get("contrasena")

    conexion = obtener_conexion()
    cursor = conexion.cursor()

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