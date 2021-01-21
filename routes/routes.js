const { Router } = require('express');
const { cnn_mysql } = require('./../config/conexion.js')
const router = Router();
const path = require('path');
const tipo_linea_arr = require(path.join(__dirname, '../Registros/tipo_linea'))
const tipo_marca_arr = require(path.join(__dirname, '../Registros/tipo_marca'))
const vehiculos_arr = require(path.join(__dirname, '../Registros/vehiculos'))
const modelos_arr = require(path.join(__dirname, '../Registros/modelos'))

// Servicios para insertar registros 

/*
    En la tabla TIPO_MARCA deberá insertar 5 registros (Crear un
    servicio en Express que permita insertar cada registro).
*/
router.get('/tipo_marca', async (req, res) => {
    try {
        for (let i = 0; i < tipo_marca_arr.length; i++) {
            await cnn_mysql.promise().execute(`INSERT INTO tipo_marca VALUES(id_marca,?,?)`, Object.values(tipo_marca_arr[i]));
        }
        res.status(200).json({ message: "Registros creados" });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Registro no creado",
            error: e.errno
        });
    }
});

/*
    En la tabla TIPO_LINEA deberá insertar 20 registros,
    la línea es única, pero puede repetir marca 
    (Crear un servicio en Express que permita insertar cada registro).
*/
router.get('/tipo_linea', async (req, res) => {
    try {
        for (let i = 0; i < tipo_linea_arr.length; i++) {
            await cnn_mysql.promise().execute(`INSERT INTO tipo_linea VALUES(id_linea,?,?,?)`, Object.values(tipo_linea_arr[i]));
        }
        res.status(200).json({ message: "Registros creados" });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Registro no creado",
            error: e.errno
        });
    }
});


/*
    En la tabla VEHICULOS deberá insertar 30 registros (Crear un
    servicio en Express que permita insertar cada registro).

*/
router.get('/vehiculo', async (req, res) => {
    try {
        for (let i = 0; i < vehiculos_arr.length; i++) {
            await cnn_mysql.promise().execute(`INSERT INTO vehiculo VALUES(?,?,?,?,?,?)`, Object.values(vehiculos_arr[i]));
        }
        res.status(200).json({ message: "Registros creados" });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Registro no creado",
            error: e.errno
        });
    }
});

/*
    Se agregan los modelos a la tabla modelos.
*/

router.get('/modelo', async (req, res) => {
    try {
        for (let i = 0; i < modelos_arr.length; i++) {
            await cnn_mysql.promise().execute(`INSERT INTO modelo VALUES(?)`, Object.values(modelos_arr[i]));
        }
        res.status(200).json({ message: "Registros creados" });
    } catch (e) {
        res.status(500).json({
            message: "Registro no creado",
            error: e.errno
        });
    }
});

/*
    Se debe generar 3 querys que comprueben que las cantidades
    solicitadas en las 3 tablas sean las correctas (Crear un 
    servicio en Express por cada tabla, que entregue la cantidad 
    de registros por tabla e indique si cumple con la cantidad de
    registros solicitado).

*/

router.get('/comprobar_tipo_marca', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT * FROM tipo_marca`);
        if (rows[0].length == 5) res.json({
            message: "Comprobación realizada",
            success: true, cantRows: rows[0].length
        });
        else res.json({
            message: "Comprobación realizada",
            success: false, cantRows: rows[0].length
        });
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});

router.get('/comprobar_tipo_linea', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT * FROM tipo_linea`);
        if (rows[0].length == 20) res.json({
            message: "Comprobación realizada",
            success: true, cantRows: rows[0].length
        });
        else res.json({
            message: "Comprobación realizada",
            success: false, cantRows: rows[0].length
        });
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});

router.get('/comprobar_vehiculo', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT * FROM vehiculo`);
        if (rows[0].length == 30) res.json({
            message: "Comprobación realizada",
            success: true, cantRows: rows[0].length
        });
        else res.json({
            message: "Comprobación realizada",
            success: false, cantRows: rows[0].length
        });
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});



/*
    Se debe generar una consulta que indique cual es el modelo
    máximo almacenado y el mínimo. (Crear un servicio en
    Express que devuelva dicha información).
*/

router.get('/modelo_min_max', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT * FROM vehiculo ORDER BY modelo`);
        res.json({
            min: rows[0][0].modelo,
            max: rows[0][rows[0].length - 1].modelo
        });

    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});

/*
    Se debe generar una consulta que contenga DESC_MARCA,
    DESC_LINEA y cantidad, para saber cuántas líneas repetidas
    por marca están almacenadas. (Crear un servicio en Express
    que devuelva dicha información).
*/

