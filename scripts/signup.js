window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */

  const form = this.document.querySelector("form");
  const nombre = document.getElementById("inputNombre");
  const apellido = document.getElementById("inputApellido");
  const email = document.getElementById("inputEmail");
  const password = document.getElementById("inputPassword");
  const password2 = document.getElementById("inputPasswordRepetida");
  const divErrores = this.document.querySelector(".errores");
  const botonCrear = this.document.querySelector("#botonCrear");
  divErrores.classList.add("hidden");

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const newUser = {
      firstName: nombre.value,
      lastName: apellido.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    };

    const validacion = validarRegistro(newUser);

    if (validacion.length > 0) {
      console.error("Error", validacion);
      divErrores.classList.remove("hidden");
      divErrores.innerHTML = "<p>¡Ojo con estos errores!</p>";
      divErrores.innerHTML += validacion
        .map((error) => `<li>${error}</li>`)
        .join("");
    } else {
      console.log("Hacer registro");
      botonCrear.textContent = "Cargando";
      realizarRegister(newUser);
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(body) {
    const url = "https://ctd-todo-api.herokuapp.com/v1/users";
    const payload = JSON.stringify(body);
    const config = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: payload,
    };

    fetch(url, config)
      .then((res) => res.json())
      .then((data) => {
        botonCrear.textContent = "Crear cuenta";
        if (data.jwt) {
          guardarToken(data.jwt);
          const mensaje = `
          <p>Genial tu registro fue exitoso 
          <br/>
          Ahora puedes iniciar sesion
          <br/> 
          Seras redirigido(a) en unos momentos
         </p>
         `;
          renderizarMensaje(mensaje);
          setTimeout(() => {
            window.location.replace("/mis-tareas.html");
          }, 3000);
        } else {
          const err2 = `
            <p>No pudimos crear la cuenta. 
            <br/> 
            Intenta nuevamente</p>
            <p>${data}</p>
           `;
          renderizarMensaje(err2);
        }
      });
  }

  function renderizarMensaje(error) {
    divErrores.classList.remove("hidden");
    divErrores.innerHTML = error;
  }
});
