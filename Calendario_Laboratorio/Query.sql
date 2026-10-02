-- Active: 1790603982442@@172.29.72.183@3306@instrucalendar
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
    Mesas TEXT,
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
(2025,0,1,"Año Nuevo","Feriado"),
(2025,2,3,"Carnaval","Feriado"),
(2025,2,4,"Carnaval","Feriado"),
(2025,3,18,"Viernes Santo","Feriado"),
(2025,4,1,"Dia del Trabajo","Feriado"),
(2025,4,2,"Día del trabajo","Feriado"),
(2025,7,10,"Primer Grito de independencia","Feriado"),
(2025,7,11,"Primer Grito de independencia","Feriado"),
(2025,9,10,"Independencia de Guayaquil","Feriado"),
(2025,10,4,"Día de los difuntos","Feriado"),
(2025,11,24,"Receso de Navidad","Feriado"),
(2025,11,25,"Receso de Navidad","Feriado"),
(2025,11,26,"Receso de Navidad","Feriado"),
(2025,11,27,"Receso de Navidad","Feriado"),
(2025,11,28,"Receso de Navidad","Feriado"),
(2025,11,29,"Receso de Navidad","Feriado"),
(2025,11,30,"Receso de Navidad","Feriado"),
(2025,11,31,"Receso de Navidad","Feriado"),
(2026,0,1,"Receso de Navidad","Feriado"),
(2026,0,2,"Receso de Navidad","Feriado"),
(2026,1,16,"Carnaval","Feriado"),
(2026,1,17,"Carnaval","Feriado"),
(2026,3,3,"Viernes Santo","Feriado"),
(2026,4,1,"Día del trabajo","Feriado"),
(2026,3,30,"Día del trabajo","Feriado"),
(2026,4,25,"Batalla de Pichincha","Feriado"),
(2026,7,10,"Primer grito de independencia","Feriado"),
(2025,10,3,"Independencia de Cuenca","Feriado"),
(2025,10,12,"Jornadas FIEE","Feriado"),
(2025,10,13,"Jornadas FIEE","Feriado"),
(2025,10,14,"Jornadas FIEE","Feriado"),
(2025,11,1,"Integración Politécnica","Feriado"),
(2025,11,2,"Integración Politécnica","Feriado"),
(2025,11,3,"Integración Politécnica","Feriado"),
(2025,11,4,"Integración Politécnica","Feriado"),
(2025,11,5,"Fiestas de Quito","Feriado")


SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NULL;
SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NOT NULL;

SELECT image_path FROM ticket WHERE id_ticket = "00SvvP7kanzeayoWKdkNu";

SELECT * FROM sesiones WHERE Asunto = "Reserva" AND Hora_inicial = "09:00" AND Year=2026 AND Month=1 AND Date=13;

SELECT * FROM sesiones WHERE (laboratorio = 'sensores' OR laboratorio = 'instru') AND Year = 2026 AND Month = 8 AND Date BETWEEN 28 AND 31
EXCEPT SELECT * FROM sesiones WHERE LOWER(Asunto) LIKE '%Reserva%';

SELECT * FROM sesiones WHERE LOWER(Asunto) LIKE '%Reserva%'

