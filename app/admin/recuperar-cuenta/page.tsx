"use client";

import type React from "react";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Mail, Code } from "lucide-react";
import { sendCodePassword, updateRecoverPassword, verifyCodePassword } from "@/lib/admin";

interface PasswordStrength {
  score: number;
  level: "weak" | "fair" | "good" | "strong";
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

type Step = "email" | "code" | "reset";

export default function ForgotPasswordPage() {
  const { push, replace } = useRouter();
  const searchParams = useSearchParams();
  const resetCode = searchParams.get("code");
  const resetEmail = searchParams.get("email");

  const initialStep: Step = resetCode ? "reset" : "email";
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);

  // Step 1: Email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Step 2: Code verification
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  // Step 3: Reset password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const calculateStrength = (pwd: string): PasswordStrength => {
    const requirements = {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};:'",.<>?]/.test(pwd),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    let score = 0;
    let level: "weak" | "fair" | "good" | "strong" = "weak";

    if (metRequirements === 1) score = 25;
    else if (metRequirements === 2) score = 50;
    else if (metRequirements === 3 || metRequirements === 4) score = 75;
    else if (metRequirements === 5 && pwd.length >= 12) score = 100;

    if (score <= 25) level = "weak";
    else if (score <= 50) level = "fair";
    else if (score <= 75) level = "good";
    else level = "strong";

