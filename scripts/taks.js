// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const formCrearTarea = this.document.forms[0];
  const inputTarea = this.document.querySelector("#nuevaTarea");
  const btnCrearTarea = this.document.querySelector("#btn-nueva-tarea");
  const btnCerrarSesion = this.document.querySelector("#closeApp");
  const nombreUsuario = this.document.querySelector(".user-info p");
  const ulTareasTerminadas = this.document.querySelector(".tareas-terminadas");
  const ulTareasPendientes = this.document.querySelector(".tareas-pendientes");
  const spanTareasFinalizadas = this.document.querySelector(
    "#cantidad-finalizadas"
  );

  const jwt = localStorage.getItem("jwt");
  const ENDPOINTBASE = "https://ctd-todo-api.herokuapp.com/v1";

  if (!jwt) {
    // usamos el replace para no guardar en el historial la url anterior
    location.replace("/");
  } else {
    obtenerNombreUsuario();
    consultarTareas();
  }

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    const confirmacion = confirm("¿Quieres cerrar sesión?");
    if (confirmacion) {
      localStorage.clear();
      location.replace("/");
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
        authorization: jwt,
      },
    };

    fetch(url, configuraciones)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        nombreUsuario.textContent = data.firstName;
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const url = `${ENDPOINTBASE}/tasks`;
    const configuraciones = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(url, configuraciones)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        renderizarTareas(data);
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Se crea una nueva tarea");
    console.log(nuevaTarea.value);

    const payload = {
      description: nuevaTarea.value,
      completed: false,
    };
    const url = `${ENDPOINTBASE}/tasks`;
    const configuraciones = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify(payload),
    };

    fetch(url, configuraciones)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        consultarTareas();
      });
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    ulTareasTerminadas.innerHTML = "";
    ulTareasPendientes.innerHTML = "";
    const listadoTareasCompletas = listado.filter((tarea) => tarea.completed);
    const listadoTareasNoCompletas = listado.filter(
      (tarea) => !tarea.completed
    );

    spanTareasFinalizadas.textContent = listadoTareasCompletas.length;

    listadoTareasCompletas.forEach((tarea) => {
      ulTareasTerminadas.innerHTML += `
      <li class="tarea" data-aos="fade-down">
        <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${tarea.createdAt}</p>
        </div>
      </li>
      `;
    });

    listadoTareasNoCompletas.forEach((tarea) => {
      ulTareasPendientes.innerHTML += `
      <li class="tarea" data-aos="fade-up">
        <div id=${tarea.id} class="hecha change">
          <i  class="fa-regular fa-circle-check "></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
            <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `;
    });
    const btnCambiarEstado = this.document.querySelectorAll(".change");
    console.log(btnCambiarEstado);
    btnCambiarEstado.forEach((boton) => {
      boton.addEventListener("click", () => {
        const tarea = listado.find((t) => t.id == boton.id);
        botonesCambioEstado(boton.id, tarea);
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(id, tarea) {
    const url = `${ENDPOINTBASE}/tasks/${id}`;
    console.log(url, tarea);
    const payload = {
      description: tarea.description,
      completed: !tarea.completed,
    };
    configuraciones = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify(payload),
    };

    fetch(url, configuraciones)
      .then((res) => res.json())
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
