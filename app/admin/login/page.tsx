"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleX, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const response = await fetch(`/api/admin/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data?.data?.signin) {
      router.push("/admin/dashboard");
    } else {
      setError(data?.message);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='w-full max-w-md m-auto py-12'>
      <div>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center'>Iniciar Sesión</CardTitle>
          <CardDescription className='text-center text-muted-foreground'>
            Accede al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent className='mt-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-foreground'>
                Correo electrónico
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='admin@tienda.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-9 bg-secondary border-border text-foreground'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-foreground'>
                Contraseña
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-9 pr-9 bg-secondary border-border text-foreground'
                  required
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors'
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className='text-sm text-primary hover:text-primary/70 !mb-4'>
                <Link href='/admin/recuperar-cuenta'>Olvidaste contraseña?</Link>
              </div>
            </div>

            {error && (
              <div className='flex items-center p-3 text-sm text-red-100 bg-red-500/90 border-2 border-red-500/50 rounded-md'>
                <CircleX className='mr-2' />
                {error}
              </div>
            )}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
