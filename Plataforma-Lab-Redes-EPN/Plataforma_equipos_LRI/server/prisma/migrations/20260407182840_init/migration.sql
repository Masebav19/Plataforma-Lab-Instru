-- AlterTable
ALTER TABLE `devicelist` MODIFY `Tipo` VARCHAR(100) NOT NULL,
    MODIFY `Marca` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `labuser` MODIFY `Lab_Password` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `mantenimiento` MODIFY `Nombre` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `Direccion_IP` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `prestamo_equipos` MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `Estado` VARCHAR(100) NOT NULL,
    MODIFY `Estado_prestamo` VARCHAR(100) NOT NULL;
