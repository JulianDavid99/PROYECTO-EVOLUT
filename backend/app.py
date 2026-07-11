from flask import Flask
from db import obtener_conexion

app = Flask(__name__)

@app.route("/")
def inicio():
    try:
        conexion = obtener_conexion()
        conexion.close()
        return "✅ Conexión exitosa con PostgreSQL"
    except Exception as e:
        return f"❌ Error de conexión: {e}"


if __name__ == "__main__":
    app.run(debug=True)