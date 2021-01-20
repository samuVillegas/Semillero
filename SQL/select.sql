SELECT * FROM tipo_marca

SELECT * FROM tipo_linea

SELECT * FROM modelo

SELECT * FROM vehiculo

SELECT * FROM vehiculo ORDER BY modelo

/*
    Se debe generar una consulta que contenga DESC_MARCA,
    DESC_LINEA y cantidad, para saber cuántas líneas repetidas
    por marca están almacenadas. (Crear un servicio en Express
    que devuelva dicha información).
*/


SELECT tp_li.desc_linea AS DESC_LINEA, tp_ma.desc_marca AS DESC_MARCA ,COUNT(*) AS Cantidad FROM tipo_linea AS tp_li
        JOIN tipo_marca AS tp_ma ON tp_li.id_marca = tp_ma.id_marca
        GROUP BY tp_li.id_marca

/*
    Crear una consulta única que tenga las siguientes columnas:
    NRO_PLACA, MODELO, DESC_LINEA, DESC_MARCA; traer
    todos los registros que coincidan en todas las tablas. (Crear un servicio en Express).
*/

SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca FROM vehiculo As ve 
            JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca



/*
    Crear una consulta única que tenga las siguientes columnas:
    NRO_PLACA, MODELO, DESC_LINEA, DESC_MARCA; traer
    todos los registros que coincidan en todas las tablas y que se
    encuentren en estado S. (Crear un servicio en Express).
*/
SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca FROM vehiculo As ve 
            JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca
            WHERE tp_li.activo = 'S' AND tp_ma.activo = 'S'


/*
    Se debe realizar una consulta que permita sumar todos los
    modelos. (Crear un servicio en Express). Se tomó los modelos de los vehiculos.
*/

SELECT SUM(modelo) AS SUMA FROM vehiculo

/*
    Se debe realizar una consulta que permita promediar todos los
    modelos. (Crear un servicio en Express).
*/

SELECT AVG(modelo) AS PROMEDIO FROM vehiculo

/*
    Se debe realizar una única consulta que permita saber cuántos
    registros están activos e inactivos de la tabla TIPO_LINEA.
    (Crear un servicio en Express).
*/

SELECT activo AS Estado ,COUNT(*) AS Cantidad FROM tipo_linea GROUP BY activo

/*
    Cree una consulta que una las tablas VEHICULOS, TIPO_LINEA
    y TIPO_MARCA mediante INNER JOIN y LEFT JOIN, en esta
    consulta se deben proyectar los campos NRO_PLACA,
    MODELO, DESC_LINEA y DESC_MARCA. (Crear dos servicios
    en Express).
*/


SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca FROM vehiculo As ve 
            JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca

SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca 
            FROM vehiculo AS ve 
            LEFT JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            LEFT JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca


/*

    Se debe implementar una única consulta y un servicio en Express
    (un servicio en Express por cada tabla) que permita conocer
    todos los campos de la tabla VEHICULOS, TIPO_LINEA,
    TIPO_MARCA con las siguientes características:
    No puede traer registros que tengan campos nulos
    El campo modelo debe salir de la siguiente manera
    #ModeloVehiculo: Modelo Las fechas deben salir con formato
    dd/mm/yyyy hh:mi:ss
    Los campos S y N debe salir con el texto ACTIVO o INACTIVO

*/

/*Obtener vehiculos*/
SELECT ve.nro_placa,ve.id_linea,ve.modelo AS '#ModeloVehiculo',
            DATE_FORMAT(ve.fecha_ven_seguro, "%d-%m-%Y") AS fecha_ven_seguro,
             DATE_FORMAT(ve.fecha_ven_tecnomecanica, "%d-%m-%Y") AS 
             fecha_ven_tecnomecanica, DATE_FORMAT(ve.fecha_ven_contratodo, 
             "%d-%m-%Y") AS fecha_ven_contratodo FROM vehiculo AS ve WHERE 
            ve.fecha_ven_seguro IS NOT NULL AND ve.fecha_ven_tecnomecanica IS NOT 
            NULL AND ve.fecha_ven_contratodo IS NOT NULL


/*Obtener tipo_marca*/
SELECT ti.id_marca,ti.desc_marca,IF(ti.activo='S','ACTIVO','INACTIVO')AS activo FROM tipo_marca as ti WHERE ti.desc_marca IS NOT NULL

/*Obtener tipo_linea*/
SELECT ti.id_linea,ti.id_marca,ti.desc_linea,IF(ti.activo='S','ACTIVO','INACTIVO')AS activo FROM tipo_linea as ti WHERE ti.desc_linea IS NOT NULL