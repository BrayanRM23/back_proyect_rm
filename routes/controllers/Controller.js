const fs = require('fs/promises');
const path = require('path');
const User = require('../models/user'); 
const Admin = require('../models/Admin');
const UserInfo = require('../models/UserInfo');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado: npm install bcrypt
 

const compareLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos solo por el username
        const user = await User.findOne({ username });

        if (!user) {
            // Si el usuario no existe
            return res.json({ resultado: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la almacenada (después de encriptarla)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.json({ resultado: "Credenciales inválidas" });
        }

        // Si el usuario es válido y la contraseña coincide
        return res.json({ resultado: "user" });

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


const crearImagen = async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const { prompt } = req.body;
    const url = "https://stablediffusionapi.com/api/v3/dreambooth";
    const apiKey = "73bYaWf4IR0GXJUhOVt5p4iPqq2pMsYJDQQ2ErjNlpDD9iZv9lB4iLsiXj9A";

    const bodyData = {
        key: apiKey,
        prompt: prompt,
        model_id: "midjourney",
        negative_prompt: "low quality",
        width: "512",
        height: "512",
        safety_checker: false,
        seed: null,
        samples: 1,
        base64: false,
        webhook: null,
        track_id: null
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });
    
        console.log("Status de la respuesta:", response.status); // Verifica el código de estado
        const data = await response.json();
        console.log("Datos de respuesta completa:", data); // Imprime la respuesta completa
    
        const imageUrl = data.output ? data.output[0] : null;
    
        if (imageUrl) {
            return res.status(200).json({ imageUrl });
        } else {
            return res.status(500).json({ error: "No se encontró una URL de imagen en la respuesta." });
        }
    } catch (error) {
        console.error("Error al generar la imagen:", error);
        return res.status(500).json({ error: "Error al generar la imagen." });
    }
};







const updatepassword = async (req, res) => {
    const { username, password, update } = req.body;

    try {
        // Buscar al usuario en MongoDB
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`Usuario '${username}' no encontrado.`);
            return res.status(404).json({ resultado: "Usuario no encontrado" });
        }

        // Verificar la contraseña actual
        if (user.password !== password) {
            console.log(`Contraseña incorrecta para el usuario '${username}'.`);
            return res.status(400).json({ resultado: "Credenciales inválidas" });
        }

        // Actualizar la contraseña
        user.password = update;
        await user.save();

        console.log(`Contraseña del usuario '${username}' actualizada correctamente.`);
        return res.json({ resultado: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.log("Error al actualizar la contraseña:", error.message);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};



const crearuser = async (req, res) => {
    const { username, password, birthdate, cedula, email, cellphone, city } = req.body;

    try {
        // Verificar si el username o la cédula ya existen
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.json({ resultado: "El usuario ya existe" });
        }

        const cedulaExists = await UserInfo.findOne({ cedula });
        if (cedulaExists) {
            return res.json({ resultado: "La cédula ya está registrada" });
        }

        // Encriptar la contraseña antes de guardarla
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Primera parte: Crear y guardar UserInfo
        const newUserInfo = new UserInfo({
            birthdate,
            cedula,
            email,
            cellphone,
            city
        });

        const savedUserInfo = await newUserInfo.save(); // Guardar UserInfo primero
        console.log("UserInfo guardado con ID:", savedUserInfo._id);

        // Segunda parte: Crear el documento User y asignar la referencia a UserInfo
        const newUser = new User({
            username,
            password: hashedPassword,  // Guardar la contraseña encriptada
            info: savedUserInfo._id     // Asignar la referencia a UserInfo
        });

        await newUser.save(); // Guardar User en la base de datos
        console.log("Usuario guardado con ID:", newUser._id);

        return res.json({ resultado: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error creando usuario:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


const crearadmin = async (req, res) => {
    const { nombre, contrasena } = req.body;

    try {
        // Verificar si ya existe un administrador con ese nombre
        let adminExistente = await Admin.findOne({ nombre });
        if (adminExistente) {
            return res.status(400).json({ resultado: "Este nombre de administrador ya está en uso" });
        }

        // Hashear la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Crear el nuevo administrador
        const nuevoAdmin = new Admin({
            nombre,
            contrasena: hashedPassword,
        });

        await nuevoAdmin.save();

        return res.json({ resultado: "Administrador registrado correctamente" });
    } catch (error) {
        console.error("Error registrando administrador:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};

const compareadmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el administrador en la base de datos solo por el nombre de usuario
        const admin = await Admin.findOne({ nombre: username });

        if (!admin) {
            // Si el administrador no existe
            return res.json({ resultado: "Administrador no encontrado" });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isPasswordCorrect = await bcrypt.compare(password, admin.contrasena);
        
        if (!isPasswordCorrect) {
            return res.json({ resultado: "Credenciales inválidas" });
        }

        // Si el administrador es válido y la contraseña coincide
        return res.json({ resultado: "user" });

    } catch (error) {
        console.error("Error en el login del administrador:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};





module.exports = {
    
    compareadmin,
    crearImagen,
    crearadmin,
    compareLogin,
    updatepassword,
    crearuser
    
}