INSERT INTO `devicelist` (`Id`, `codigo`, `Tipo`, `Marca`, `Modelo`, `Especificaciones`, `Cantidad`) VALUES 
(1, 'osciloscopio_1', 'Osciloscopio ', 'Tektronix', 'TDS1012', 'Osciloscopio 2 canales ', 1),
(2, 'osciloscopio_2', 'Osciloscopio ', 'Tektronix', 'TDS1012', 'Osciloscopio 2 canales ', 1),
(3, 'osciloscopio_3', 'Osciloscopio ', 'Tektronix', 'TDS2022C', 'Osciloscopio 2 canales ', 1),
(4, 'osciloscopio_4', 'Osciloscopio ', 'Tektronix', 'TDS2022C', 'Osciloscopio 2 canales ', 1),
(5, 'osciloscopio_5', 'Osciloscopio ', 'Tektronix', 'TDS2022C', 'Osciloscopio 2 canales ', 1),
(6, 'siglent_1', 'Osciloscopio 4 Canales', 'Siglent', 'SDS804X HD 70 MHz', 'Osciloscopio 4 canales ', 1),
(7, 'siglent_2', 'Osciloscopio 4 Canales', 'Siglent', 'SDS804X HD 70 MHz', 'Osciloscopio 4 canales ', 1),
(8, 'siglent_3', 'Osciloscopio 4 Canales', 'Siglent', 'SDS804X HD 70 MHz', 'Osciloscopio 4 canales ', 1),
(9, 'gen_sig_1', 'Generador de Funciones Siglent', 'Siglent', 'SAG1021I', 'Generador de funciones para el osciloscopio Siglent', 1),
(10, 'gen_sig_2', 'Generador de Funciones Siglent', 'Siglent', 'SAG1021I', 'Generador de funciones para el osciloscopio Siglent', 1),
(11, 'gen_sig_3', 'Generador de Funciones Siglent', 'Siglent', 'SAG1021I', 'Generador de funciones para el osciloscopio Siglent', 1),
(12, 'generador_1', 'Generador de funciones', 'GW INSTEK', 'AFG-2225', 'Generador de funciones .', 1),
(13, 'generador_3', 'Generador de funciones', 'BK PRECISION', '3011B', 'Generador de funciones .', 1),
(14, 'generador_2', 'Generador de funciones', 'BK PRECISION', '3011B', 'Generador de funciones .', 1),
(15, 'fuente_laboratorio_9', 'Fuente de voltaje  2 Canales', 'GW INSTEK', 'GPD-3303S', 'Fuente de 2 canales para laboratorio', 1),
(16, 'fuente_laboratorio_8', 'Fuente de voltaje  2 Canales', 'GW INSTEK', 'GPD-3303S', 'Fuente de 2 canales para laboratorio', 1),
(17, 'fuente_laboratorio_1', 'Fuente de voltaje  2 Canales', 'GW INSTEK', 'GPS-3303', 'Fuente de 2 canales para laboratorio', 1),
(18, 'fuente_laboratorio_5', 'Fuente de voltaje  2 Canales', 'BK PRECISION', '1760A', 'Fuente de 2 canales para laboratorio', 1),
(19, 'fuente_laboratorio_2', 'Fuente de voltaje  2 Canales', 'BK PRECISION', '1672', 'Fuente de 2 canales para laboratorio', 1),
(20, 'fuente_laboratorio_4', 'Fuente de voltaje  2 Canales', 'PROTEK', 'DF1731SB3A', 'Fuente de 2 canales para laboratorio', 1),
(21, 'fuente_laboratorio_3', 'Fuente de voltaje  2 Canales', 'PROTEK', 'DF1731SB3A', 'Fuente de 2 canales para laboratorio', 1),
(22, 'fuente_laboratorio_7', 'Fuente de voltaje  2 Canales', 'BK PRECISION', '1672', 'Fuente de 2 canales para laboratorio', 1),
(23, 'mydaq_1', 'Tarjeta de adquisición ', 'National Instrument', 'myDAQ', 'myDAQ', 1),
(24, 'mydaq_2', 'Tarjeta de adquisicion ', 'National Instrument', 'myDAQ', 'myDAQ', 1),
(25, 'mydaq_3', 'Tarjeta de adquisicion ', 'National Instrument', 'myDAQ', 'myDAQ', 1),
(26, 'mydaq_4', 'Tarjeta de adquisicion ', 'National Instrument', 'myDAQ', 'myDAQ', 1),
(27, '6008-1', 'Tarjeta de adquisicion ', 'National Instrument', 'USB 6008', 'USB 6008', 1),
(28, '6008-2', 'Tarjeta de adquisición ', 'National Instrument', 'USB 6008', 'USB 6008', 1),
(29, '6008-3', 'Tarjeta de adquisición ', 'National Instrument', ' USB 6009', ' USB 6009', 1),
(30, '6008-4', 'Tarjeta de adquisición ', 'National Instrument', 'USB 6008/ USB 6009', 'USB 6008/ USB 6009', 1),
(31, 'epc_3', 'PLANTA EPC', 'National Instrument', 'EPC', 'Planta de entrenamiento EPC', 1),
(32, 'epc_2', 'PLANTA EPC', 'National Instrument', 'EPC', 'Planta de entrenamiento EPC', 1),
(33, 'epc_1', 'PLANTA EPC', 'National Instrument', 'EPC', 'Planta de entrenamiento EPC', 1),
(34, 'sensor_presion_1', 'Sensor  de presión ', 'Omega', 'Omega', 'Sensor de presión ', 1),
(35, 'multimetro_1', 'Multímetros', 'FLUKE', '87', 'Multímetro Fluke 85', 1),
(36, 'multimetro_5', 'Multímetros', 'FLUKE', '87', 'Multímetro Fluke 85', 1),
(37, 'multimetro_2', 'Multímetros', 'FLUKE', '87V', 'Multímetro Fluke 85', 1),
(38, 'multimetro_3', 'Multímetros', 'FLUKE', '87V', 'Multímetro Fluke 85', 1),
(39, 'multimetro_4', 'Multímetros', 'FLUKE', '87V', 'Multímetro Fluke 85', 1),
(40, 'fluke_17b_2', 'Multímetros', 'FLUKE', '17B+', 'Multímetro Fluke 17B+', 1),
(41, 'fluke_17b_1', 'Multímetros', 'FLUKE', '17B+', 'Multímetro Fluke 17B+', 1),
(42, 'fluke_17b_3', 'Multímetros', 'FLUKE ', '17B+', 'Multímetro Fluke 17B+', 1),
(43, 'plancha_1', 'Planchas de calentamiento', 'OVAN', 'MNH400 E
10000-01040', 'Plancha de Calentamiento', 1),
(44, 'plancha_2', 'Planchas de calentamiento', 'OVAN', 'MNH400 E
10000-01040', 'Plancha de Calentamiento', 1),
(45, 'plancha_3', 'Planchas de calentamiento', 'OVAN', 'MNH400 E
10000-01040', 'Plancha de Calentamiento', 1),
(46, 'compresor_1', 'Compresor', 'Campbell', 'Hausfeld', 'Compresor', 1),
(47, 'compresor_2', 'Compresor', 'Campbell', 'Hausfeld', 'Compresor', 1),
(48, 'dosificador', 'Modulo dosificador', 'Módulo', 'Dosificador', 'Modulo dosificador', 1),
(49, 'tk4l_2', 'Controlador de temperatura', 'AUTONICS', 'TK4L-B4CC', 'Controlador temperatura con 2 salidas', 1),
(50, 'tk4l_1', 'Controlador de temperatura', 'AUTONICS', 'TK4L-B4CC', 'Controlador temperatura con 2 salidas', 1),
(51, 'tk4l_3', 'Controlador de temperatura', 'AUTONICS', 'TK4L-B4CN', 'Controlador temperatura con 1 salida', 1),
(52, 'Auma', 'Actuador Auma', 'AUMA', 'D-79379', 'Actuador Auma', 1),
(53, 'balanza_1', 'BALANZA DIGITAL', 'RADWAG', 'WLC 10/A2', 'Balanza digital ', 1),
(54, 'balanza_2', 'BALANZA DIGITAL', 'CAMRY', 'EK3352', 'Balanza digital ', 1),
(55, 'Hart_1', 'Modem Hart', 'VIATOR A PEPPERL+FUCHS', 'HM-PF-USB-010031', 'Modem Hart', 1),
(56, 'v1', 'Variador de frecuencia', 'INVERTEK DRIVES', 'Optidrive E3 ODE-3-120043-1F12', 'Variador de Frecuencia', 1),
(57, 'v2', 'Variador de frecuencia', 'INVERTEK DRIVES', 'Optidrive E3 ODE-3-120043-1F12', 'Variador de Frecuencia', 1),
(58, 'v3', 'Variador de frecuencia', 'SIEMENS', 'G110', 'Variador de Frecuencia', 1),
(59, 'v4', 'Variador de frecuencia', 'SIEMENS', 'G110', 'Variador de Frecuencia', 1),
(60, 'v5', 'Variador de frecuencia', 'SIEMENS', 'Micromaster 440', 'Variador de Frecuencia', 1),
(61, 'v6', 'Variador de frecuencia', 'WEQ', 'WEQ', 'Variador de Frecuencia', 1),
(62, 'm1', 'Motor trifásico', 'SIEMENS', 'SIEMENS', 'Motor trifásico', 1),
(63, 'm2', 'Motor trifásico', 'WEQ', 'WEQ', 'Motor trifásico', 1),
(64, 'm3', 'Motor trifásico', 'WESTERN ELECTRIC', 'WESTERN ELECTRIC', 'Motor trifásico', 1),
(65, 'm4', 'Motor trifásico', 'INNOMOTICS', 'INNOMOTICS', 'Motor trifásico', 1),
(66, 'm5', 'Motor trifásico', 'INNOMOTICS', 'INNOMOTICS', 'Motor trifásico', 1),
(67, 'plc_1', 'PLC SIEMENS', 'SIEMENS', 'S7-1200
6ES7 215-1AG40-0XB0', 'PLC SIEMENS', 1),
(68, 'tt_1', 'Transmisor de temperatura', 'WIKA', 'T32.15.000-Z-5-GKT-ZZZ-Z', 'Transmisor de temperatura', 1),
(69, 'tt_2', 'Transmisor de temperatura', 'WIKA', 'T32.15.000-Z-5-GKT-ZZZ-Z', 'Transmisor de temperatura', 1),
(70, 'pt_1', 'Transmisor de presión', 'IFM', 'PT2415', 'Transmisor de presión', 1),
(71, 'pt_2', 'Transmisor de presión', 'IFM', 'PT2415', 'Transmisor de presión', 1),
(72, 'pt_3', 'Transmisor de presión', 'IFM', 'PT2415', 'Transmisor de presión', 1),
(73, 'capacitivo-1', 'Sensor capacitivo', 'IFM', 'K15303', 'Sensor capacitivo', 1),
(74, 'capacitivo-2', 'Sensor capacitivo', 'IFM', 'K15304', 'Sensor capacitivo', 1),
(75, 'omega_nivel-1', 'Transmisor de nivel ultrasónico ', 'Omega', 'Omega', 'Transmisor de nivel ultrasónico ', 1),
(76, 'motor_nema_1', 'Motores a pasos Nema 23', 'Nema', 'NEMA 23 23HS30-2804S', 'Motores a pasos Nema 23', 1),
(77, 'motor_nema_2', 'Motores a pasos Nema 23', 'Nema', 'NEMA 23 23HS30-2804S', 'Motores a pasos Nema 23', 1),
(78, 'motor_nema_3', 'Motores a pasos Nema 23', 'Nema', 'NEMA 23 23HS30-2804S', 'Motores a pasos Nema 23', 1),
(79, 'driver_nema_1', 'Driver motor a pasos', 'Microstep Driver', 'DM542', 'Driver motor a pasos', 1),
(80, 'driver_nema_2', 'Driver motor a pasos', 'Microstep Driver', 'DM542', 'Driver motor a pasos', 1),
(81, 'driver_nema_3', 'Driver motor a pasos', 'Microstep Driver', 'DM542', 'Driver motor a pasos', 1),
(82, 'fuente_did_1', 'Fuente de voltaje didactica', 'Lab Instru', 'FV', 'Fuente de voltaje didactica', 1),
(83, 'fuente_did_2', 'Fuente de voltaje didactica', 'Lab Instru', 'FV', 'Fuente de voltaje didactica', 1),
(84, 'fuente_did_3', 'Fuente de voltaje didactica', 'Lab Instru', 'FV', 'Fuente de voltaje didactica', 1),
(85, 'fuente_did_4', 'Fuente de voltaje didactica', 'Lab Instru', 'FV', 'Fuente de voltaje didactica', 1),
(86, 'fuente_did_5', 'Fuente de voltaje didactica', 'Lab Instru', 'FV', 'Fuente de voltaje didactica', 1),
(87, 'fuente_did_6', 'Fuente de voltaje didactica', 'Lab Instru', 'FV', 'Fuente de voltaje didactica', 1),
(88, 'rel_1', 'Modulos de reles aislados 5V', 'Lab Instru', 'MR', 'Modulos de reles aislados 5V', 1),
(89, 'rel_2', 'Modulos de reles aislados 5V', 'Lab Instru', 'MR', 'Modulos de reles aislados 5V', 1),
(90, 'rel_3', 'Modulos de reles aislados 5V', 'Lab Instru', 'MR', 'Modulos de reles aislados 5V', 1),
(91, 'rel_4', 'Modulos de reles aislados 5V', 'Lab Instru', 'MR', 'Modulos de reles aislados 5V', 1),
(92, 'mod_temp_1', 'Modulos de calentamiento/Enfriamiento', 'Lab Instru', 'MCI', 'Modulos de calentamiento/Enfriamiento', 1),
(93, 'mod_temp_2', 'Modulos de calentamiento/Enfriamiento', 'Lab Instru', 'MCI', 'Modulos de calentamiento/Enfriamiento', 1),
(94, 'mod_temp_3', 'Modulos de calentamiento/Enfriamiento', 'Lab Instru', 'MCI', 'Modulos de calentamiento/Enfriamiento', 1),
(95, 'kit_sensores_1', 'Módulo Sensores Presencia', 'Lab Instru', 'MS', 'Módulo Sensores Presencia', 1),
(96, 'kit_sensores_2', 'Módulo Sensores Presencia', 'Lab Instru', 'MS', 'Módulo Sensores Presencia', 1),
(97, 'kit_sensores_3', 'Módulo Sensores Presencia', 'Lab Instru', 'MS', 'Módulo Sensores Presencia', 1),
(98, 'umn_1', 'Unidad de Mantenimiento Neumático ', 'AFC', 'AFC2000', 'Unidad de Mantenimiento Neumático ', 1),
(99, 'umn_2', 'Unidad de Mantenimiento Neumático ', 'AFC', 'AFC2000', 'Unidad de Mantenimiento Neumático ', 1),
(100, 'umn_3', 'Unidad de Mantenimiento Neumático ', 'AFC', 'AFC2000', 'Unidad de Mantenimiento Neumático ', 1),
(101, 'fuente_regulable_1', 'Fuente de voltaje variable', 'UM', ' UM-715', 'Fuente de voltaje variable', 1),
(102, 'fuente_regulable_2', 'Fuente de voltaje variable', 'UM', ' UM-715', 'Fuente de voltaje variable', 1),
(103, 'fuente_regulable_3', 'Fuente de voltaje variable', 'UM', ' UM-715', 'Fuente de voltaje variable', 1),
(104, 'pc_1', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(105, 'pc_2', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(106, 'pc_3', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(107, 'pc_4', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(108, 'pc_5', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(109, 'pc_6', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(110, 'pc_7', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(111, 'pc_8', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(112, 'pc_9', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(113, 'pc_10', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(114, 'pc_11', 'Computador de escritorio', 'HP', 'PRODESK', 'Computador de escritorio', 1),
(115, 'modulo_caudal_1 ', 'Módulo de Bomba Monofásica ', 'Pedrollo', 'CPM620', 'Modulo de bomba para caudal', 1),
(116, 'modulo_caudal_2', 'Módulo de Bomba Monofásica ', 'Pedrollo', 'CPM621', 'Modulo de bomba para caudal', 1),
(117, 'modulo_bombas_1', 'Módulo de Caudal Serie /Paralelo ', 'Pedrollo', 'CPM622', 'Modulo de 2 bombas en serie y paralelo', 1),
(118, 'termometro_fluke', 'Termometro Infrarrojo', 'FLUKE', '62 MAX', 'Termometro Infrarrojo', 1),
(119, 'celda_carga_1', 'Celda de carga', 'Omega', 'OM', 'Celda de carga', 1),
(120, 'celda_carga_2', 'Celda de carga', 'Omega', 'OM', 'Celda de carga', 1),
(121, 'sensor_nivel_1', 'Sensor de nivel tipo electromecánico', 'EMA', 'LC0102', 'Sensor de nivel tipo electromecánico', 1);

UPDATE sesiones SET `Mesas` = 'Mesa4,Mesa5,Mesa6' WHERE laboratorio = 'instru'

SELECT * FROM sesiones WHERE `Equipos_usados` not LIKE 'Ninguno'