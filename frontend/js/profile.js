const usuario = JSON.parse(localStorage.getItem("usuario"));

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");

const btnHome = document.getElementById("btnHome");
const btnSalir = document.getElementById("btnSalir");

if (!usuario) {

    window.location.href = "login.html";

}

nombre.textContent = usuario.nombre;

correo.textContent = usuario.correo;

btnHome.addEventListener("click", () => {

    window.location.href = "home.html";

});

btnSalir.addEventListener("click", () => {

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    window.location.href = "login.html";

});