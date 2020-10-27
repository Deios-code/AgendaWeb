<?php 
    include 'inc/layouts/header.php';
    include 'inc/funciones/funciones.php' ;
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

    if (!$id) {
        die('no es valido');
    }
    $resultado = obtenerContacto($id);
    $contacto = $resultado->fetch_assoc();
?>
    <div class="contenedor-barra">
        <div class="contenedor barra">
            <a href="index.php" class="btn btn-volver">Volver</a>
            <h1>Editar Contacto</h1>
        </div>
    </div>
    <div class="bg-secundario contenedor sombra">
        <!-- Como lo vamos a llenar por medio de ajax, al action le ponemos un # -->
        <form action="#" id="contacto">
            <legend>Edite el Contacto</legend>
            <?php include 'inc/layouts/formulario.php' ?>
        </form>
    </div>
<?php include 'inc/layouts/footer.php' ?>