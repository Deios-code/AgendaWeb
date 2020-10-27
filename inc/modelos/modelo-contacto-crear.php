<?php
if($_POST['accion'] == 'crear'){
    // crearemos un nuevo registro
    require_once('../funciones/bd.php');
    // validar las entradas y las limpia por si quieren ingresar basura
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);

    try{
        $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?,?,?)"); //haciendo la insercion con statement
        // esto se hace para evitar inyeccion SQL
        $stmt->bind_param("sss", $nombre, $empresa, $telefono); //las S significa que los datos a insertar son tipo string
        $stmt->execute();
        if ($stmt->affected_rows == 1) {//ese affected_rows me muestra si altero la tabla
            $respuesta = array(
                'respuesta' => 'correcto',
                'datos' => array(
                    'nombre' => $nombre,
                    'empresa' => $empresa,
                    'telefono' =>$telefono,
                    'id_insertado' => $stmt->insert_id //ESTE LO CREO PARA QUE AL DARLE EDITAR O ELIMINAR
                    //ME MANDE ESE VALOR Y PUEDA EJECUTAR LA ACCION
                )
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
// echo json_encode($_POST);
