export async function updateResetPassword(id: string, password: string, newPassword: string) {
  try {
    const response = await fetch(`/api/admin/reset-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password, newPassword }),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    const error = e as Error;
    return { message: error.message, success: false };
  }
}

export async function sendCodePassword(email: string) {
  try {
    const response = await fetch("/api/admin/recuperar-cuenta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    const error = e as Error;
    return { messsage: error.message, success: false };
  }
}

export async function verifyCodePassword(email: string, code: string) {
  try {
    const response = await fetch("/api/admin/recover-password/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    const error = e as Error;
    return { messsage: error.message, success: false };
  }
}

export async function updateRecoverPassword(email: string, code: string, password: string) {
  try {
    const response = await fetch("/api/admin/recover-password/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
  } catch (e) {
    const error = e as Error;
    return { message: error.message, success: false };
  }
}
