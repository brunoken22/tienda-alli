import { AuthService } from "@/lib/jsonwebtoken";
import {
  getAdminService,
  sendEmailPasswordService,
  resetPasswordService,
  signinAdminService,
  verifyCodeService,
  recoverPasswordService,
} from "./admin.service";
import { cookies } from "next/headers";

export async function getAdminController() {
  const token = cookies().get("token_admin")?.value;
  if (!token) throw new Error("Hace falta el token para acceder");
  const verifyToken = AuthService.verifyToken(token);
  if (!verifyToken?.id) throw new Error("Token inválido");
  const admin = await getAdminService(verifyToken.id);
  return { data: admin, success: true };
}

export async function signinAdminController(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Datos incompletos");
  }
  if (password.length < 6) {
    throw new Error("La contraseña tiene que tener minimo de 6 digitos");
  }
  const admin = await signinAdminService(email, password);
  if (admin) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const { role, email, id } = admin.dataValues;
    const token = AuthService.generateToken({ role, email, id });
    cookies().set("token_admin", token, { expires });
    return { signin: true };
  }
  throw new Error("Contraseña o email incorrectos");
}

export async function resetPasswordController(id: string, password: string, newPassword: string) {
  try {
    if (!id || !password || !newPassword) {
      throw new Error("Se necesitan todos los datos.");
    }
    const responseResetPasswordService = await resetPasswordService(id, password, newPassword);
    if (!responseResetPasswordService) {
      throw new Error("Hubo un problema al hacer el cambiar contraseña");
    }
    return { success: true, data: { update: true } };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function sendEmailPasswordController(email: string) {
  try {
    if (!email) {
      throw new Error("Falta el email");
    }
    const passwordService = await sendEmailPasswordService(email);
    if (typeof passwordService === "string") {
      return { data: passwordService, success: false };
    }
    return { data: passwordService, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function verifyPasswordController(email: string, code: string) {
  try {
    if (!email || !code) {
      throw new Error("Faltan datos");
    }
    const passwordService = await verifyCodeService(email, code);

    return { data: passwordService, success: true };
  } catch (e) {
    const error = e as Error;
    console.error(e);
    throw new Error(error.message);
  }
}

export async function recoverPasswordController(email: string, code: string, password: string) {
  try {
    if (!email || !code || !password) {
      throw new Error("Faltan datos");
    }
    const responseRecoverPasswordService = await recoverPasswordService(email, code, password);
    return { data: responseRecoverPasswordService, success: false };
  } catch (e) {
    const error = e as Error;
    console.error("recoverPasswordController: ", e);
    throw new Error(error.message);
  }
}
