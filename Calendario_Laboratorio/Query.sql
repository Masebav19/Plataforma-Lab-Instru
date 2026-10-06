

CREATE DATABASE instrucalendar;

USE instrucalendar;

CREATE TABLE feriados(
    id Int AUTO_INCREMENT NOT NULL,
    Year Int NOT NULL,
    Month Int NOT NULL,
    Date Int NOT NULL,
    Nombre TEXT NOT NULL,
    Tipo TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE integrantes (
    UUID VARCHAR(36) not null UNIQUE,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    correo VARCHAR(200) not null UNIQUE,
    Tipo TEXT NOT NULL,
    PRIMARY KEY (UUID)
);

CREATE Table credenciales(
    Id Int AUTO_INCREMENT NOT NULL,
    UUID VARCHAR(36) NOT null UNIQUE,
    password TEXT not null,
    PRIMARY KEY (Id),
    FOREIGN KEY (UUID) REFERENCES integrantes(UUID)
);

DROP TABLE IF EXISTS sesiones;
CREATE TABLE sesiones(
    Id int NOT NULL AUTO_INCREMENT UNIQUE,
    Year int not NULL,
    Month int not null,
    Date int not null,
    Asunto text not null,
    Hora_inicial VARCHAR(5),
    Hora_final VARCHAR(5),
    Periodicidad VARCHAR(100) DEFAULT("Ninguna"),
    Responsable TEXT,
    Correo_responsable TEXT,
    fecha_inicio TEXT,
    Equipos_usados TEXT,
    laboratorio VARCHAR(100),
    PRIMARY KEY (Id)
);

DROP TABLE IF EXISTS ticket;
CREATE TABLE ticket(
    id_ticket VARCHAR(21) UNIQUE not null,
    id_session int not null,
    UUID_usuario VARCHAR(36) not null,
    fecha_registro TEXT,
    fecha_cierre TEXT,
    observaciones text,
    image_path text,
    equipos_usados text,
    PRIMARY KEY (id_ticket),
    Foreign Key (id_session) REFERENCES sesiones(Id)
)

DROP TABLE IF EXISTS lab_logs_sessions;

CREATE TABLE lab_logs_sessions(
    id_log INT AUTO_INCREMENT NOT NULL,
    UUID VARCHAR(36) NOT NULL,
    correo TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    Resultado TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT(CURRENT_TIME),
    PRIMARY KEY (id_log)
);


insert into feriados(Year, Month, Date, Nombre, Tipo) VALUES
(2026, 0, 1, "Año Nuevo", "Feriado"),
(2026, 0, 2, "Día puente Año Nuevo", "Feriado"),
(2026, 1, 16, "Carnaval", "Feriado"),
(2026, 1, 17, "Carnaval", "Feriado"),
(2026, 3, 3, "Viernes Santo", "Feriado"),
(2026, 4, 1, "Día del Trabajo", "Feriado"),
(2026, 4, 25, "Batalla de Pichincha (Traslado al Lunes)", "Feriado"),
(2026, 7, 10, "Primer Grito de la Independencia", "Feriado"),
(2026, 9, 12, "Semana de integración Politécnica", "Feriado"),
(2026, 9, 13, "Semana de integración Politécnica", "Feriado"),
(2026, 9, 14, "Semana de integración Politécnica", "Feriado"),
(2026, 9, 15, "Semana de integración Politécnica", "Feriado"),
(2026, 9, 16, "Semana de integración Politécnica", "Feriado"),
(2026, 9, 9, "Independencia de Guayaquil", "Feriado"),
(2026, 10, 2, "Día de los Difuntos", "Feriado"),
(2026, 10, 3, "Independencia de Cuenca", "Feriado"),
(2026, 10, 20, "Festival de Artes Vivas de Loja (Decreto)", "Feriado"),
(2026, 11, 24, "Receso Navidad", "Feriado"),
(2026, 11, 25, "Receso Navidad", "Feriado"),
(2026, 11, 26, "Receso Navidad", "Feriado"),
(2026, 11, 27, "Receso Navidad", "Feriado"),
(2026, 11, 28, "Receso Navidad", "Feriado"),
(2026, 11, 29, "Receso Navidad", "Feriado"),
(2026, 11, 30, "Receso Navidad", "Feriado"),
(2026, 11, 31, "Receso Navidad", "Feriado"),
(2027, 0, 1, "Receso Navidad", "Feriado"),
(2027, 1, 8, "Carnaval", "Feriado"),
(2027, 1, 9, "Carnaval", "Feriado"),
(2027, 2, 26, "Viernes Santo", "Feriado"),
(2027, 4, 1, "Día del Trabajo", "Feriado"),
(2027, 4, 24, "Batalla de Pichincha", "Feriado"),
(2027, 7, 13, "Primer Grito de la Independencia", "Feriado"),
(2027, 9, 11, "Independencia de Guayaquil", "Feriado"),
(2027, 10, 2, "Día de los Difuntos", "Feriado"),
(2027, 11, 3, "Independencia de Cuenca", "Feriado"),
(2027, 11, 25, "Navidad", "Feriado"),
(2026, 9, 26, "Jornadas FIEE", "Feriado"),
(2026, 9, 27, "Jornadas FIEE", "Feriado"),
(2026, 9, 28, "Jornadas FIEE", "Feriado"),
(2026, 9, 29, "Jornadas FIEE", "Feriado"),
(2026, 9, 30, "Jornadas FIEE", "Feriado")


SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NULL;
SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NOT NULL;

SELECT image_path FROM ticket WHERE id_ticket = "00SvvP7kanzeayoWKdkNu";

SELECT * FROM sesiones WHERE Asunto = "Reserva" AND Hora_inicial = "09:00" AND Year=2026 AND Month=1 AND Date=13;

SELECT * FROM sesiones WHERE laboratorio = 'redes' AND Year = 2026 AND Month = 8 AND Date BETWEEN 28 AND 31
EXCEPT SELECT * FROM sesiones WHERE LOWER(Asunto) LIKE '%Reserva%';

SELECT * FROM sesiones WHERE LOWER(Asunto) LIKE '%Reserva%'