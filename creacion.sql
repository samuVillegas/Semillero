DROP DATABASE IF EXISTS semillero;

CREATE DATABASE semillero;

USE semillero;

DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS modelo;
DROP TABLE IF EXISTS tipo_linea;
DROP TABLE IF EXISTS tipo_marca;
 

CREATE TABLE tipo_marca(
    id_marca int(5) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    desc_marca TEXT COMMENT 'La descripción puede ser opcional dado que 
                                muchas veces la marca ya es conocida',
    activo ENUM('S','N') NOT NULL
)ENGINE=INNODB;


CREATE TABLE tipo_linea(
    id_linea int(5) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    desc_linea TEXT COMMENT 'Si se necesita poner se pone pero no es 
                            importante',
    id_marca int(5) UNSIGNED NOT NULL,
    activo ENUM('S','N') NOT NULL,
    FOREIGN KEY (id_marca) REFERENCES tipo_marca(id_marca)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
)ENGINE=INNODB;

CREATE TABLE modelo(
    nombre_modelo varchar(255) NOT NULL,
    fecha_modelo DATE NOT NULL,
    desc_modelo TEXT COMMENT 'La descripción puede ser opcional dado que 
                                con el nombre y la descripcion puede bastar',
    PRIMARY KEY (nombre_modelo,fecha_modelo)                
)ENGINE=INNODB;

CREATE TABLE vehiculos(
    nro_placa varchar(6) PRIMARY KEY,
    id_linea int(5) UNSIGNED NOT NULL,
    nombre_modelo varchar(255) NOT NULL,
    fecha_modelo DATE NOT NULL, 
    fecha_ven_seguro DATE COMMENT 'Puede pasar que no se tenga seguro
                                    y lo indicamos si el campo es null',
    fecha_ven_tecnomecanica DATE COMMENT 'Puede pasar que no se tenga tecnomecanica
                                    y lo indicamos si el campo es null',
    fecha_ven_contratodo DATE COMMENT 'Puede pasar que no se tenga contratodo
                                    y lo indicamos si el campo es null',
    FOREIGN KEY (id_linea) REFERENCES tipo_linea(id_linea),
    FOREIGN KEY (nombre_modelo,fecha_modelo) REFERENCES modelo(nombre_modelo,fecha_modelo)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
)ENGINE=INNODB;




