import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET! as string;
type Admin = {
  id: string;
  email: string;
  role: string;
};

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  // Generar token JWT
  static generateToken(admin: Admin): string {
    const payload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    // ✅ Ahora TypeScript sabe que JWT_SECRET es string
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  // Verificar token JWT
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expirado");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token inválido");
      }
      throw new Error("Error al verificar token");
    }
  }

  // Decodificar token sin verificar (útil para ver datos)
  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}