    return { score, level, requirements };
  };

  const strength = calculateStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isPasswordValid = strength.score >= 75 && passwordsMatch;

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Por favor ingresa un email válido");
      return;
    }

    setLoadingEmail(true);
    try {
      const responseSendCodePassword = await sendCodePassword(email);
      if (!responseSendCodePassword.success) {
        setEmailError(responseSendCodePassword.message);
        return;
      }
      replace(`/admin/recuperar-cuenta?email=${email}`);
      setEmailSent(true);
      setCurrentStep("code");
    } catch (error) {
      setEmailError("Error de conexión. Intenta nuevamente");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");

    if (code.length !== 5) {
      setCodeError("El código debe tener al menos 6 caracteres");
      return;
    }

    setLoadingCode(true);
    try {
      const responseVerifyCodePassword = await verifyCodePassword(email, code);
      if (!responseVerifyCodePassword.success) {
        setCodeError(responseVerifyCodePassword.message);
        return;
      }

      setCodeVerified(true);
      setCurrentStep("reset");
      replace(`/admin/recuperar-cuenta?email=${email}&code=${code}`);
    } catch (error) {
      setCodeError("Error de conexión. Intenta nuevamente");
    } finally {
      setLoadingCode(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    if (!resetEmail || !resetCode || !password) {
      return;
    }

    setLoadingReset(true);
    try {
      const response = await updateRecoverPassword(resetEmail, resetCode, password);

      if (!response?.success) {
        throw new Error(response?.message);
      }

      setResetSuccess(true);
      setTimeout(() => {
        push("/admin/login");
      }, 2000);
    } catch (e) {
      const error = e as Error;
      console.error("Reset error:", error);
      alert(error.message);
    } finally {
      setLoadingReset(false);
    }
  };

  useEffect(() => {
    // Obtener los parámetros actuales
    const code = searchParams.get("code");
    const email = searchParams.get("email");

    if (email) {
      setEmailSent(true);
    }

    if (code) {
      setCodeVerified(true);
    }
  }, [searchParams]);

  return (
    <Suspense>
      <div className='flex items-center justify-center border-2 !py-24'>
        <div className='w-full max-w-md'>
          {/* STEP 1: Email */}
          {currentStep === "email" && (
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl text-primary'>Recuperar Contraseña</CardTitle>
                <CardDescription>
                  Ingresa tu email para recibir un código de recuperación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <label htmlFor='email' className='text-sm font-medium flex items-center gap-2'>
                      <Mail size={16} /> Email
                    </label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='tu@email.com'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      disabled={emailSent}
                      className={emailError ? "border-destructive" : ""}
                    />
                    {emailError && (
                      <p className='text-sm text-destructive flex items-center gap-1'>
                        <AlertCircle size={16} /> {emailError}
                      </p>
                    )}
                    {emailSent && (
                      <p className='text-sm text-green-600 flex items-center gap-1'>
                        <CheckCircle2 size={16} /> Código enviado a tu email
                      </p>
                    )}
                  </div>

                  <Button
                    type='submit'
                    disabled={!email || loadingEmail || emailSent}
                    className='w-full'
                    size='lg'
                  >
                    {loadingEmail ? "Enviando..." : emailSent ? "✓ Enviado" : "Enviar Código"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Code Verification */}
          {currentStep === "code" && (
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl text-primary'>Verificar Código</CardTitle>
                <CardDescription>Ingresa el código que recibiste en tu email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCodeSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <label htmlFor='code' className='text-sm font-medium flex items-center gap-2'>
                      <Code size={16} /> Código de Recuperación
                    </label>
                    <Input
                      id='code'
                      type='text'
                      placeholder='Ingresa el código de 5 dígitos'
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setCodeError("");
                      }}
                      disabled={codeVerified}
                      maxLength={5}
                      className={codeError ? "border-destructive" : ""}
                    />
                    {codeError && (
                      <p className='text-sm text-destructive flex items-center gap-1'>
                        <AlertCircle size={16} /> {codeError}
                      </p>
                    )}
                    {codeVerified && (
                      <p className='text-sm text-green-600 flex items-center gap-1'>
                        <CheckCircle2 size={16} /> Código verificado correctamente
                      </p>
                    )}
                  </div>

                  <Button
                    type='submit'
                    disabled={code.length !== 5 || loadingCode || codeVerified}
                    className='w-full'
                    size='lg'
                  >
                    {loadingCode
                      ? "Verificando..."
                      : codeVerified
                      ? "✓ Verificado"
                      : "Verificar Código"}
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setCurrentStep("email");
                      setEmailSent(false);
                      setCode("");
                      setCodeError("");
                    }}
                    className='w-full'
                  >
                    Cambiar Email
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Reset Password */}
          {currentStep === "reset" && (
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl text-primary'>Nueva Contraseña</CardTitle>
                <CardDescription>Crea una nueva contraseña fuerte para tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className='space-y-4'>
                  {/* Password Input */}
                  <div className='space-y-2'>
                    <label htmlFor='password' className='text-sm font-medium'>
                      Contraseña Nueva
                    </label>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? "text" : "password"}
                        placeholder='Ingresa una contraseña fuerte...'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Strength Indicator */}
                  {password.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Fortaleza:</span>
                        <span className='text-sm font-semibold text-primary'>
                          {strength.level === "weak" && "Muy débil"}
                          {strength.level === "fair" && "Regular"}
                          {strength.level === "good" && "Buena"}
                          {strength.level === "strong" && "Muy fuerte"}
                        </span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength.level === "weak"
                              ? "bg-destructive"
                              : strength.level === "fair"
                              ? "bg-yellow-500"
                              : strength.level === "good"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {password.length > 0 && (
                    <div className='bg-card/50 rounded-lg p-4 space-y-2 border border-primary text-sm'>
                      <p className='font-medium mb-3'>Requisitos de contraseña:</p>
                      <RequirementItem
                        met={strength.requirements.minLength}
                        text='Al menos 8 caracteres'
                      />
                      <RequirementItem
                        met={strength.requirements.hasUppercase}
                        text='Una letra mayúscula'
                      />
                      <RequirementItem
                        met={strength.requirements.hasLowercase}
                        text='Una letra minúscula'
                      />
                      <RequirementItem met={strength.requirements.hasNumber} text='Un número' />
                      <RequirementItem
                        met={strength.requirements.hasSpecial}
                        text='Un carácter especial'
                      />
                    </div>
                  )}

                  {/* Confirm Password */}
                  <div className='space-y-2'>
                    <label htmlFor='confirm-password' className='text-sm font-medium'>
                      Confirmar Contraseña
                    </label>
                    <div className='relative'>
                      <Input
                        id='confirm-password'
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder='Confirma tu contraseña...'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pr-10 ${
                          confirmPassword.length > 0 && !passwordsMatch ? "border-destructive" : ""
                        }`}
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                        aria-label={
                          showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                        }
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className='text-sm text-destructive flex items-center gap-1'>
                        <AlertCircle size={16} /> Las contraseñas no coinciden
                      </p>
                    )}
                    {passwordsMatch && (
                      <p className='text-sm text-green-600 flex items-center gap-1'>
                        <CheckCircle2 size={16} /> Las contraseñas coinciden
                      </p>
                    )}
                  </div>

                  <Button
                    type='submit'
                    disabled={!isPasswordValid || loadingReset || resetSuccess}
                    className='w-full'
                    size='lg'
                  >
                    {resetSuccess
                      ? "✓ Contraseña Actualizada"
                      : loadingReset
                      ? "Actualizando..."
                      : "Actualizar Contraseña"}
                  </Button>

                  {resetSuccess && (
                    <p className='text-sm text-green-600 text-center'>
                      Tu contraseña ha sido actualizada correctamente. Redirigiendo...
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Suspense>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className='flex items-center gap-2'>
      {met ? (
        <CheckCircle2 size={16} className='text-green-600' />
      ) : (
        <AlertCircle size={16} className='text-muted-foreground' />
      )}
      <span className={`text-sm ${met ? "text-green-600" : "text-muted-foreground"}`}>{text}</span>
    </div>
  );
}
