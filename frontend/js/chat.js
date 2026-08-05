let conversacionActual = null;

const formMensaje = document.getElementById("formMensaje");
const inputMensaje = document.getElementById("mensaje");
const chatArea = document.getElementById("chatArea");

formMensaje.addEventListener("submit", enviarMensaje);

//========================================
// AGREGAR MENSAJE
//========================================

function agregarMensaje(texto, tipo) {

    const mensaje = document.createElement("div");

    mensaje.className = `mensaje ${tipo}`;

    mensaje.innerHTML = `
        <div class="burbuja">
            ${texto}
        </div>
    `;

    chatArea.appendChild(mensaje);

}

//========================================
// SCROLL
//========================================

function bajarScroll() {

    chatArea.scrollTop = chatArea.scrollHeight;

}

//========================================
// CREAR CONVERSACIÓN
//========================================

async function crearConversacion() {

    if (categoriaSeleccionada === null) {

        alert("Primero selecciona una categoría.");

        return;

    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const respuesta = await fetch(`${API_URL}/conversaciones/`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            titulo: "Nueva reflexión",

            usuario_id: usuario.id,

            categoria_id: categoriaSeleccionada

        })

    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {

        throw new Error(datos.mensaje);

    }

    conversacionActual = datos.id;

    agregarConversacion(datos);

    const primera = listaConversaciones.firstElementChild;

    if (primera) {

        seleccionarConversacion(primera);

    }

}

//========================================
// CARGAR MENSAJES
//========================================

async function cargarMensajes(id) {

    try {

        const respuesta = await fetch(`${API_URL}/mensajes/${id}`);

        const mensajes = await respuesta.json();

        chatArea.innerHTML = "";

        mensajes.forEach(mensaje => {

            agregarMensaje(
                mensaje.contenido,
                mensaje.rol
            );

        });

        bajarScroll();

    }

    catch (error) {

        console.error(error);

    }

}

//========================================
// ENVIAR MENSAJE
//========================================

async function enviarMensaje(e) {

    e.preventDefault();

    const texto = inputMensaje.value.trim();

    if (texto === "") return;

    inputMensaje.value = "";

    try {

        if (conversacionActual === null) {

            await crearConversacion();

        }

        const respuesta = await fetch(`${API_URL}/ia/analizar`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                mensaje: texto,

                conversacion_id: conversacionActual

            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }

        await cargarMensajes(conversacionActual);

    }

    catch (error) {

        console.error(error);

        alert("No fue posible enviar el mensaje.");

    }

}