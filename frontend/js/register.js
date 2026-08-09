const formulario = document.getElementById("registerForm");


if (formulario) {

    formulario.addEventListener(
        "submit",
        registrarUsuario
    );

}


// =========================================
// REGISTRAR USUARIO
// =========================================

async function registrarUsuario(evento) {

    evento.preventDefault();


    const nombre = document
        .getElementById("nombre")
        .value
        .trim();


    const correo = document
        .getElementById("correo")
        .value
        .trim();


    const contrasena = document
        .getElementById("contrasena")
        .value
        .trim();


    try {

        const respuesta = await fetch(
            `${API_URL}/auth/register`,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    nombre,
                    correo,
                    contrasena

                })

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                "No fue posible registrar el usuario."
            );

            return;

        }


        alert(
            "Usuario registrado correctamente."
        );


        window.location.href =
            "login.html";

    }


    catch (error) {

        console.error(error);

        alert(
            "No fue posible conectar con el servidor."
        );

    }

}


// =========================================
// FRASES
// =========================================

const frases = [

    "El crecimiento comienza con la decisión de mejorar.",

    "Cada cambio empieza con una pequeña decisión.",

    "Conocerte mejor también es una forma de avanzar.",

    "Aprender de tus decisiones te permite tomar mejores decisiones.",

    "Evolucionar requiere cuestionar lo que ya conoces."

];


const reflectionText =
    document.getElementById(
        "reflectionText"
    );


const dots =
    document.querySelectorAll(".dot");


let fraseActual = 0;


// =========================================
// CAMBIAR FRASE
// =========================================

function cambiarFrase(indice) {

    if (!reflectionText) {

        return;

    }


    fraseActual = indice;


    reflectionText.style.opacity = "0";


    setTimeout(() => {

        reflectionText.textContent =
            `"${frases[indice]}"`;

        reflectionText.style.opacity = "1";

    }, 180);


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
// PUNTOS
// =========================================

dots.forEach((dot) => {

    dot.addEventListener(
        "click",
        () => {

            const indice =
                Number(dot.dataset.index);

            cambiarFrase(indice);

        }
    );

});


// =========================================
// CAMBIO AUTOMÁTICO
// =========================================

setInterval(() => {

    fraseActual =
        (fraseActual + 1) %
        frases.length;

    cambiarFrase(fraseActual);

}, 6000);


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
                passwordInput.type === "text";


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