from flask import Flask
from routes.auth import auth
from routes.categorias import categorias
from routes.conversaciones import conversaciones
from routes.mensajes import mensajes
from routes.admin import admin
from routes.ia import ia

app = Flask(__name__)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(categorias, url_prefix="/api/categorias")
app.register_blueprint(conversaciones, url_prefix="/api/conversaciones")
app.register_blueprint(mensajes, url_prefix="/api/mensajes")
app.register_blueprint(admin, url_prefix="/api/admin")
app.register_blueprint(ia, url_prefix="/api/ia")

@app.route("/")
def inicio():
    return "Backend de Evolut funcionando"                                                                                                                                      

if __name__ == "__main__":
    app.run(debug=True)