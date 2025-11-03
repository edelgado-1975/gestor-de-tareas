const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const enviarEmailRecordatorio = async (destinatarioEmail, destinatarioNombre, tareaDescripcion) => {
    try {
        await transporter.sendMail({
            from: `"Gestor de Tareas" <${process.env.EMAIL_USER}>`,
            to: destinatarioEmail,
            subject: 'Recordatorio: Tarea Próxima a Vencer',
            html: `
                <p>Hola ${destinatarioNombre},</p>
                <p>Este es un recordatorio de que tu tarea está próxima a vencer:</p>
                <h3>${tareaDescripcion}</h3>
                <p>¡No te olvides de completarla!</p>
                <br>
                <p>Saludos,</p>
                <p><strong>Tu Gestor de Tareas</strong></p>
            `,
        });
        console.log(`Correo de recordatorio enviado a ${destinatarioEmail}`);
    } catch (error) {
        console.error(`Error al enviar correo a ${destinatarioEmail}:`, error);
    }
};

module.exports = { enviarEmailRecordatorio };