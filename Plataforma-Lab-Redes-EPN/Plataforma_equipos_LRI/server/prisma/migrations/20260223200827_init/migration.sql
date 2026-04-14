-- CreateTable
CREATE TABLE `devicelist` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` MEDIUMTEXT NOT NULL,
    `Tipo` VARCHAR(20) NOT NULL,
    `Marca` VARCHAR(30) NOT NULL,
    `Modelo` VARCHAR(100) NOT NULL,
    `Especificaciones` TEXT NOT NULL,
    `Cantidad` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestamo_equipos` (
    `Prestamos_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `Modelo` VARCHAR(100) NOT NULL,
    `Direccion_IP` VARCHAR(15) NOT NULL DEFAULT 'Ninguno',
    `Estado` VARCHAR(30) NOT NULL,
    `Estado_prestamo` VARCHAR(30) NOT NULL,
    `Fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deviceID` INTEGER NOT NULL,
    `DocenteResponsable` VARCHAR(100) NOT NULL DEFAULT '',
    `ModulosExpansion` VARCHAR(500) NOT NULL DEFAULT '',
    `Observacion` VARCHAR(500) NOT NULL DEFAULT '',

    PRIMARY KEY (`Prestamos_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `Modelo` VARCHAR(100) NOT NULL,
    `Direccion_IP` VARCHAR(15) NOT NULL,
    `Estado` VARCHAR(500) NOT NULL,
    `Actividades` TEXT NOT NULL,
    `Fecha_Inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Fecha_Fin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labuser` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Lab_User` VARCHAR(20) NOT NULL,
    `Lab_Password` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
