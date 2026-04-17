const admin = require("firebase-admin");
const express = require("express");
const path = require("path");
const app = express();

const serviceAccount = require("./llave-privada.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/enviar', (req, res) => {
    const { token, titulo, mensaje } = req.body;

    const payload = {
        notification: {
            title: titulo,
            body: mensaje
        },
        token: token
    };

    admin.messaging().send(payload)
        .then((response) => {
            res.send(`<h1>✅ Enviado con éxito</h1><p>ID: ${response}</p><a href="/">Volver</a>`);
        })
        .catch((error) => {
            res.send(`<h1>❌ Error</h1><p>${error}</p><a href="/">Volver</a>`);
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});