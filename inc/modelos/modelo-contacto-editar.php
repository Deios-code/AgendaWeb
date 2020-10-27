<?php
if($_POST['accion'] == 'editar'){
    require_once('../funciones/bd.php');
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    try{
        $stmt = $conn->prepare("UPDATE contactos SET nombre=?, empresa=?, telefono=? WHERE id=?"); //haciendo la insercion con statement
        // esto se hace para evitar inyeccion SQL
        $stmt->bind_param("sssi", $nombre, $empresa, $telefono, $id); //las S significa que los datos a insertar son tipo string
        $stmt->execute();
        if ($stmt->affected_rows == 1) {//ese affected_rows me muestra si altero la tabla
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}