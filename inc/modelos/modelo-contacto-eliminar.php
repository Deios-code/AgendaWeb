<?php
   
   if($_GET['accion'] == 'borrar') {
    require_once('../funciones/bd.php');
    
    $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
    // acá se elimina de la BD pero tambien debemos eliminarlo del DOM
    // para que le aparezca en tiempo real al usuario cuando haga algún cambio
    try{
        $stmt = $conn->prepare("DELETE FROM contactos WHERE id = ?"); //eliminando con statement
        // esto se hace para evitar inyeccion SQL
        $stmt->bind_param("i", $id); //las i significa que el dato es tipo int
        $stmt->execute();
        if ($stmt->affected_rows == 1) {//ese affected_rows me muestra si altero la tabla
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        }else{
            $respuesta = array(
                'respuesta' => 'error'
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