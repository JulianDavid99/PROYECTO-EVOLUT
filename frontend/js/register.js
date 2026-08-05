const formulario = document.getElementById("registerForm");

formulario.addEventListener("submit", registrarUsuario);

//=========================================
// REGISTRAR USUARIO
//=========================================

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

        const respuesta = await fetch(`${API_URL}/auth/register`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                nombre,
                correo,
                contrasena

            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }

        alert("Usuario registrado correctamente.");

        window.location.href = "login.html";

    }

    catch (error) {

        console.error(error);

        alert("No fue posible conectar con el servidor.");

    }

}