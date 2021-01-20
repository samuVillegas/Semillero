const express = require('express');
const morgan = require('morgan');
const app = express();
const routes = require('./routes/routes');
require('dotenv').config();

app.use(morgan('dev'));

//middlewares
app.use(express.json());

//Routes
app.use('/api',routes);


//Variables de entorno
app.set('port',process.env.PORT || 5000); // Si existe PORT sino 5000 Asignar variable

app.listen(app.get('port'),() =>{
    console.log(`Aplicacion corriendo en el puerto ${app.get('port')}`);
});