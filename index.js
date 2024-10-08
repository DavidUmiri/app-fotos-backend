// Importar dependencias
const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

// Inicializar la aplicacion Express
const app = express();

// Permitir solo solicitudes de localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Middleware para manejar JSON
app.use(express.json());

// Ruta de prueba para ver si el servidor esta corriendo
app.get("/", (req, res) => {
    res.send("Backend funcionando correctamente");
});

// Ruta para obtener una imagen de Unsplash segun parametros del usuario
app.get("/unsplash", async (req, res) => {
    try {
        // Obtener los parametros enviados por el usuario
        const { query, cantidad = 1, orientacion, color } = req.query;

        // Validamos que al menos se haya pasado una palabra clave
        if (!query) {
            return res.status(400).json({ mensaje: "Debe proporcionar una palabra clave" });
        }

        // Construir los parametros de la solicitud
        const params = {
            query,
            per_page: cantidad,
        };

        // Agregar filtros opcionales
        if (orientacion) params.orientation = orientacion;
        if (color) params.color = color;

        // Mostrar paramatros ne consola
        console.log("Parámetros de búsqueda:", params);

        // Realizar la solicitud a la API de Unsplash
        const response = await axios.get("https://api.unsplash.com/search/photos", {
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
            params,
        });

        // Verificamos si se encontraron imagenes
        if (response.data.results.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron imágenes"
            });
        }

        // Enviamos las imagenes encontradas
        res.json(response.data.results);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener las imagenes de Unsplash"
        });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});