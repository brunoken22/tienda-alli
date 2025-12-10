"use server";
import { cookies } from "next/headers";

export async function logout() {
  try {
    cookies().delete("token_admin");
    return true;
  } catch (e) {
    return false;
  }
}
