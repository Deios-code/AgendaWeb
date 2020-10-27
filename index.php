<?php 
    error_reporting(E_ALL ^ E_NOTICE);
    include 'inc/funciones/funciones.php';
    include 'inc/layouts/header.php' 
?>
    <div class="contenedor-barra">
        <h1>Agenda de Contactos</h1>
    </div>
    <div class="bg-secundario contenedor sombra">
        <!-- Como lo vamos a llenar por medio de ajax, al action le ponemos un # -->
        <form action="#" id="contacto">
            <legend>Añada un Campo <span>Todos los campos son obligatorios</span></legend>
            <?php include 'inc/layouts/formulario.php' ?>
        </form>
    </div>
    <div class="bg-white contenedor sombra contactos">
        <div class="contenedor-contactos">
            <h2>Contactos</h2>
            <input type="text" id="buscar" class="buscador sombra" placeholder="buscar contactos">
            <p class="total-contacto"><span></span> Contactos</p>
            <div class="contenedor-tabla">
                <table id="listado-contactos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Empresa</th>
                            <th>Telefóno</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $contactos = obtenerContactos();
                            if ($contactos->num_rows) {
                            foreach ($contactos as $contacto) {?>
                        <tr>
                            <td><?php echo $contacto['nombre']; ?></td>
                            <td><?php echo $contacto['empresa']; ?></td>
                            <td><?php echo $contacto['telefono']; ?></td>
                            <td>
                                <a href="editar.php?id=<?php echo $contacto['id']; ?>" class="btn btn-editar">
                                    <i class="fas fa-pen-square"></i>
                                </a>
                                <button data-id="<?php echo $contacto['id']; ?>" type="button"  class="btn-borrar btn">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                           <?php } } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
<?php include 'inc/layouts/footer.php' ?>