router.get('/lineas_marca', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT tp_li.desc_linea AS DESC_LINEA, tp_ma.desc_marca AS DESC_MARCA ,COUNT(*) AS Cantidad FROM tipo_linea AS tp_li
        JOIN tipo_marca AS tp_ma ON tp_li.id_marca = tp_ma.id_marca
        GROUP BY tp_li.id_marca`);
        res.send(rows[0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});

/*
    Crear una consulta de vehículos que me permita consultar
    todos los vehículos por un rango de fechas sobre el campo
    FECHA_VEN_SEGURO. (Crear un servicio en Express que
    devuelva dicha información y reciba el rango de fecha por
    query o params).
*/

router.get('/vehiculos_rango/:lim_inf/:lim_sup', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT * FROM vehiculo WHERE 
            fecha_ven_seguro BETWEEN '${req.params.lim_inf}' 
            AND '${req.params.lim_sup}'`);

        if (rows[0].length != 0) res.send(rows[0]);
        else res.json({ message: "Registros no encontrados en el rango solicitado" });

    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});

/*
    Crear una consulta de vehículos que me permita consultar
    todos los vehículos por un rango de modelos por el campo
    modelo. (Crear un servicio en Express que devuelva dicha
    información).
*/

router.get('/vehiculos_rango_modelo/:lim_inf/:lim_sup', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT * FROM vehiculo WHERE modelo BETWEEN '${req.params.lim_inf}' AND '${req.params.lim_sup}'`);
        if (rows[0].length != 0) res.send(rows[0]);
        else res.json({ message: "Registros no encontrados en el rango solicitado" });
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobación",
            error: e.errno
        });
    }
});

/*
    Crear un UPDATE que permita modificar el estado de alguno
    de los registros.
*/

router.patch('/update_tipo_marca/:id', async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0) {
            const id = req.params.id
            console.log(id)
            let SQL = 'UPDATE tipo_marca SET '
            const params = []

            for (const elment in req.body) {
                SQL += `${elment} = ?, `
                params.push(req.body[elment])
            }
            SQL = SQL.slice(0, -2)
            SQL += ` WHERE id_marca = ?`
            params.push(id)
            // console.log(SQL, params)
            let rows = await cnn_mysql.promise().execute(SQL, params)
            if (rows[0].affectedRows > 0) res.send({ message: "Registro actualizado" })
            else res.json({ message: "Registros no encontrados con el id enviado" });

        } else {
            res.status(401).json({ message: 'No existe campos a modificar' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Registro no actualizado",
            error: e.errno
        });
    }
});

router.patch('/update_tipo_linea/:id', async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0) {
            const id = req.params.id
            console.log(id)
            let SQL = 'UPDATE tipo_linea SET '
            const params = []

            for (const elment in req.body) {
                SQL += `${elment} = ?, `
                params.push(req.body[elment])
            }
            SQL = SQL.slice(0, -2)
            SQL += ` WHERE id_linea = ?`
            params.push(id)
            // console.log(SQL, params)
            let rows = await cnn_mysql.promise().execute(SQL, params)
            if (rows[0].affectedRows > 0) res.send({ message: "Registro actualizado" })
            else res.json({ message: "Registros no encontrados con el id enviado" });

        } else {
            res.status(401).json({ message: 'No existe campos a modificar' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Registro no actualizado",
            error: e.errno
        });
    }
});

router.patch('/update_vehiculos/:nro_placa', async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0) {
            const id = req.params.nro_placa
            let SQL = 'UPDATE vehiculo SET '
            const params = []

            for (const elment in req.body) {
                SQL += `${elment} = ?, `
                params.push(req.body[elment])
            }
            SQL = SQL.slice(0, -2)
            SQL += ` WHERE nro_placa = ?`
            params.push(id)
            console.log(SQL, params)
            let rows = await cnn_mysql.promise().execute(SQL, params)
            if (rows[0].affectedRows > 0) res.send({ message: "Registro actualizado" })
            else res.json({ message: "Registros no encontrados con el id enviado" });

        } else {
            res.status(401).json({ message: 'No existe campos a modificar' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Registro no actualizado",
            error: e.errno
        });
    }
});


/*
    Crear un SQL para insertar un registro adicional en
    TIPO_MARCA. (Crear un servicio en Express).
*/

router.post('/add_tipo_marca', async (req, res) => {

    try {
        let consPart1 = `INSERT INTO tipo_marca(`;
        let consPart2 = `VALUES(`;
        let consPart3 = [];
        for (const property in req.body) {
            consPart1 += `${property},`;
            consPart2 += `?,`;
            consPart3.push(req.body[property]);
        }
        consPart1 = `${consPart1.slice(0, -1)})`;
        consPart2 = `${consPart2.slice(0, -1)})`;
        consPart1 = `${consPart1} ${consPart2}`;
        console.log(consPart1);
        await cnn_mysql.promise().execute(consPart1, consPart3);
        res.status(200).json({ message: "Registro creado" });
    } catch (e) {
        res.status(500).json({
            message: "Registro no creado",
            error: e.errno
        });
    }
});

/*
    Crear un SQL para eliminar un registro en TIPO_MARCA. (Crear
    un servicio en Express).

*/

router.delete('/delete_tipo_marca/:id_marca', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `DELETE FROM tipo_marca WHERE id_marca = ${req.params.id_marca}`);
        if (rows[0].affectedRows > 0) res.send({ message: "Registro eliminado" })
        else res.json({ message: "Registro no eliminado con el id enviado" });
    } catch (e) {
        res.status(500).json({
            message: "Registro no borrado",
            error: e.errno
        });
    }
});


/*
    Crear una consulta única que tenga las siguientes columnas:
    NRO_PLACA, MODELO, DESC_LINEA, DESC_MARCA; traer
    todos los registros que coincidan en todas las tablas. (Crear un servicio en Express).
*/

router.get('/descripcion1', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca FROM vehiculo As ve 
            JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca`);
        res.send(rows[0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

/*
    Crear una consulta única que tenga las siguientes columnas:
    NRO_PLACA, MODELO, DESC_LINEA, DESC_MARCA; traer
    todos los registros que coincidan en todas las tablas y que se
    encuentren en estado S. (Crear un servicio en Express).

*/

router.get('/descripcion2', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca FROM vehiculo As ve 
            JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca
            WHERE tp_li.activo = 'S' AND tp_ma.activo = 'S'`);
        res.send(rows[0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

/*
    Se debe realizar una consulta que permita sumar todos los
    modelos. (Crear un servicio en Express). Se tomó los modelos de los vehiculos.
*/

router.get('/suma_modelos', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT SUM(modelo) AS SUMA FROM vehiculo`);
        res.send(rows[0][0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

/*
    Se debe realizar una consulta que permita promediar todos los
    modelos. (Crear un servicio en Express).
*/

router.get('/promedio_modelos', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(`SELECT AVG(modelo) AS PROMEDIO FROM vehiculo`);
        res.send(rows[0][0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

/*
    Se debe realizar una única consulta que permita saber cuántos
    registros están activos e inactivos de la tabla TIPO_LINEA.
    (Crear un servicio en Express).
*/

router.get('/act_ina_tipo_linea', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT activo AS Estado ,COUNT(*) AS Cantidad FROM tipo_linea GROUP BY activo`);
        res.send(rows[0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

/*
    Cree una consulta que una las tablas VEHICULOS, TIPO_LINEA
    y TIPO_MARCA mediante INNER JOIN y LEFT JOIN, en esta
    consulta se deben proyectar los campos NRO_PLACA,
    MODELO, DESC_LINEA y DESC_MARCA. (Crear dos servicios
    en Express).
*/


router.get('/descripcion3', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca FROM vehiculo As ve 
            JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca`);
        res.send(rows[0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

router.get('/descripcion4', async (req, res) => {
    try {
        const rows = await cnn_mysql.promise().execute(
            `SELECT ve.nro_placa,ve.modelo,tp_li.desc_linea,tp_ma.desc_marca 
            FROM vehiculo AS ve 
            LEFT JOIN tipo_linea AS tp_li ON tp_li.id_linea = ve.id_linea
            LEFT JOIN tipo_marca AS tp_ma ON tp_ma.id_marca = tp_li.id_marca`);
        res.send(rows[0]);
    } catch (e) {
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});


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

router.get('/get_vehiculos', async(req,res)=>{
    try{
        const rows = await cnn_mysql.promise().execute(
            `SELECT ve.nro_placa,ve.id_linea,ve.modelo AS '#ModeloVehiculo',
            DATE_FORMAT(ve.fecha_ven_seguro, "%d-%m-%Y") AS fecha_ven_seguro,
             DATE_FORMAT(ve.fecha_ven_tecnomecanica, "%d-%m-%Y") AS 
             fecha_ven_tecnomecanica, DATE_FORMAT(ve.fecha_ven_contratodo, 
             "%d-%m-%Y") AS fecha_ven_contratodo FROM vehiculo AS ve WHERE 
            ve.fecha_ven_seguro IS NOT NULL AND ve.fecha_ven_tecnomecanica IS NOT 
            NULL AND ve.fecha_ven_contratodo IS NOT NULL`
        )
        res.send(rows[0]);
    }catch(e){
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

router.get('/get_tipo_marca', async(req,res)=>{
    try{
        const rows = await cnn_mysql.promise().execute(
            `SELECT ti.id_marca,ti.desc_marca,IF(ti.activo='S','ACTIVO','INACTIVO')AS activo FROM tipo_marca as ti WHERE ti.desc_marca IS NOT NULL`
        )
        res.send(rows[0]);
    }catch(e){
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});

router.get('/get_tipo_linea', async(req,res)=>{
    try{
        const rows = await cnn_mysql.promise().execute(
            `SELECT ti.id_linea,ti.id_marca,ti.desc_linea,IF(ti.activo='S','ACTIVO','INACTIVO')AS activo FROM tipo_linea as ti WHERE ti.desc_linea IS NOT NULL`
        )
        res.send(rows[0]);
    }catch(e){
        res.status(500).json({
            message: "Error en comprobacion",
            error: e.errno
        });
    }
});


module.exports = router;