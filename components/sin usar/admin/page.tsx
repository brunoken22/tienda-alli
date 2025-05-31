'use client';

import type React from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Package, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
        general: '', // También limpiamos el error general
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: '',
    };

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // Redirigir al dashboard
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      setErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : 'Error en el servidor',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mt-20 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo y título */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='bg-primary p-3 rounded-full'>
              <Package className='h-8 w-8 text-white' />
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Panel</h1>
          <p className='text-gray-600 mt-2'>Accede a tu panel de administración</p>
        </div>

        {/* Formulario de login */}
        <Card className='shadow-xl border-0'>
          <CardHeader className='space-y-1 pb-6'>
            <CardTitle className='text-2xl font-semibold text-center'>Iniciar Sesión</CardTitle>
            <CardDescription className='text-center'>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm'>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Campo Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='usuario@ejemplo.com'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.email && <p className='text-sm text-red-600'>{errors.email}</p>}
              </div>

              {/* Campo Contraseña */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password123'
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                {errors.password && <p className='text-sm text-red-600'>{errors.password}</p>}
              </div>

              {/* Recordar sesión y olvidé contraseña */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <input
                    id='remember'
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <Label htmlFor='remember' className='text-sm text-gray-600'>
                    Recordar sesión
                  </Label>
                </div>
                <a href='#' className='text-sm text-blue-600 hover:text-blue-500'>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón de submit */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-primary hover:opacity-80 text-white'>
                {isLoading ? (
                  <div className='flex items-center space-x-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
