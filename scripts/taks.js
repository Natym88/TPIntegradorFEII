// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
(function comprobacion() {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    // usamos el replace para no guardar en el historial la url anterior
    location.replace("/");
  }
})();
//comprobacion();

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = this.document.querySelector("#closeApp");
  const nombreUsuario = this.document.querySelector(".user-info p");
  const contenedorTareasPendientes =
    this.document.querySelector(".tareas-pendientes");
  const contenedorTareasTerminadas =
    this.document.querySelector(".tareas-terminadas");
  const nuevaTarea = this.document.querySelector("#nuevaTarea");
  const formCrearTarea = this.document.querySelector(".nueva-tarea");

  const ENDPOINTBASE = "https://ctd-todo-api.herokuapp.com/v1";
  const JWT = this.localStorage.getItem("jwt");
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    const confirmacion = confirm("Querés cerrar la app ?");

    if (confirmacion) {
      localStorage.clear();

      location.replace("./");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const url = `${ENDPOINTBASE}/users/getMe`;

    const configuraciones = {
      method: "GET",
      headers: {
        authorization: JWT,
      },
    };

    fetch(url, configuraciones)
      .then((ress) => ress.json())
      .then((data) => {
        console.log(data);

        nombreUsuario.innerText = data.firstName;
      });
  }
  obtenerNombreUsuario();
  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const url = `${ENDPOINTBASE}/tasks`;

    const configuraciones = {
      method: "GET",
      headers: {
        authorization: JWT,
      },
    };

    fetch(url, configuraciones)
      .then((ress) => ress.json())
      .then((data) => {
        console.log(data);
        renderizarTareas(data);
      });
  }
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();

    const nueva = {
      description: nuevaTarea.value,
      completed: false,
    };

    const configuraciones = {
      method: "POST",
      headers: {
        authorization: JWT,
        "content-type": "application/json",
      },
      body: JSON.stringify(nueva),
    };

    fetch(`${ENDPOINTBASE}/tasks`, configuraciones)
      .then((ress) => ress.json())
      .then((data) => {
        console.log(data);
        consultarTareas();
      });
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    contenedorTareasTerminadas.innerHTML = "";
    contenedorTareasPendientes.innerHTML = "";

    const listadoTareasCompletas = listado.filter((item) => item.completed);
    const listadoTareasPendientes = listado.filter((item) => !item.completed);

    //console.log(listadoTareasCompletas);
    //console.log(listadoTareasPendientes);

    listadoTareasPendientes.forEach((tarea) => {
      // por cada tarea inyectamos un nodo li
      contenedorTareasPendientes.innerHTML += `
      <li class="tarea" data-aos="fade-down">
        <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${tarea.createdAt}</p>
        </div>
      </li>
      `;
    });

    listadoTareasCompletas.forEach((tarea) => {
      // por cada tarea inyectamos un nodo li
      contenedorTareasTerminadas.innerHTML += `
      <li class="tarea" data-aos="fade-up">
        <div class="hecha">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `;
    });

    const botonesChange = document.querySelectorAll(".change");
    console.log(botonesChange);

    botonesChange.forEach((boton) => {
      boton.addEventListener("click", function (event) {
        botonesCambioEstado(event.target);
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(nodo) {
    console.log(nodo);

    const terminada = nodo.classList.contains("incompleta");

    const cambio = {
      completed: !terminada,
    };

    const configuraciones = {
      method: "PUT",
      headers: {
        authorization: JWT,
        "content-type": "application/json",
      },
      body: JSON.stringify(cambio),
    };

    fetch(`${ENDPOINTBASE}/tasks/${nodo.id}`, configuraciones)
      .then((ress) => ress.json())
      .then((data) => {
        console.log(data);
        consultarTareas();
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {}
});
