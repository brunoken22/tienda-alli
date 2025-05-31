import { NextResponse } from 'next/server';

const HARDCODED_CREDENTIALS = {
  email: process.env.EMAIL_ADMIN,
  password: process.env.PASSWORD_ADMIN,
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    if (
      email.trim() === HARDCODED_CREDENTIALS.email &&
      password === HARDCODED_CREDENTIALS.password
    ) {
      // Simular token de autenticación
      const fakeToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      // Crear la respuesta
      const response = NextResponse.json({
        success: true,
        user: {
          email,
          name: 'Usuario Demo',
        },
        token: fakeToken, // Opcional: puedes quitarlo si solo usas cookies
      });

      // Establecer la cookie en la respuesta
      response.cookies.set('auth_token', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/', // Importante especificar el path
      });

      return response;
    } else {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Crear respuesta de éxito
    const response = NextResponse.json(
      { success: true, message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );

    // Eliminar la cookie de autenticación
    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}
