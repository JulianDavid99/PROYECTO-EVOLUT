// ============================================================
// ELEMENTOS DEL DOM
// ============================================================

const btnNueva =
    document.getElementById("btnNueva");

const listaConversaciones =
    document.getElementById(
        "listaConversaciones"
    );

const modalCategoria =
    document.getElementById(
        "modalCategoria"
    );

const categoriaSelect =
    document.getElementById(
        "categoriaSelect"
    );

const btnContinuar =
    document.getElementById(
        "btnContinuar"
    );

const formMensaje =
    document.getElementById(
        "formMensaje"
    );

const mensajeInput =
    document.getElementById(
        "mensaje"
    );

const chatArea =
    document.getElementById(
        "chatArea"
    );


// ============================================================
// VARIABLES
// ============================================================

let categoriaSeleccionada =
    null;

let conversacionActual =
    null;

let ultimoMensajeEnviado =
    null;

let enviandoMensaje =
    false;


// ============================================================
// INICIO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarCategorias();

        cargarConversaciones();

        crearEstilosHome();

    }
);


// ============================================================
// EVENTOS
// ============================================================

if (btnNueva) {

    btnNueva.addEventListener(
        "click",
        abrirModal
    );

}


if (btnContinuar) {

    btnContinuar.addEventListener(
        "click",
        confirmarCategoria
    );

}


if (formMensaje) {

    formMensaje.addEventListener(
        "submit",
        enviarMensaje
    );

}


// ============================================================
// ENTER PARA ENVIAR
// ============================================================

if (mensajeInput) {

    mensajeInput.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Enter" &&
                !evento.shiftKey
            ) {

                evento.preventDefault();


                if (
                    !mensajeInput.disabled &&
                    mensajeInput.value.trim()
                ) {

                    formMensaje.requestSubmit();

                }

            }

        }
    );

}


// ============================================================
// OBTENER USUARIO ACTUAL
// ============================================================

function obtenerUsuarioActual() {

    const usuarioGuardado =
        localStorage.getItem(
            "usuario"
        );


    if (!usuarioGuardado) {

        mostrarAviso(
            "No se encontró la sesión del usuario."
        );

        return null;

    }


    try {

        const usuario =
            JSON.parse(
                usuarioGuardado
            );


        if (
            !usuario ||
            !usuario.id
        ) {

            mostrarAviso(
                "La información del usuario no es válida."
            );

            return null;

        }


        return usuario;

    }

    catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );


        mostrarAviso(
            "No fue posible leer la información del usuario."
        );


        return null;

    }

}


// ============================================================
// CARGAR CATEGORÍAS
// ============================================================

