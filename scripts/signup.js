window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */

    const form = this.document.querySelector("form")




    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {

        event.preventDefault()

        const nombre = document.getElementById("inputNombre");
        const apellido = document.getElementById("inputApellido");
        const email = document.getElementById("inputEmail");
        const password = document.getElementById("inputPassword");

        const newUser = {
            firstName: nombre.value,
            lastName: apellido.value,
            email: email.value,
            password: password.value
        }


        realizarRegister(newUser)


    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {


        const url = "https://ctd-todo-api.herokuapp.com/v1/users";
        const payload = JSON.stringify(settings);
        const config = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: payload
        }

        fetch(url, config).then(res => res.json()).then(data => {
            if(data.jwt){
            localStorage.setItem("jwt", data.jwt);
            location.replace("/mis-tareas.html");}
        })

    };


});