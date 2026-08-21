const API_URL = "https://evolut-api-2qwc.onrender.com/api";


// =========================
// OBTENER USUARIO
// =========================

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);


// =========================
// ELEMENTOS
// =========================

const avatar =
    document.getElementById("avatar");

const nombreResumen =
    document.getElementById("nombreResumen");

const inputNombre =
    document.getElementById("nombre");

const inputCorreo =
    document.getElementById("correo");

const mensajePerfil =
    document.getElementById("mensajePerfil");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnHome =
    document.getElementById("btnHome");

const btnSalir =
    document.getElementById("btnSalir");


// =========================
// VALIDAR SESIÓN
// =========================

if (!usuario) {

    window.location.href =
        "login.html";

}


// =========================
// CARGAR PERFIL
// =========================

async function cargarPerfil() {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/auth/usuario/${usuario.id}`
            );


        // Primero verificar si la respuesta fue correcta
        if (!respuesta.ok) {

            const texto =
                await respuesta.text();

            throw new Error(
                `Error ${respuesta.status}: ${texto}`
            );

        }


        // Solo convertir a JSON si la respuesta fue correcta
        const datos =
            await respuesta.json();


        // Mostrar datos en los campos

        inputNombre.value =
            datos.nombre || "";

        inputCorreo.value =
            datos.correo || "";


        // Actualizar resumen

        actualizarResumen(
            datos.nombre
        );


        // Actualizar localStorage

        const usuarioActualizado = {

            id: datos.id,

            nombre: datos.nombre,

            correo: datos.correo

        };


        localStorage.setItem(
            "usuario",
            JSON.stringify(
                usuarioActualizado
            )
        );

    }

    catch (error) {

        console.error(
            "Error cargando perfil:",
            error
        );


        mostrarMensaje(
            error.message,
            "error"
        );

    }

}


// =========================
// ACTUALIZAR RESUMEN
// =========================

function actualizarResumen(nombre) {

    if (!nombre) {

        avatar.textContent =
            "?";

        nombreResumen.textContent =
            "Usuario";

        return;

    }


    const nombreLimpio =
        nombre.trim();


    // Mostrar inicial

    avatar.textContent =
        nombreLimpio
            .charAt(0)
            .toUpperCase();


    // Mostrar nombre

    nombreResumen.textContent =
        nombreLimpio;

}


// =========================
// GUARDAR CAMBIOS
// =========================

btnGuardar.addEventListener(
    "click",
    async () => {

        const nombre =
            inputNombre.value.trim();


        // Validar nombre

        if (!nombre) {

            mostrarMensaje(
                "El nombre es obligatorio.",
                "error"
            );

            return;

        }


        // Desactivar botón

        btnGuardar.disabled =
            true;

        btnGuardar.textContent =
            "Guardando...";


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/auth/usuario/${usuario.id}`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            nombre:
                                nombre

                        })

                    }
                );


            // Verificar respuesta antes de convertir a JSON

            if (!respuesta.ok) {

                const texto =
                    await respuesta.text();

                throw new Error(
                    `Error ${respuesta.status}: ${texto}`
                );

            }


            const datos =
                await respuesta.json();


            // Verificar que llegó el usuario

            if (!datos.usuario) {

                throw new Error(
                    "El servidor no devolvió los datos del usuario."
                );

            }


            // Actualizar localStorage

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    datos.usuario
                )
            );


            // Actualizar objeto actual

            usuario.nombre =
                datos.usuario.nombre;

            usuario.correo =
                datos.usuario.correo;


            // Actualizar interfaz

            inputNombre.value =
                datos.usuario.nombre;

            inputCorreo.value =
                datos.usuario.correo;


            actualizarResumen(
                datos.usuario.nombre
            );


            mostrarMensaje(
                "Perfil actualizado correctamente.",
                "exito"
            );

        }

        catch (error) {

            console.error(
                "Error actualizando perfil:",
                error
            );


            mostrarMensaje(
                error.message,
                "error"
            );

        }

        finally {

            btnGuardar.disabled =
                false;

            btnGuardar.textContent =
                "Guardar cambios";

        }

    }
);


// =========================
// MOSTRAR MENSAJES
// =========================

function mostrarMensaje(
    mensaje,
    tipo
) {

    mensajePerfil.textContent =
        mensaje;


    mensajePerfil.className =
        `mensaje-perfil ${tipo}`;

}


// =========================
// VOLVER A EVOLUT
// =========================

btnHome.addEventListener(
    "click",
    () => {

        window.location.href =
            "home.html";

    }
);


// =========================
// CERRAR SESIÓN
// =========================

btnSalir.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "usuario"
        );

        localStorage.removeItem(
            "token"
        );


        window.location.href =
            "login.html";

    }
);


// =========================
// INICIAR
// =========================

cargarPerfil();