async function cargarCategorias() {

    if (!categoriaSelect) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/categorias/`
            );


        const categorias =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                categorias.mensaje ||
                "No fue posible cargar las categorías."
            );

        }


        categoriaSelect.innerHTML = `

            <option value="">
                Seleccione una categoría
            </option>

        `;


        categorias.forEach(
            categoria => {

                categoriaSelect.innerHTML += `

                    <option
                        value="${categoria.id}">

                        ${escapeHtml(
                            categoria.nombre
                        )}

                    </option>

                `;

            }
        );

    }

    catch (error) {

        console.error(
            "Error cargando categorías:",
            error
        );


        mostrarAviso(
            "No fue posible cargar las categorías."
        );

    }

}


// ============================================================
// CARGAR CONVERSACIONES DEL USUARIO ACTUAL
// ============================================================

async function cargarConversaciones() {

    try {

        const usuario =
            obtenerUsuarioActual();


        if (!usuario) {
            return;
        }


        /*
         * IMPORTANTE:
         *
         * Antes pedíamos:
         *
         * /api/conversaciones/
         *
         * Eso devolvía las conversaciones de TODOS.
         *
         * Ahora pedimos:
         *
         * /api/conversaciones/?usuario_id=ID
         *
         * y el backend filtra por ese usuario.
         */

        const respuesta =
            await fetch(
                `${API_URL}/conversaciones/?usuario_id=${usuario.id}`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                "No fue posible cargar las conversaciones."
            );

        }


        listaConversaciones.innerHTML =
            "";


        datos.forEach(
            conversacion => {

                agregarConversacion(
                    conversacion
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error cargando conversaciones:",
            error
        );


        mostrarAviso(
            "No fue posible cargar las conversaciones."
        );

    }

}


// ============================================================
// ABRIR MODAL NUEVA REFLEXIÓN
// ============================================================

function abrirModal() {

    if (!modalCategoria) {
        return;
    }


    categoriaSelect.value =
        "";


    modalCategoria.classList.add(
        "active"
    );

}


// ============================================================
// CONFIRMAR CATEGORÍA
// ============================================================

function confirmarCategoria() {

    if (
        categoriaSelect.value === ""
    ) {

        mostrarAviso(
            "Selecciona una categoría para comenzar."
        );


        return;

    }


    categoriaSeleccionada =
        parseInt(
            categoriaSelect.value
        );


    conversacionActual =
        null;


    ultimoMensajeEnviado =
        null;


    chatArea.innerHTML = `

        <div
            id="emptyState"
            class="empty-state">

            <div
                class="empty-chat-icon">

                💬

            </div>

            <h2>
                Inicia tu reflexión
            </h2>

            <p>
                Escribe tu mensaje y comencemos
            </p>

        </div>

    `;


    mensajeInput.value =
        "";


    document
        .querySelectorAll(
            ".conversation"
        )
        .forEach(
            conversacion => {

                conversacion.classList.remove(
                    "active"
                );

            }
        );


    modalCategoria.classList.remove(
        "active"
    );


    mensajeInput.focus();

}


// ============================================================
// AGREGAR CONVERSACIÓN
// ============================================================

function agregarConversacion(
    conversacion
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "conversation";


    item.dataset.id =
        conversacion.id;


    const titulo =
        document.createElement(
            "span"
        );


    titulo.className =
        "conversation-title";


    titulo.textContent =
        conversacion.titulo;


    const botonEliminar =
        document.createElement(
            "button"
        );


    botonEliminar.type =
        "button";


    botonEliminar.className =
        "conversation-delete";


    botonEliminar.textContent =
        "⋯";


    botonEliminar.title =
        "Eliminar conversación";


    botonEliminar.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();


            abrirConfirmacionEliminar(
                conversacion.id,
                item,
                conversacion.titulo
            );

        }
    );


    item.appendChild(
        titulo
    );


    item.appendChild(
        botonEliminar
    );


    item.addEventListener(
        "click",
        () => {

            seleccionarConversacion(
                item
            );

        }
    );


    listaConversaciones.prepend(
        item
    );

}


// ============================================================
// SELECCIONAR CONVERSACIÓN
// ============================================================

async function seleccionarConversacion(
    elemento
) {

    document
        .querySelectorAll(
            ".conversation"
        )
        .forEach(
            conversacion => {

                conversacion.classList.remove(
                    "active"
                );

            }
        );


    elemento.classList.add(
        "active"
    );


    conversacionActual =
        elemento.dataset.id;


    categoriaSeleccionada =
        null;


    ultimoMensajeEnviado =
        null;


    await cargarMensajes(
        conversacionActual
    );

}


// ============================================================
// CARGAR MENSAJES
// ============================================================

async function cargarMensajes(conversacionId) {

    try {

        const usuarioGuardado =
            localStorage.getItem("usuario");


        if (!usuarioGuardado) {

            throw new Error(
                "No se encontró el usuario actual."
            );

        }


        const usuario =
            JSON.parse(usuarioGuardado);


        if (!usuario || !usuario.id) {

            throw new Error(
                "La información del usuario no es válida."
            );

        }


        const respuesta =
            await fetch(
                `${API_URL}/mensajes/${conversacionId}?usuario_id=${usuario.id}`
            );


        const mensajes =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                mensajes.mensaje ||
                "No fue posible cargar los mensajes."
            );

        }


        chatArea.innerHTML =
            "";


        if (
            !mensajes ||
            mensajes.length === 0
        ) {

            mostrarEstadoInicial();

            return;

        }


        mensajes.forEach(
            mensaje => {

                agregarMensajeAlChat(
                    mensaje.contenido,
                    mensaje.rol
                );

            }
        );


        desplazarChat();

    }

    catch (error) {

        console.error(
            "Error cargando mensajes:",
            error
        );


        mostrarErrorChat(
            error.message ||
            "No fue posible cargar esta conversación."
        );

    }

}


// ============================================================
// ENVIAR MENSAJE
// ============================================================

async function enviarMensaje(
    evento
) {

    if (evento) {

        evento.preventDefault();

    }


    if (enviandoMensaje) {
        return;
    }


    const contenido =
        mensajeInput.value.trim();


    if (!contenido) {
        return;
    }


    const usuario =
        obtenerUsuarioActual();


    if (!usuario) {
        return;
    }


    ultimoMensajeEnviado =
        contenido;


    // ========================================================
    // CREAR CONVERSACIÓN SI NO EXISTE
    // ========================================================

    if (!conversacionActual) {

        if (!categoriaSeleccionada) {

            mostrarAviso(
                "Primero selecciona una categoría con «Nueva reflexión»."
            );


            return;

        }


        const titulo =
            contenido.length > 40
                ? contenido.substring(
                    0,
                    40
                ) + "..."
                : contenido;


        const respuesta =
            await fetch(
                `${API_URL}/conversaciones/`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        titulo:
                            titulo,

                        usuario_id:
                            usuario.id,

                        categoria_id:
                            categoriaSeleccionada

                    })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            mostrarAviso(
                datos.mensaje ||
                "No fue posible crear la conversación."
            );


            return;

        }


        conversacionActual =
            datos.id;


        agregarConversacion(
            datos
        );


        document
            .querySelectorAll(
                ".conversation"
            )
            .forEach(
                elemento => {

                    elemento.classList.remove(
                        "active"
                    );


                    if (
                        String(
                            elemento.dataset.id
                        ) ===
                        String(
                            datos.id
                        )
                    ) {

                        elemento.classList.add(
                            "active"
                        );

                    }

                }
            );

    }


    // ========================================================
    // MARCAR COMO ENVIANDO
    // ========================================================

    enviandoMensaje =
        true;


    mensajeInput.disabled =
        true;


    // ========================================================
    // MOSTRAR MENSAJE DEL USUARIO
    // ========================================================

    agregarMensajeAlChat(
        contenido,
        "usuario"
    );


    mensajeInput.value =
        "";


    desplazarChat();


    // ========================================================
    // INDICADOR DE EVOLUT
    // ========================================================

    mostrarIndicadorIA();


    // ========================================================
    // CONSULTAR IA
    // ========================================================

    try {

        const respuesta =
            await fetch(
                `${API_URL}/ia/analizar`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        mensaje:
                            contenido,

                        conversacion_id:
                            conversacionActual

                    })

                }
            );


        const datos =
            await respuesta.json();


        ocultarIndicadorIA();


        if (!respuesta.ok) {

            mostrarErrorChat(
                datos.mensaje ||
                "No fue posible obtener la respuesta de Evolut."
            );


            return;

        }


        agregarMensajeAlChat(
            datos.respuesta,
            "ia"
        );


        ultimoMensajeEnviado =
            null;


        desplazarChat();

    }

    catch (error) {

        console.error(
            "Error comunicándose con Evolut:",
            error
        );


        ocultarIndicadorIA();


        mostrarErrorChat(
            "No fue posible comunicarse con Evolut. Verifica tu conexión e inténtalo nuevamente."
        );

    }

    finally {

        enviandoMensaje =
            false;


        mensajeInput.disabled =
            false;


        mensajeInput.focus();

    }

}


// ============================================================
// INDICADOR DE EVOLUT
// ============================================================

function mostrarIndicadorIA() {

    ocultarIndicadorIA();


    const indicador =
        document.createElement(
            "div"
        );


    indicador.id =
        "indicadorIA";


    indicador.className =
        "mensaje ia";


    indicador.innerHTML = `

        <div
            class="burbuja indicador-burbuja">

            <span>
                Evolut está reflexionando
            </span>

            <div
                class="indicador-puntos">

                <i></i>
                <i></i>
                <i></i>

            </div>

        </div>

    `;


    chatArea.appendChild(
        indicador
    );


    desplazarChat();

}


// ============================================================
// OCULTAR INDICADOR
// ============================================================

function ocultarIndicadorIA() {

    const indicador =
        document.getElementById(
            "indicadorIA"
        );


    if (indicador) {

        indicador.remove();

    }

}


// ============================================================
// ERROR DENTRO DEL CHAT
// ============================================================

function mostrarErrorChat(
    mensaje
) {

    const anterior =
        document.getElementById(
            "errorChat"
        );


    if (anterior) {
        anterior.remove();
    }


    const contenedor =
        document.createElement(
            "div"
        );


    contenedor.id =
        "errorChat";


    contenedor.className =
        "mensaje ia error-chat";


    contenedor.innerHTML = `

        <div
            class="error-burbuja">

            <div
                class="error-texto">

                <strong>
                    No pudimos obtener una respuesta
                </strong>

                <span>
                    ${escapeHtml(mensaje)}
                </span>

            </div>

            <button
                type="button"
                class="btn-reintentar">

                Reintentar

            </button>

        </div>

    `;


    const boton =
        contenedor.querySelector(
            ".btn-reintentar"
        );


    boton.addEventListener(
        "click",
        () => {

            contenedor.remove();


            if (
                ultimoMensajeEnviado &&
                !enviandoMensaje
            ) {

                mensajeInput.value =
                    ultimoMensajeEnviado;


                enviarMensaje();

            }

        }
    );


    chatArea.appendChild(
        contenedor
    );


    desplazarChat();

}


// ============================================================
// INDICADOR VISUAL
// ============================================================

function crearEstilosHome() {

    if (
        document.getElementById(
            "homeExtraStyles"
        )
    ) {

        return;

    }


    const estilos =
        document.createElement(
            "style"
        );


    estilos.id =
        "homeExtraStyles";


    estilos.textContent = `

        /* =====================================
           INDICADOR
        ===================================== */

        .indicador-burbuja {

            display:
                inline-flex;

            align-items:
                center;

            gap:
                10px;

        }


        .indicador-burbuja > span {

            color:
                #526b96;

            font-size:
                .92rem;

        }


        .indicador-puntos {

            display:
                inline-flex;

            gap:
                4px;

        }


        .indicador-puntos i {

            display:
                block;

            width:
                5px;

            height:
                5px;

            border-radius:
                50%;

            background:
                #1677ff;

            animation:
                evolutPunto
                1.2s
                infinite
                ease-in-out;

        }


        .indicador-puntos i:nth-child(2) {

            animation-delay:
                .2s;

        }


        .indicador-puntos i:nth-child(3) {

            animation-delay:
                .4s;

        }


        @keyframes evolutPunto {

            0%,
            60%,
            100% {

                opacity:
                    .3;

                transform:
                    translateY(0);

            }

            30% {

                opacity:
                    1;

                transform:
                    translateY(-3px);

            }

        }


        /* =====================================
           ERROR
        ===================================== */

        .error-chat {

            justify-content:
                flex-start;

        }


        .error-burbuja {

            display:
                flex;

            flex-direction:
                column;

            align-items:
                flex-start;

            gap:
                14px;

            max-width:
                520px;

            padding:
                18px 20px;

            border-radius:
                16px;

            background:
                #f1f4f9 !important;

            border:
                1px solid
                #cbd5e1 !important;

            color:
                #172033 !important;

            box-shadow:
                0 4px 15px
                rgba(0, 0, 0, .08);

        }


        .error-texto {

            display:
                flex;

            flex-direction:
                column;

            gap:
                6px;

        }


        .error-texto strong {

            color:
                #172033 !important;

            font-size:
                15px;

            font-weight:
                700;

        }


        .error-texto span {

            color:
                #52627a !important;

            font-size:
                14px;

            line-height:
                1.5;

        }


        .btn-reintentar {

            border:
                1px solid
                #1677ff !important;

            background:
                #ffffff !important;

            color:
                #1677ff !important;

            border-radius:
                9px;

            padding:
                8px 16px;

            font-family:
                inherit;

            font-size:
                14px;

            font-weight:
                600;

            cursor:
                pointer;

            transition:
                all .2s ease;

        }


        .btn-reintentar:hover {

            background:
                #1677ff !important;

            color:
                #ffffff !important;

        }


        /* =====================================
           ELIMINAR CONVERSACIÓN
        ===================================== */

        .conversation {

            position:
                relative;

        }


        .conversation-delete {

            border:
                none;

            background:
                transparent;

            color:
                #7a879d;

            cursor:
                pointer;

            opacity:
                0;

            font-size:
                20px;

            padding:
                2px 8px;

            transition:
                all .2s ease;

        }


        .conversation:hover
        .conversation-delete {

            opacity:
                1;

        }


        .conversation-delete:hover {

            color:
                #1677ff;

        }


        /* =====================================
           AVISO
        ===================================== */

        .aviso-evolut {

            position:
                fixed;

            left:
                50%;

            bottom:
                30px;

            transform:
                translateX(-50%);

            z-index:
                10000;

            max-width:
                calc(100% - 40px);

            padding:
                13px 20px;

            border-radius:
                10px;

            background:
                #172033;

            color:
                #ffffff;

            font-size:
                14px;

            box-shadow:
                0 10px 30px
                rgba(0,0,0,.22);

            animation:
                avisoEntrada
                .25s ease;

        }


        @keyframes avisoEntrada {

            from {

                opacity:
                    0;

                transform:
                    translate(
                        -50%,
                        10px
                    );

            }

            to {

                opacity:
                    1;

                transform:
                    translateX(-50%);

            }

        }


        /* =====================================
           CONFIRMACIÓN
        ===================================== */

        .modal-confirmacion-overlay {

            position:
                fixed;

            inset:
                0;

            z-index:
                99999;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            background:
                rgba(
                    2,
                    8,
                    30,
                    .72
                );

            backdrop-filter:
                blur(6px);

        }


        .modal-confirmacion {

            width:
                min(
                    430px,
                    calc(100% - 40px)
                );

            padding:
                30px;

            border-radius:
                20px;

            background:
                #ffffff;

            box-shadow:
                0 25px 70px
                rgba(0,0,0,.35);

        }


        .modal-confirmacion h3 {

            margin:
                0 0 10px;

            color:
                #172033;

        }


        .modal-confirmacion p {

            margin:
                0;

            color:
                #667085;

            line-height:
                1.5;

        }


        .modal-confirmacion-botones {

            display:
                flex;

            justify-content:
                flex-end;

            gap:
                10px;

            margin-top:
                25px;

        }


        .modal-confirmacion-botones button {

            border:
                none;

            border-radius:
                9px;

            padding:
                10px 18px;

            font-family:
                inherit;

            font-weight:
                600;

            cursor:
                pointer;

        }


        .btn-confirmar-cancelar {

            background:
                #eef2f7;

            color:
                #344054;

        }


        .btn-confirmar-eliminar {

            background:
                #ef4444;

            color:
                #ffffff;

        }

    `;


    document.head.appendChild(
        estilos
    );

}


// ============================================================
// CONFIRMACIÓN ELIMINAR
// ============================================================

function abrirConfirmacionEliminar(
    id,
    elemento,
    titulo
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "modal-confirmacion-overlay";


    overlay.innerHTML = `

        <div
            class="modal-confirmacion">

            <h3>
                ¿Eliminar reflexión?
            </h3>

            <p>

                Estás a punto de eliminar:

                <strong>
                    ${escapeHtml(titulo)}
                </strong>

                <br><br>

                Esta acción no se puede deshacer.

            </p>

            <div
                class="modal-confirmacion-botones">

                <button
                    type="button"
                    class="btn-confirmar-cancelar">

                    Cancelar

                </button>

                <button
                    type="button"
                    class="btn-confirmar-eliminar">

                    Eliminar

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    overlay
        .querySelector(
            ".btn-confirmar-cancelar"
        )
        .addEventListener(
            "click",
            () => {

                overlay.remove();

            }
        );


    overlay
        .querySelector(
            ".btn-confirmar-eliminar"
        )
        .addEventListener(
            "click",
            async () => {

                overlay.remove();

                await ejecutarEliminacion(
                    id,
                    elemento
                );

            }
        );

}


