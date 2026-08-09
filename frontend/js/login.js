// =========================================
// FORMULARIO
// =========================================

const formulario = document.getElementById("loginForm");


// =========================================
// MODAL DE MENSAJES
// =========================================

function crearModalMensaje() {

    if (document.getElementById("modalMensaje")) {
        return;
    }

    const estilos = document.createElement("style");

    estilos.id = "estilosModalMensaje";

    estilos.textContent = `

        .modal-mensaje {

            position: fixed;

            inset: 0;

            background: rgba(2, 8, 30, 0.72);

            backdrop-filter: blur(6px);

            -webkit-backdrop-filter: blur(6px);

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

            transition:
                opacity .25s ease,
                visibility .25s ease;

            z-index: 9999;

        }


        .modal-mensaje.active {

            opacity: 1;

            visibility: visible;

            pointer-events: auto;

        }


        .modal-mensaje-content {

            width: min(430px, 100%);

            background: linear-gradient(
                145deg,
                #07143d,
                #06102f
            );

            border: 1px solid rgba(0, 132, 255, .65);

            border-radius: 20px;

            padding: 32px;

            box-shadow:
                0 0 25px rgba(0, 110, 255, .25),
                0 20px 60px rgba(0, 0, 0, .45);

            transform:
                translateY(15px)
                scale(.97);

            transition:
                transform .25s ease;

        }


        .modal-mensaje.active
        .modal-mensaje-content {

            transform:
                translateY(0)
                scale(1);

        }


        .modal-mensaje-icon {

            width: 58px;

            height: 58px;

            margin: 0 auto 18px;

            border-radius: 50%;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                rgba(0, 110, 255, .12);

            border:
                1px solid
                rgba(0, 140, 255, .6);

            color: #168cff;

            font-size: 27px;

            font-weight: 700;

            box-shadow:
                0 0 18px
                rgba(0, 110, 255, .25);

        }


        .modal-mensaje-content h2 {

            margin: 0 0 10px;

            text-align: center;

            color: white;

            font-size: 1.35rem;

            font-weight: 700;

        }


        .modal-mensaje-texto {

            margin: 0 auto;

            max-width: 350px;

            text-align: center;

            color:
                rgba(220, 232, 255, .78);

            line-height: 1.6;

            font-size: .95rem;

        }


        .modal-mensaje-boton {

            display: block;

            width: 100%;

            margin-top: 26px;

            min-height: 48px;

            border-radius: 11px;

            border:
                1px solid
                rgba(70, 160, 255, .8);

            background:
                linear-gradient(
                    135deg,
                    #147cff,
                    #0755e8
                );

            color: white;

            font-family: inherit;

            font-size: .95rem;

            font-weight: 600;

            cursor: pointer;

            box-shadow:
                0 0 18px
                rgba(0, 110, 255, .28);

            transition: all .2s ease;

        }


        .modal-mensaje-boton:hover {

            transform: translateY(-1px);

            box-shadow:
                0 0 25px
                rgba(0, 110, 255, .45);

        }


        @media (max-width: 500px) {

            .modal-mensaje-content {

                padding: 25px 20px;

            }

        }

    `;

    document.head.appendChild(estilos);


    const modal =
        document.createElement("div");

    modal.id =
        "modalMensaje";

    modal.className =
        "modal-mensaje";


    modal.innerHTML = `

        <div class="modal-mensaje-content">

            <div
                id="modalMensajeIcon"
                class="modal-mensaje-icon">

                !

            </div>

            <h2
                id="modalMensajeTitulo">

                Algo salió mal

            </h2>

            <p
                id="modalMensajeTexto"
                class="modal-mensaje-texto">

            </p>

            <button
                type="button"
                id="btnCerrarMensaje"
                class="modal-mensaje-boton">

                Entendido

            </button>

        </div>

    `;


    document.body.appendChild(modal);


    const boton =
        document.getElementById(
            "btnCerrarMensaje"
        );


    boton.addEventListener(
        "click",
        cerrarModalMensaje
    );


    modal.addEventListener(
        "click",
        evento => {

            if (
                evento.target === modal
            ) {

                cerrarModalMensaje();

            }

        }
    );


    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                cerrarModalMensaje();

            }

        }
    );

}


// =========================================
// MOSTRAR MENSAJE
// =========================================

