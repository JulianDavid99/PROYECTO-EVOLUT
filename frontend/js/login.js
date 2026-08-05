const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", iniciarSesion);

//=========================================
// INICIAR SESIÓN
//=========================================

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

        const respuesta = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                correo,
                contrasena

            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }

        //=========================================
        // GUARDAR DATOS DEL USUARIO
        //=========================================

        localStorage.setItem("token", datos.token);

        localStorage.setItem("usuario", JSON.stringify(datos.usuario));

        //=========================================

        window.location.href = "home.html";

    }

    catch (error) {

        console.error(error);

        alert("No fue posible conectar con el servidor.");

    }

}