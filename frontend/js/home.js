const btnNueva = document.getElementById("btnNueva");
const listaConversaciones = document.getElementById("listaConversaciones");

const modalCategoria = document.getElementById("modalCategoria");
const categoriaSelect = document.getElementById("categoriaSelect");
const btnContinuar = document.getElementById("btnContinuar");

// Categoría seleccionada para la próxima conversación
let categoriaSeleccionada = null;

document.addEventListener("DOMContentLoaded", () => {

    cargarCategorias();

    cargarConversaciones();

});

btnNueva.addEventListener("click", abrirModal);

btnContinuar.addEventListener("click", confirmarCategoria);

//=========================================
// CARGAR CATEGORÍAS
//=========================================

async function cargarCategorias() {

    try {

        const respuesta = await fetch(`${API_URL}/categorias/`);

        const categorias = await respuesta.json();

        categoriaSelect.innerHTML = `
            <option value="">
                Seleccione una categoría
            </option>
        `;

        categorias.forEach(categoria => {

            categoriaSelect.innerHTML += `
                <option value="${categoria.id}">
                    ${categoria.nombre}
                </option>
            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("No fue posible cargar las categorías.");

    }

}

//=========================================
// CARGAR CONVERSACIONES
//=========================================

async function cargarConversaciones() {

    try {

        const respuesta = await fetch(`${API_URL}/conversaciones/`);

        const conversaciones = await respuesta.json();

        listaConversaciones.innerHTML = "";

        conversaciones.forEach(conversacion => {

            agregarConversacion(conversacion);

        });

    }

    catch (error) {

        console.error(error);

        alert("No fue posible cargar las conversaciones.");

    }

}

//=========================================
// ABRIR MODAL
//=========================================

function abrirModal() {

    categoriaSelect.value = "";

    modalCategoria.classList.add("active");

}

//=========================================
// CONFIRMAR CATEGORÍA
//=========================================

function confirmarCategoria() {

    if (categoriaSelect.value === "") {

        alert("Seleccione una categoría.");

        return;

    }

    categoriaSeleccionada = parseInt(categoriaSelect.value);

    conversacionActual = null;

    document.getElementById("chatArea").innerHTML = "";

    document.getElementById("mensaje").value = "";

    document
        .querySelectorAll(".conversation")
        .forEach(c => c.classList.remove("active"));

    modalCategoria.classList.remove("active");

}

//=========================================
// AGREGAR CONVERSACIÓN
//=========================================

function agregarConversacion(conversacion) {

    const item = document.createElement("div");

    item.className = "conversation";

    item.dataset.id = conversacion.id;

    item.textContent = conversacion.titulo;

    item.addEventListener("click", () => {

        seleccionarConversacion(item);

    });

    listaConversaciones.prepend(item);

}

//=========================================
// SELECCIONAR CONVERSACIÓN
//=========================================

async function seleccionarConversacion(elemento) {

    document
        .querySelectorAll(".conversation")
        .forEach(c => c.classList.remove("active"));

    elemento.classList.add("active");

    conversacionActual = elemento.dataset.id;

    await cargarMensajes(conversacionActual);

}