function mostrarMensaje(
    mensaje,
    titulo = "Algo salió mal"
) {

    crearModalMensaje();


    const modal =
        document.getElementById(
            "modalMensaje"
        );


    const tituloElemento =
        document.getElementById(
            "modalMensajeTitulo"
        );


    const textoElemento =
        document.getElementById(
            "modalMensajeTexto"
        );


    tituloElemento.textContent =
        titulo;


    textoElemento.textContent =
        mensaje;


    modal.classList.add(
        "active"
    );

}


// =========================================
// CERRAR MENSAJE
// =========================================

function cerrarModalMensaje() {

    const modal =
        document.getElementById(
            "modalMensaje"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );

}


// =========================================
// INICIO
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        crearModalMensaje();

    }
);


// =========================================
// INICIAR SESIÓN
// =========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        iniciarSesion
    );

}


// =========================================
// FUNCIÓN LOGIN
// =========================================

async function iniciarSesion(
    evento
) {

    evento.preventDefault();


    const correo =
        document
            .getElementById("correo")
            .value
            .trim();


    const contrasena =
        document
            .getElementById("contrasena")
            .value
            .trim();


    // =====================================
    // VALIDACIÓN
    // =====================================

    if (!correo || !contrasena) {

        mostrarMensaje(
            "Completa tu correo electrónico y contraseña.",
            "Campos incompletos"
        );

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        correo,
                        contrasena

                    })

                }
            );


        const datos =
            await respuesta.json();


        // =================================
        // ERROR DEL BACKEND
        // =================================

        if (!respuesta.ok) {

            let titulo =
                "No fue posible iniciar sesión";


            if (
                respuesta.status === 404
            ) {

                titulo =
                    "Usuario no encontrado";

            }


            if (
                respuesta.status === 401
            ) {

                titulo =
                    "Contraseña incorrecta";

            }


            mostrarMensaje(
                datos.mensaje ||
                "Verifica tus datos e inténtalo nuevamente.",
                titulo
            );


            return;

        }


        // =================================
        // GUARDAR SESIÓN
        // =================================

        localStorage.setItem(
            "token",
            datos.token
        );


        localStorage.setItem(
            "usuario",
            JSON.stringify(
                datos.usuario
            )
        );


        // =================================
        // IR AL HOME
        // =================================

        window.location.href =
            "home.html";

    }


    catch (error) {

        console.error(
            "Error de login:",
            error
        );


        mostrarMensaje(
            "No fue posible conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.",
            "Error de conexión"
        );

    }

}


// =========================================
// FRASES
// =========================================

const frases = [

    "Las mejores decisiones empiezan comprendiendo el problema.",

    "Cambiar de perspectiva puede cambiar una decisión.",

    "Entender lo que sientes también es parte de avanzar.",

    "No todas las respuestas aparecen cuando las buscas.",

    "Crecer también significa cuestionar lo que haces."

];


const reflectionText =
    document.getElementById(
        "reflectionText"
    );


const dots =
    document.querySelectorAll(
        ".dot"
    );


let fraseActual = 0;


// =========================================
// CAMBIAR FRASE
// =========================================

function cambiarFrase(
    indice
) {

    if (!reflectionText) {

        return;

    }


    fraseActual =
        indice;


    reflectionText.style.opacity =
        "0";


    setTimeout(
        () => {

            reflectionText.textContent =
                `"${frases[indice]}"`;


            reflectionText.style.opacity =
                "1";

        },
        180
    );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === indice
            );

        }
    );

}


// =========================================
// CLIC EN LOS PUNTOS
// =========================================

dots.forEach(
    dot => {

        dot.addEventListener(
            "click",
            () => {

                const indice =
                    Number(
                        dot.dataset.index
                    );


                cambiarFrase(
                    indice
                );

            }
        );

    }
);


// =========================================
// CAMBIO AUTOMÁTICO
// =========================================

setInterval(
    () => {

        fraseActual =
            (fraseActual + 1)
            % frases.length;


        cambiarFrase(
            fraseActual
        );

    },
    6000
);


// =========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// =========================================

const passwordInput =
    document.getElementById(
        "contrasena"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


if (
    passwordInput &&
    togglePassword
) {

    togglePassword.addEventListener(
        "click",
        () => {

            const mostrando =
                passwordInput.type ===
                "text";


            passwordInput.type =
                mostrando
                    ? "password"
                    : "text";


            togglePassword.setAttribute(
                "aria-label",
                mostrando
                    ? "Mostrar contraseña"
                    : "Ocultar contraseña"
            );

        }
    );

}