const formulario = document.getElementById("loginForm");

if (formulario) {
    formulario.addEventListener("submit", iniciarSesion);
}


// =========================================
// INICIAR SESIÓN
// =========================================

async function iniciarSesion(evento) {

    evento.preventDefault();

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
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    correo,
                    contrasena
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                "Correo o contraseña incorrectos."
            );

            return;
        }

        localStorage.setItem(
            "token",
            datos.token
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );

        window.location.href = "home.html";

    } catch (error) {

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

    "Las mejores decisiones empiezan comprendiendo el problema.",

    "Cambiar de perspectiva puede cambiar una decisión.",

    "Entender lo que sientes también es parte de avanzar.",

    "No todas las respuestas aparecen cuando las buscas.",

    "Crecer también significa cuestionar lo que haces."

];


const reflectionText =
    document.getElementById("reflectionText");

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


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === indice
        );

    });
}


// =========================================
// CLIC EN LOS PUNTOS
// =========================================

dots.forEach((dot) => {

    dot.addEventListener("click", () => {

        const indice =
            Number(dot.dataset.index);

        cambiarFrase(indice);

    });

});


// =========================================
// CAMBIO AUTOMÁTICO
// =========================================

setInterval(() => {

    fraseActual =
        (fraseActual + 1) % frases.length;

    cambiarFrase(fraseActual);

}, 6000);


// =========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// =========================================

const passwordInput =
    document.getElementById("contrasena");

const togglePassword =
    document.getElementById("togglePassword");


if (passwordInput && togglePassword) {

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