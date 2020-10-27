const formularioContacto = document.querySelector('#contacto'),
        listadoContactos = document.querySelector('#listado-contactos tbody'),
        inputBuscardor = document.querySelector('#buscar');

eventListeners();

function eventListeners(){
    // cuando los formularios se ejecutan
    formularioContacto.addEventListener('submit', leerFormulario); 
    // Listener para eliminar el boton
    if(listadoContactos) {
         listadoContactos.addEventListener('click', eliminarContacto);
    }
    inputBuscardor.addEventListener('input',buscarContactos);
    numeroContactos();
}
function leerFormulario(e){
    e.preventDefault();
    // leyendo los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;
    if(nombre === '' || empresa === '' || telefono === ''){
        // 2 parametros: texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else{
        // pasa la validación y creamos el llamado a AJAX
        const infoContacto = new FormData();
        infoContacto.append('nombre',nombre);
        infoContacto.append('empresa',empresa);
        infoContacto.append('telefono',telefono);
        infoContacto.append('accion',accion);
        // console.log(infoContacto); si lo dejo asì no me imprime nada, tengo que hacerlo así:
        // console.log(...infoContacto);
        if (accion === 'crear') {
            // creo la función insertar en la BD
            insertarBD(infoContacto);
        }else{
            // editar datos
            // leyendo el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }

    }
}
// insertando DATOS con AJAX
function insertarBD(datos) {
    // llamando a AJAX
    // Creando el objeto
    const xhr = new XMLHttpRequest();
    // abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-contacto-crear.php', true);
    // pasar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            // normal se imprime como string
            // con el .parse lo convierto en objeto
            console.log(JSON.parse(xhr.responseText));
            // si lo pongo en una variable puede acceder a un dato especifico
            // así: // console.log(respuesta.empresa);            
            const respuesta = JSON.parse(xhr.responseText);
            //insertando un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');//Aca se usa respuesta para llamar el objeto, datos para acceder a ellos y por ultimo el campo
            nuevoContacto.innerHTML = `
            <td>${respuesta.datos.nombre}</td> 
            <td>${respuesta.datos.empresa}</td>
            <td>${respuesta.datos.telefono}</td>
            `;

            // En los siguientes comandos se crea la casilla "td", luego la etiqueta "i" que es donde vienen los iconos
            // del fontawesome, le agregamos las clases de ese icono y por ultimo recordemos
            // que como son botones van dentro de una "a", creamos la "a" y al final metemos la etiqueta "i"
            // dentro de esta con el appendChild, como la estructura del html, la i va dentro de la a
            // crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');
            // creando el icono de editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas','fa-pen-square');
            // creando el a
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`; //inserto el href al a
            btnEditar.classList.add('btn','btn-editar');//el añadimos clases al enlace
            contenedorAcciones.appendChild(btnEditar);// ahora metemos el enlace en el td

            // creando el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas','fa-trash-alt');
            const btnEliminar = document.createElement('button');
            // agregando al padre
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');
            // agregando al padre
            contenedorAcciones.appendChild(btnEliminar);

            // agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);
            // agregandolo a la tabla
            listadoContactos.appendChild(nuevoContacto);

            // Reseteando el formulario cada que añade para que se limpie
            document.querySelector('form').reset();
            // notificacion al añadir
            mostrarNotificacion('Contacto Creado Con Exito', 'correcto');
            numeroContactos();
        }
    }
    // enviar los datos
    xhr.send(datos);
}
function actualizarRegistro(datos){
    // operaciones AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST','inc/modelos/modelo-contacto-editar.php',true)
    xhr.onload = function () {
        if (this.status===200) {
            console.log(xhr.responseText)
            const resultado = JSON.parse(xhr.responseText);
            if (resultado.respuesta === 'correcto') {
                // mostrando notificacion
                mostrarNotificacion('Contacto Actualizado', 'correcto');
            }else{
                mostrarNotificacion('Hubo un Error', 'error');
            }
            // volver al index
            setTimeout(()=>{
                window.location.href = 'index.php';
            }, 2000);
        }
    }
    xhr.send(datos);
}
function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        // tomamos el id
        const id = e.target.parentElement.getAttribute('data-id');
        // preguntar al usuario si esta seguro
        const respuesta = confirm('¿Estás Seguro(a)?');
        if (respuesta) {
             // Creando el objeto
            const xhr = new XMLHttpRequest();
            // abrir la conexión -> ACÁ USAMOS GET POR QUE QUEREMOS OBTENER EL ID
            xhr.open('GET', `inc/modelos/modelo-contacto-eliminar.php?id=${id}&accion=borrar`, true);
            // pasar los datos
            xhr.onload = function() {
                if(this.status===200){
                    console.log(xhr.responseText); 
                    const resultado = JSON.parse(xhr.responseText);
                    if (resultado.respuesta === 'correcto') {
                        // Eliminar el registro del DOM
                        // console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();

                        // mostrando notificacion
                        mostrarNotificacion('Eliminado Correctamente', 'correcto');
                        numeroContactos();
                    }else{
                        mostrarNotificacion('Hubo un Error', 'error');
                    }
                }
            }
            
               // enviar la petición
               xhr.send();
        }
    }
}
// mostrando la notificacions
function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // formulario
    formularioContacto.insertBefore(notificacion, document.querySelector('form legend'));
    // ocultar y mostrar notificacion
    setTimeout(()=>{
        notificacion.classList.add('visible');
        setTimeout(()=>{
            notificacion.classList.remove('visible');
            setTimeout(()=>{
                notificacion.remove();
            },500);
        },3000);
    }, 100)
}
// buscador
function buscarContactos(e){
    const expresion = new RegExp(e.target.value, "i"),
          registros = document.querySelectorAll('tbody tr');

          registros.forEach(registro =>{
                registro.style.display = 'none';
                if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) !=-1) {
                    registro.style.display = 'table-row';
                }
                numeroContactos();
          });
}
// numero de contactos
function numeroContactos(){
    const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contacto span');
    let total = 0;
    totalContactos.forEach(contacto =>{
        if (contacto.style.display==='' || contacto.style.display==='table-row') {
            total++;
        }
    });
    contenedorNumero.textContent = total;
}