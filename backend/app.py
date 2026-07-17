from flask import Flask
from routes.auth import auth
from routes.categorias import categorias

app = Flask(__name__)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(categorias, url_prefix="/api/categorias")

@app.route("/")
def inicio():
    return "Backend de Evolut funcionando"

if __name__ == "__main__":
    app.run(debug=True)