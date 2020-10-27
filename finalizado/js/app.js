const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody'), 
      inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
     // Cuando el formulario de crear o editar se ejecuta
     formularioContactos.addEventListener('submit', leerFormulario);

     // Listener para eliminar el boton
     if(listadoContactos) {
          listadoContactos.addEventListener('click', eliminarContacto);
     }

     // buscador
     inputBuscador.addEventListener('input', buscarContactos);
     
     numeroContactos();
}

function leerFormulario(e) {
     e.preventDefault();

     // Leer los datos de los inputs
     const nombre = document.querySelector('#nombre').value,
           empresa = document.querySelector('#empresa').value,
           telefono = document.querySelector('#telefono').value, 
           accion = document.querySelector('#accion').value;

     if(nombre === '' || empresa === '' || telefono === '') {
          // 2 parametros: texto y clase
          mostrarNotificacion('Todos los Campos son Obligatorios', 'error');
     } else {
          // Pasa la validación, crear llamado a Ajax
          const infoContacto = new FormData();
          infoContacto.append('nombre', nombre);
          infoContacto.append('empresa', empresa);
          infoContacto.append('telefono', telefono);
          infoContacto.append('accion', accion);

          // console.log(...infoContacto);

          if(accion === 'crear'){
               // crearemos un nuevo contacto
               insertarBD(infoContacto);
          } else {
               // editar el contacto
               // leer el Id
               const idRegistro = document.querySelector('#id').value;
               infoContacto.append('id', idRegistro);
               actualizarRegistro(infoContacto);
          }
     }
}
/** Inserta en la base de datos via Ajax */
function insertarBD(datos) {
     // llamado a ajax

     // crear el objeto
     const xhr = new XMLHttpRequest();

     // abrir la conexion
     xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

     // pasar los datos
     xhr.onload = function() {
          if(this.status === 200) {
               console.log(JSON.parse( xhr.responseText) ); 
               // leemos la respuesta de PHP
               const respuesta = JSON.parse( xhr.responseText);

               // Inserta un nuevo elemento a la tabla
               const nuevoContacto = document.createElement('tr');

               nuevoContacto.innerHTML = `
                    <td>${respuesta.datos.nombre}</td>
                    <td>${respuesta.datos.empresa}</td>
                    <td>${respuesta.datos.telefono}</td>
               `;

               // crear contenedor para los botones
               const contenedorAcciones = document.createElement('td');

               // crear el icono de Editar
               const iconoEditar = document.createElement('i');
               iconoEditar.classList.add('fas', 'fa-pen-square');

               // crea el enlace para editar
               const btnEditar = document.createElement('a');
               btnEditar.appendChild(iconoEditar);
               btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
               btnEditar.classList.add('btn', 'btn-editar');

               // agregarlo al padre
               contenedorAcciones.appendChild(btnEditar);

               // crear el icono de eliminar
               const iconoEliminar = document.createElement('i');
               iconoEliminar.classList.add('fas', 'fa-trash-alt');

               // crear el boton de eliminar
               const btnEliminar = document.createElement('button');
               btnEliminar.appendChild(iconoEliminar);
               btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
               btnEliminar.classList.add('btn', 'btn-borrar');

               // agregarlo al padre
               contenedorAcciones.appendChild(btnEliminar);

               // Agregarlo al tr
               nuevoContacto.appendChild(contenedorAcciones);

               // agregarlo con los contactos
               listadoContactos.appendChild(nuevoContacto);       
               
               // Resetear el formulario
               document.querySelector('form').reset();

               // Mostrar la notificacion
               mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

               // Actualizar el número
               numeroContactos();
          }
     }

     // enviar los datos
     xhr.send(datos)
}

function actualizarRegistro(datos) {
     // crear el objeto
     const xhr = new XMLHttpRequest();

     // abrir la conexión
     xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

     // leer la respuesta
     xhr.onload = function() {
          if(this.status === 200) {
               const respuesta = JSON.parse(xhr.responseText);

               if(respuesta.respuesta === 'correcto'){
                    // mostrar notificación de Correcto
                    mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
               } else {
                    // hubo un error
                    mostrarNotificacion('Hubo un error...', 'error');
               }
               // Después de 3 segundos redireccionar
               setTimeout(() => {
                    window.location.href = 'index.php';
               }, 4000);
          }
     }

     // enviar la petición
     xhr.send(datos);
}
// Eliminar el Contacto
function eliminarContacto(e) {
     if( e.target.parentElement.classList.contains('btn-borrar') ) {
          // tomar el ID
          const id = e.target.parentElement.getAttribute('data-id');

          // console.log(id);
          // preguntar al usuario
          const respuesta = confirm('¿Estás Seguro (a) ?');

          if(respuesta) {
               // llamado a ajax
               // crear el objeto
               const xhr = new XMLHttpRequest();

               // abrir la conexión
               xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

               // leer la respuesta
               xhr.onload = function() {
                    if(this.status === 200) {
                         const resultado = JSON.parse(xhr.responseText);
                      
                         if(resultado.respuesta == 'correcto') {
                              // Eliminar el registro del DOM
                              console.log(e.target.parentElement.parentElement.parentElement);
                              e.target.parentElement.parentElement.parentElement.remove();

                              // mostrar Notificación
                              mostrarNotificacion('Contacto eliminado', 'correcto');

                              // Actualizar el número
                              numeroContactos();
                         } else {
                              // Mostramos una notificacion
                              mostrarNotificacion('Hubo un error...', 'error' );
                         }

                    }
               }

               // enviar la petición
               xhr.send();
          }
     }
}

// Notifación en pantalla
function mostrarNotificacion(mensaje, clase) {
     const notificacion = document.createElement('div');
     notificacion.classList.add(clase, 'notificacion', 'sombra');
     notificacion.textContent = mensaje;

     // formulario
     formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

     // Ocultar y Mostrar la notificacion
     setTimeout(() => {
          notificacion.classList.add('visible');
          setTimeout(() => {
               notificacion.classList.remove('visible');           
               setTimeout(() => {
                    notificacion.remove();
               }, 500)
          }, 3000);
     }, 100);

}

/** Buscador de registros */
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i" );
          registros = document.querySelectorAll('tbody tr');

          registros.forEach(registro => {
               registro.style.display = 'none';

               if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1 ){
                    registro.style.display = 'table-row';
               }
               numeroContactos();
          })
}

/** Muestra el número de Contactos */
function numeroContactos() {
     const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');

     let total = 0;

     totalContactos.forEach(contacto => {
          if(contacto.style.display === '' || contacto.style.display === 'table-row'){
               total++;
          }
     });

     // console.log(total);
     contenedorNumero.textContent = total;
}