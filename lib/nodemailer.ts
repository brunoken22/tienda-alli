import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.HOST!,
  port: Number(process.env.PORT_NODEMAILER!),
  secure: process.env.SECURE === "false" ? false : true,
  auth: {
    user: process.env.NAME_EMAIL!,
    pass: process.env.PASSWORD_EMAIL!,
  },
});

export default async function sendCodeEmail(email: string, code: string, userName?: string) {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Código de Recuperación</title>
    <style>
      /* Variables CSS para modo claro */
      :root {
        --bg-primary: #3c006c;
        --bg-secondary: #f7f9fc;
        --bg-tertiary: #f8fafc;
        --bg-code: #f5f7fa;
        --bg-info: #f0f9ff;
        --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --text-primary: #333333;
        --text-secondary: #4b5563;
        --text-light: #fff;
        --text-muted: #64748b;
        --text-code: #4f46e5;
        --border-color: #e2e8f0;
        --border-info: #0ea5e9;
        --shadow-color: rgba(0, 0, 0, 0.08);
        --code-shadow: rgba(0, 0, 0, 0.1);
        --button-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        --button-shadow: rgba(79, 70, 229, 0.2);
        --expiry-bg: #fef2f2;
        --expiry-text: #ef4444;
        --social-bg: #e2e8f0;
        --social-color: #64748b;
        --code-border-dash: #c3dafe;
      }

      /* Variables para modo oscuro */
      @media (prefers-color-scheme: dark) {
        :root {
          --bg-primary: #3c006c;
          --bg-secondary: #f7f9fc;
          --bg-tertiary: #f8fafc;
          --bg-code: #f5f7fa;
          --bg-info: #f0f9ff;
          --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --text-primary: #333333;
          --text-light: #fff;
          --text-secondary: #4b5563;
          --text-muted: #64748b;
          --text-code: #4f46e5;
          --border-color: #e2e8f0;
          --border-info: #0ea5e9;
          --shadow-color: rgba(0, 0, 0, 0.08);
          --code-shadow: rgba(0, 0, 0, 0.1);
          --button-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          --button-shadow: rgba(79, 70, 229, 0.2);
          --expiry-bg: #fef2f2;
          --expiry-text: #ef4444;
          --social-bg: #e2e8f0;
          --social-color: #64748b;
          --code-border-dash: #c3dafe;
        }

        .code {
          background-color: var(--bg-primary) !important;
          border: 1px solid #404040;
        }

        .code-container {
          background: linear-gradient(135deg, #2d2d2d 0%, #1f2937 100%);
        }

        .info-box {
          background-color: #1e3a5f;
        }

        .info-title {
          color: #93c5fd;
        }

        .info-text {
          color: #dbeafe;
        }
      }

      /* Reset y estilos generales */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: var(--text-primary);
        margin: 0;
        padding: 20px;
        background-color: var(--bg-secondary);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: var(--bg-primary);
        color: var(--text-light);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px var(--shadow-color);
      }

      .header {
        background: var(--bg-gradient);
        padding: 40px 30px;
        text-align: center;
      }

      .logo {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
      }

      .title {
        font-size: 24px;
        font-weight: 600;
        margin: 20px 0 10px;
      }

      .header p {
        font-size: 16px;
        opacity: 0.9;
        margin-top: 10px;
        line-height: 1.5;
      }

      .content {
        padding: 20px 30px;
      }

      .code-container {
        background: linear-gradient(135deg, var(--bg-code) 0%, #e4edf5 100%);
        border-radius: 10px;
        padding: 30px;
        margin: 30px 0;
        text-align: center;
        border: 2px dashed var(--code-border-dash);
      }

      .code {
        font-size: 42px;
        font-weight: bolder;
        letter-spacing: 8px;
        color: var(--text-light);
        background: var(--bg-primary);
        padding: 20px 30px;
        border-radius: 8px;
        display: inline-block;
        box-shadow: 0 4px 6px var(--code-shadow);
        font-family: "Courier New", monospace;
        margin: 15px 0;
        line-height: 1;
      }

      .code-container p.code-label {
        color: var(--text-muted);
        font-size: 15px;
        margin-bottom: 15px;
      }

      .code-container p.code-instruction {
        color: var(--text-muted);
        font-size: 14px;
        margin-top: 20px;
      }

      .message {
        color: var(--text-light);
        font-size: 16px;
        margin-bottom: 25px;
        line-height: 1.7;
      }

      .highlight {
        color: var(--border-info);
        font-weight: bolder;
      }

      .info-box {
        background-color: var(--bg-info);
        border-left: 4px solid var(--border-info);
        padding: 20px;
        margin: 25px 0;
        border-radius: 0 8px 8px 0;
      }

      .info-title {
        color: var(--border-info);
        font-weight: 600;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-text {
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.6;
      }

      .info-text p {
        margin-bottom: 8px;
      }

      .info-text p:last-child {
        margin-bottom: 0;
      }

      .expiry {
        color: var(--expiry-text);
        font-weight: 600;
        background-color: var(--expiry-bg);
        padding: 12px 20px;
        border-radius: 6px;
        display: inline-block;
        margin-top: 10px;
      }

      .button-container {
        text-align: center;
        margin: 30px 0;
      }

      .button {
        display: inline-block;
        background: var(--bg-secondary);
        color: var(--text-code);
        padding: 14px 32px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px var(--button-shadow);
        border: none;
        cursor: pointer;
      }

      .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px var(--button-shadow);
      }

      .expiry-container {
        text-align: center;
        margin-top: 30px;
      }

      /* Mejoras para enlaces */
      a {
        color: var(--text-code);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      /* Mejoras responsive */
      @media (max-width: 600px) {
        body {
          padding: 10px;
        }

        .content {
          padding: 25px 20px;
        }

        .header {
          padding: 30px 20px;
        }

        .code {
          font-size: 32px;
          letter-spacing: 6px;
          padding: 15px 20px;
        }

        .title {
          font-size: 20px;
        }

        .code-container {
          padding: 20px;
        }

        .info-box {
          padding: 15px;
        }
      }

      @media (max-width: 400px) {
        .code {
          font-size: 24px;
          letter-spacing: 4px;
          padding: 12px 15px;
        }

        .button {
          padding: 12px 24px;
          font-size: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Encabezado -->
      <div class="header">
        <div class="logo">TIENDA ALLI</div>
        <h1 class="title">Recuperación de Contraseña</h1>
        <p>
          Hola ${userName ? userName : "usuario"}, hemos recibido una solicitud para restablecer
          tu contraseña.
        </p>
      </div>

      <!-- Contenido principal -->
      <div class="content">
        <p class="message">
          Utiliza el siguiente código de verificación para completar el proceso de recuperación de
          tu cuenta. Este código es válido por <span class="highlight">60 minutos</span>.
        </p>

        <!-- Código de verificación -->
        <div class="code-container">
          <p class="code-label">Tu código de verificación es:</p>
          <div class="code">${code}</div>
          <p class="code-instruction">⏱️ Introduce este código en la página de recuperación</p>
        </div>

        <!-- Información importante -->
        <div class="info-box">
          <div class="info-title">
            <span>📌 Información importante</span>
          </div>
          <div class="info-text">
            <p>• Este código es de un solo uso y expirará en 1 hora.</p>
            <p>• Si no solicitaste este código, puedes ignorar este mensaje.</p>
            <p>• Nunca compartas este código con otras personas.</p>
            <p>• Para mayor seguridad, cambia tu contraseña regularmente.</p>
          </div>
        </div>

        <!-- Botón de acción -->
        <div class="button-container">
          <a href="tienda-alli.vercel.app" class="button">Ir al sitio web</a>
        </div>

        <!-- Advertencia de expiración -->
        <div class="expiry-container">
          <div class="expiry">⚠️ Este código expira en 60 minutos</div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
  const textContent = `
    Recuperación de Contraseña - SecureAuth
    
    Hola ${userName ? userName : "usuario"},
    
    Hemos recibido una solicitud para restablecer tu contraseña.
    
    Tu código de verificación es: ${code}
    
    Este código es válido por 60 minutos.
    
    ⚠️ Importante:
    • Este código es de un solo uso
    • No lo compartas con nadie
    • Si no solicitaste este código, ignora este mensaje
    
    © ${new Date().getFullYear()} SecureAuth. Todos los derechos reservados.
    Este es un mensaje automático, no respondas a este correo.
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Tienda Alli Support" <${process.env.NAME_EMAIL}>`,
      to: email,
      subject: `Tu código de recuperación: ${code}`,
      text: textContent,
      html: htmlContent,
    });

    console.log("✅ Email enviado exitosamente:", info.messageId);
    console.log("📧 Enviado a:", email);
    console.log("🔑 Código enviado:", code);

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
    throw error;
  }
}
