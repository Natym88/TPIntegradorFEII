/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
  if (texto.length === 0) {
    return false;
  } else {
    return true;
  }
}

function normalizarTexto(texto) {}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return false;
  } else {
    return true;
  }
}

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
  const rg1 = /[a-z]/;
  const rg2 = /[A-Z]/;
  const rg3 = /[0-9]/;

  if (
    contrasenia.length < 8 ||
    !contrasenia.match(rg1) ||
    !contrasenia.match(rg2) ||
    !contrasenia.match(rg3)
  ) {
    return false;
  } else {
    return true;
  }
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
  if (contrasenia_1 === contrasenia_2) {
    return true;
  } else {
    return false;
  }
}

/* -------------------------------- otros -------------------------------- */
function cargarToken() {
  return localStorage.getItem("jwt");
}

function guardarToken(jwt) {
  localStorage.setItem("jwt", jwt);
}

function validarLogin({ email, password }) {
  if ([email, password].includes("")) {
    return "Todos los campos son obligatorios";
  } else if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return "El formato del email es incorrecto";
  }

  return "";
}

function validarRegistro(nuevoUsuario) {
  errores = [];
  if (!validarTexto(nuevoUsuario.firstName)) {
    errores.push("El nombre no es válido");
  }

  if (!validarTexto(nuevoUsuario.lastName)) {
    errores.push("El apellido no es válido");
  }

  if (!validarEmail(nuevoUsuario.email)) {
    errores.push("El email no es válido");
  }

  if (!validarContrasenia(nuevoUsuario.password)) {
    errores.push("La contraseña no cumple los estandares de seguridad");
  }

  if (!compararContrasenias(nuevoUsuario.password, nuevoUsuario.password2)) {
    errores.push("La contraseñas no coinciden");
  }

  return errores;
}
