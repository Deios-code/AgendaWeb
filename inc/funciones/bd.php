<?php
// credenciales
define('DB_USUARIO', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost'); //si se trabaja con un servidor local se usa la IP
define('DB_NOMBRE', 'agenda');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE); //esto recibe 5 parametros, 4 son obligatorios
// el 5 es el puerto en caso de que no quiera conectar y todo esté bien

//echo $conn->ping(); //esta es una forma de verificar si se conecta, tendría que arrojar 1