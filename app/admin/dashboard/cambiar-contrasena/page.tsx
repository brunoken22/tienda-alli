"use client";

import type React from "react";
import { useState, useCallback, useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "@/contexts/auth-context";
import { updateResetPassword } from "@/lib/admin";

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

export default function PasswordBuilder() {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const calculateStrength = useCallback((pwd: string): PasswordStrength => {
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

    if (metRequirements === 1) {
      score = 25;
      level = "weak";
    } else if (metRequirements === 2) {
      score = 50;
      level = "fair";
    } else if (metRequirements === 3 || metRequirements === 4) {
      score = 75;
      level = "good";
    } else if (metRequirements === 5 && pwd.length >= 12) {
      score = 100;
      level = "strong";
    }

    return { score, level, requirements };
  }, []);

  const strength = calculateStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = strength.score >= 75 && passwordsMatch && oldPassword.length > 0;

  const getStrengthColor = (level: string) => {
    switch (level) {
      case "weak":
        return "bg-destructive";
      case "fair":
        return "bg-yellow-500";
      case "good":
        return "bg-blue-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthLabel = (level: string) => {
    const labels = {
      weak: "Muy débil",
      fair: "Regular",
      good: "Buena",
      strong: "Muy fuerte",
    };
    return labels[level as keyof typeof labels] || "Desconocida";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return alert("Tienes que loguearte");
    if (password.trim() !== confirmPassword.trim()) return alert("La contraseña no coinciden");
    const responseResetPassword = await updateResetPassword(
      user?.id,
      oldPassword,
      confirmPassword.trim()
    );
    if (responseResetPassword.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        setError("");
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        setIsSubmitted(false);
      }, 2000);
    }
    setError(responseResetPassword.message);
    setIsSubmitted(false);
  };

  return (
    <Card className='max-w-lg p-8 max-md:p-4'>
      <CardHeader>
        <CardTitle className='text-2xl'>Cambiar Contraseña</CardTitle>
        <CardDescription>Actualiza tu contraseña con una nueva más segura</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='old-password' className='text-sm font-medium'>
              Contraseña Antigua
            </label>
            <div className='relative'>
              <Input
                id='old-password'
                type={showOldPassword ? "text" : "password"}
                placeholder='Ingresa tu contraseña actual...'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => setShowOldPassword(!showOldPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                aria-label={showOldPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

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
                  {getStrengthLabel(strength.level)}
                </span>
              </div>
              <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor(
                    strength.level
                  )}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}

          {/* Requirements Checklist */}
          {password.length > 0 && (
            <div className='bg-card/50 rounded-lg p-4 space-y-2 border border-border'>
              <p className='text-sm font-medium mb-3'>Requisitos de contraseña:</p>
              <RequirementItem met={strength.requirements.minLength} text='Al menos 8 caracteres' />
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
                text='Un carácter especial (!@#$%^&*)'
              />
            </div>
          )}

          {/* Confirm Password Input */}
          <div className='space-y-2'>
            <label htmlFor='confirm-password' className='text-sm font-medium'>
              Confirmar Contraseña Nueva
            </label>
            <div className='relative'>
              <Input
                id='confirm-password'
                type={showConfirmPassword ? "text" : "password"}
                placeholder='Confirma tu contraseña nueva...'
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
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle size={16} />
                Las contraseñas no coinciden
              </p>
            )}
            {passwordsMatch && (
              <p className='text-sm text-green-600 flex items-center gap-1'>
                <CheckCircle2 size={16} />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type='submit' disabled={!isValid || isSubmitted} className='w-full' size='lg'>
            {isSubmitted ? "✓ Contraseña actualizada" : "Cambiar Contraseña"}
          </Button>

          {/* Validation Message */}
          {password.length > 0 && !isValid && (
            <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
              <p className='text-sm text-blue-800 dark:text-blue-200'>
                La contraseña debe ser{" "}
                <strong>
                  {strength.score < 75
                    ? "más fuerte"
                    : passwordsMatch
                    ? "confirmada"
                    : "confirmada correctamente"}
                </strong>
              </p>
            </div>
          )}
          {error ? (
            <div className='bg-red-500  border border-red-200 rounded-lg p-3'>
              <p className='text-sm text-secondary'>{error}</p>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className='flex items-center gap-2'>
      {met ? (
        <CheckCircle2 size={18} className='text-green-600' />
      ) : (
        <AlertCircle size={18} className='text-muted-foreground' />
      )}
      <span className={`text-sm ${met ? "text-green-600" : "text-muted-foreground"}`}>{text}</span>
    </div>
  );
}
