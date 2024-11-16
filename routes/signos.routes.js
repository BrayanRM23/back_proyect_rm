const express = require('express');
const router = express.Router();
const Controller = require('./controllers/Controller.js');


router
    .post('/login', Controller.compareLogin)
    .post('/crearimagen', Controller.crearImagen)
    .post('/loginadmin', Controller.compareadmin)
    .post('/actualizar', Controller.updatepassword)
    .post('/registraradmin', Controller.crearadmin)
    .post('/crear', Controller.crearuser); // Nueva ruta para crear usuarios

module.exports = router;
