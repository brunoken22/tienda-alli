import { Model } from "sequelize";
import Admin from "./admin.model";
import bcrypt from "bcrypt";
import generate5DigitCode from "@/utils/codeRandom";
import sendCodeEmail from "@/lib/nodemailer";

export async function getAdminService(id: string) {
  const admin = await Admin.findByPk(id);
  return admin;
}

export async function signinAdminService(email: string, password: string): Promise<Model | false> {
  const admin = await Admin.scope("withPassword").findOne({
    where: {
      email,
    },
  });
  if (!admin?.dataValues.id) throw new Error("Este usuario no existe");

  const isValid = await bcrypt.compare(password, admin?.dataValues.password);
  if (isValid && admin) {
    return admin;
  }
  return false;
}

export async function resetPasswordService(id: string, password: string, newPassword: string) {
  try {
    const admin = await Admin.scope("withPassword").findByPk(id);
    if (!admin?.dataValues.id) throw new Error("Este usuario no existe");
    const isValid = await bcrypt.compare(password, admin?.dataValues.password);
    if (!isValid) throw new Error("No tienes permiso para cambiar la contraseña");

    const [updatePassword] = await admin.update(
      {
        password: newPassword.trim(),
      },
      {
        where: { id },
      },
    );
    return updatePassword;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function sendEmailPasswordService(email: string) {
  try {
    const admin = await Admin.findOne({
      where: {
        email,
      },
      attributes: ["id", "name"],
    });

    if (!admin) {
      return "No se encontro el usuario";
    }
    const code = generate5DigitCode();
    const expires = Date.now() + 3600000;
    const expiryDate = new Date(expires);

    const [updateAdminRecover] = await Admin.update(
      {
        recoverPassword: code,
        recoverPasswordExpires: expiryDate,
      },
      { where: { id: admin.dataValues.id } },
    );
    if (updateAdminRecover) {
      await sendCodeEmail(email, code, admin.dataValues.name);
    }
    return { message: "Se envió el código al email", update: updateAdminRecover };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function verifyCodeService(email: string, code: string) {
  try {
    const admin = await Admin.scope("withRecover").findOne({
      where: {
        email,
      },
    });

    if (!admin) {
      throw new Error("No se encontro el usuario");
    }

    if (!admin.dataValues.recoverPassword) {
      throw new Error("Primero solicite un código de verificación");
    }

    const date = new Date().getTime();
    if (date > admin.dataValues.recoverPasswordExpires.getTime()) {
      throw new Error("Codigó vencido, tiempo agotado");
    }

    if (code.trim() !== admin.dataValues.recoverPassword) {
      throw new Error("Codigó inválido");
    }

    // await Admin.update(
    //   {
    //     recoverPassword: null,
    //     recoverPasswordExpires: null,
    //   },
    //   {
    //     where: { id: admin.dataValues.id },
    //   }
    // );
    return { verify: true };
  } catch (e) {
    const error = e as Error;
    console.error(e);

    throw new Error(error.message);
  }
}

export async function recoverPasswordService(email: string, code: string, password: string) {
  try {
    const admin = await Admin.scope("withRecover").findOne({
      where: {
        email,
      },
    });

    if (
      !admin ||
      !admin?.dataValues?.recoverPasswordExpires ||
      !admin?.dataValues?.recoverPassword
    ) {
      throw new Error("No se encontro el usuario");
    }

    const date = new Date().getTime();
    if (date > admin.dataValues.recoverPasswordExpires.getTime()) {
      throw new Error("Codigó vencido, tiempo agotado");
    }

    if (code.trim() !== admin.dataValues.recoverPassword) {
      throw new Error("Codigó inválido");
    }
    const oldPassword = admin.dataValues.password;
    const updateAdminRecover = await admin.update(
      {
        password,
        recoverPassword: null,
        recoverPasswordExpires: null,
      },
      { where: { id: admin.dataValues.id } },
    );
    if (updateAdminRecover.dataValues.password !== oldPassword) {
      return { message: "Se cambia la contraseña exitosamente.", update: updateAdminRecover };
    }
    throw new Error("Hubo un error al actualizar la contraseña");
  } catch (e) {
    const error = e as Error;
    console.error("recoverPasswordService: ", error);
    throw new Error(error.message);
  }
}