// ============================================================
// EJECUTAR ELIMINACIÓN
// ============================================================

async function ejecutarEliminacion(id, elemento) {

    try {

        const usuarioGuardado =
            localStorage.getItem("usuario");


        if (!usuarioGuardado) {

            throw new Error(
                "No se encontró la sesión del usuario."
            );

        }


        const usuario =
            JSON.parse(usuarioGuardado);


        if (!usuario || !usuario.id) {

            throw new Error(
                "La información del usuario no es válida."
            );

        }


        const respuesta =
            await fetch(
                `${API_URL}/conversaciones/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        usuario_id: usuario.id
                    })
                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                "No fue posible eliminar la conversación."
            );

        }


        elemento.remove();


        if (
            String(conversacionActual) ===
            String(id)
        ) {

            conversacionActual =
                null;

            categoriaSeleccionada =
                null;

            ultimoMensajeEnviado =
                null;

            mostrarEstadoInicial();

        }

    }

    catch (error) {

        console.error(
            "Error eliminando conversación:",
            error
        );


        mostrarAviso(
            error.message
        );

    }

}


// ============================================================
// ESTADO INICIAL
// ============================================================

function mostrarEstadoInicial() {

    chatArea.innerHTML = `

        <div
            id="emptyState"
            class="empty-state">

            <div
                class="empty-chat-icon">

                💬

            </div>

            <h2>
                Inicia tu reflexión
            </h2>

            <p>
                Escribe tu mensaje y comencemos
            </p>

        </div>

    `;

}


// ============================================================
// AGREGAR MENSAJE AL CHAT
// ============================================================

function agregarMensajeAlChat(
    contenido,
    rol
) {

    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (emptyState) {
        emptyState.remove();
    }


    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        rol === "usuario"
            ? "mensaje usuario"
            : "mensaje ia";


    const burbuja =
        document.createElement(
            "div"
        );


    burbuja.className =
        "burbuja";


    if (
        rol === "usuario"
    ) {

        burbuja.textContent =
            contenido;

    }

    else {

        burbuja.innerHTML =
            formatearRespuestaIA(
                contenido
            );

    }


    mensaje.appendChild(
        burbuja
    );


    chatArea.appendChild(
        mensaje
    );


    desplazarChat();

}


// ============================================================
// FORMATEAR RESPUESTA IA
// ============================================================

function formatearRespuestaIA(
    texto
) {

    if (!texto) {
        return "";
    }


    let resultado =
        escapeHtml(
            texto
        );


    resultado =
        resultado.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    resultado =
        resultado.replace(
            /\n/g,
            "<br>"
        );


    return resultado;

}


// ============================================================
// SCROLL
// ============================================================

function desplazarChat() {

    if (!chatArea) {
        return;
    }


    chatArea.scrollTop =
        chatArea.scrollHeight;

}


// ============================================================
// AVISO
// ============================================================

function mostrarAviso(
    mensaje
) {

    const anterior =
        document.querySelector(
            ".aviso-evolut"
        );


    if (anterior) {
        anterior.remove();
    }


    const aviso =
        document.createElement(
            "div"
        );


    aviso.className =
        "aviso-evolut";


    aviso.textContent =
        mensaje;


    document.body.appendChild(
        aviso
    );


    setTimeout(
        () => {

            if (aviso) {
                aviso.remove();
            }

        },
        3500
    );

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escapeHtml(
    texto
) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}