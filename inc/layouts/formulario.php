<div class="campos">
    <div class="campo">
        <label for="nombre">Nombre:</label>
        <input type="text" placeholder="Nombre Contacto" id="nombre" value="<?php echo ($contacto['nombre']) ? $contacto['nombre']:''; ?>">
    </div>
    <div class="campo">
        <label for="empresa">Empresa:</label>
        <input type="text" placeholder="Nombre Empresa" id="empresa" value="<?php echo ($contacto['empresa']) ? $contacto['empresa']:''; ?>">
    </div>
    <div class="campo">
        <label for="telefono">Teléfono:</label>
        <input type="tel" placeholder="Numero Contacto" id="telefono" value="<?php echo ($contacto['telefono']) ? $contacto['telefono']:''; ?>">
    </div>
    <div class="campo enviar">
    <?php
        $textoBtn = ($contacto['nombre']) ? 'Guardar' : 'Añadir';
        $accion = ($contacto['nombre']) ? 'editar' : 'crear';
    ?>
        <input type="hidden" id="accion" value="<?php echo $accion ?>">
        <?php if( isset($contacto['id'])) {?>
        <input type="hidden" id="id" value="<?php echo $contacto['id'] ?>">
        <?php } ?>
        <input type="submit" value="<?php echo $textoBtn ?>">
    </div>
</div>
<!-- ese php usado es un tipo de condicional, si existe $contacto[telefono] ? entonces muestrelo, si no : muestre vacio ''-->