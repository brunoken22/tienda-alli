'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Upload,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  DoorClosed,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface AirtableProduct {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    Images?: Array<{
      url: string;
      thumbnails?: {
        small?: { url: string };
        large?: { url: string };
        full?: { url: string };
      };
    }>;
    'Unit cost'?: number;
    priceOfert?: number;
    type?: string[];
    oferta?: string;
    talla?: string[];
    exist?: boolean;
    [key: string]: any;
  };
}

export default function ProductManagement() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<AirtableProduct[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: undefined as string | undefined,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from Airtable
  const fetchProducts = async (offset?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        ...(offset && { offset }),
        ...(searchQuery && { filterByFormula: `SEARCH('${searchQuery}', {Name})` }),
      });

      const response = await fetch(`/api/admin/dashboard?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.records);
      setPagination({
        limit: data.pagination.limit,
        offset: data.pagination.offset,
        total: data.pagination.total,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const productData = {
      fields: {
        Name: formData.get('name') as string,
        'Unit cost': parseFloat(formData.get('price')),
        type: [formData.get('category') as string],
        exist: true,
      },
    };

    try {
      const response = await fetch('/api/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts(); // Refresh the list
        alert('Producto agregado exitosamente!');
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/airtable?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        push('/admin');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  console.log('Products:', products);
  return (
    <div className='flex bg-gray-50 mt-20'>
      <div className='hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 mt-20'>
        <div className='flex flex-col flex-grow bg-white border-r border-gray-200'>
          <div className='flex items-center flex-shrink-0 px-4 py-6'>
            <Package className='h-8 w-8 text-blue-600' />
            <span className='ml-2 text-xl font-semibold text-gray-900'>Admin Panel</span>
          </div>
          <nav className='flex-1 px-4 pb-4 space-y-1'>
            <a
              href='#'
              className='bg-blue-50 text-blue-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md'>
              <Package className='text-blue-500 mr-3 h-5 w-5' />
              Productos
            </a>
            <a
              href='#'
              className='text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md'>
              <Settings className='text-gray-400 mr-3 h-5 w-5' />
              Configuración
            </a>
            <button
              onClick={handleLogout}
              className='text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left'>
              <DoorClosed className='text-gray-400 mr-3 h-5 w-5' />
              Cerrar sesión
            </button>
          </nav>
          <div className='flex-shrink-0 p-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-full justify-start'>
                  <Avatar className='h-8 w-8 mr-2'>
                    <AvatarImage src='/tienda-alli.webp' />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className='text-sm'>Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className='mr-2 h-4 w-4' />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className='lg:pl-64 flex flex-col flex-1'>
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-4'>
              <h1 className='text-2xl font-semibold text-gray-900'>Gestión de Productos</h1>
              <div className='flex items-center space-x-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    type='search'
                    placeholder='Buscar productos...'
                    className='pl-10 w-64'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 p-4 sm:p-6 lg:p-8'>
          <Tabs defaultValue='list' className='space-y-6'>
            <TabsList>
              <TabsTrigger value='add' className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Agregar Producto
              </TabsTrigger>
              <TabsTrigger value='list' className='flex items-center gap-2'>
                <Package className='h-4 w-4' />
                Lista de Productos
              </TabsTrigger>
            </TabsList>

            <TabsContent value='add'>
              <Card>
                <CardHeader>
                  <CardTitle>Nuevo Producto</CardTitle>
                  <CardDescription>
                    Completa la información del producto para agregarlo a Airtable
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Nombre del Producto *</Label>
                        <Input id='name' name='name' placeholder='Ej: CAMPERA GAMUZADA' required />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='price'>Precio Unitario *</Label>
                        <Input
                          id='price'
                          name='price'
                          type='number'
                          step='0.01'
                          placeholder='0.00'
                          required
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='category'>Categoría *</Label>
                        <Select name='category' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar categoría' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='camperas'>Camperas</SelectItem>
                            <SelectItem value='carteras'>Carteras</SelectItem>
                            <SelectItem value='accesorios'>Accesorios</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='tallas'>Tallas (opcional)</Label>
                        <Input
                          id='tallas'
                          name='tallas'
                          placeholder='Ej: S,M,L,XL (separadas por comas)'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='description'>Descripción (opcional)</Label>
                      <Textarea
                        id='description'
                        name='description'
                        placeholder='Describe las características principales del producto...'
                        rows={4}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>Imágenes (opcional)</Label>
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors'>
                        <Upload className='mx-auto h-12 w-12 text-gray-400' />
                        <div className='mt-4'>
                          <Button type='button' variant='outline'>
                            Seleccionar Imagen
                          </Button>
                          <p className='mt-2 text-sm text-gray-500'>PNG, JPG, GIF hasta 10MB</p>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Switch id='active' name='active' defaultChecked />
                      <Label htmlFor='active'>Producto activo</Label>
                    </div>

                    <div className='flex gap-4'>
                      <Button type='submit' disabled={isLoading} className='flex-1'>
                        {isLoading ? 'Agregando...' : 'Agregar Producto'}
                      </Button>
                      <Button type='button' variant='outline'>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='list'>
              <Card>
                <CardHeader>
                  <CardTitle>Productos Registrados</CardTitle>
                  <CardDescription>
                    Lista de todos los productos en tu base de datos de Airtable
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='flex justify-center py-8'>
                      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
                    </div>
                  ) : (
                    <div className='rounded-md border max-w-full'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>oferta</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Tallas</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Destacado</TableHead>
                            <TableHead>Vendedor</TableHead>
                            <TableHead className='text-right'>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className='flex items-center gap-3'>
                                {product.fields.Images?.[0]?.thumbnails?.small?.url ? (
                                  <Image
                                    src={product.fields.Images[0].thumbnails.small.url}
                                    alt={product.fields.Name}
                                    width={40}
                                    height={40}
                                    className='rounded-md object-cover'
                                  />
                                ) : (
                                  <div className='w-10 h-10 bg-gray-200 rounded-md'></div>
                                )}
                                <span className='font-medium truncate'>{product.fields.Name}</span>
                              </TableCell>
                              <TableCell>${product.fields['Unit cost']}</TableCell>
                              <TableCell>
                                {product.fields.priceOfert ? '$' + product.fields.priceOfert : ''}
                              </TableCell>
                              <TableCell>{product.fields.type?.join(', ')}</TableCell>
                              <TableCell>{product.fields.talla?.join(', ')}</TableCell>
                              <TableCell>
                                <Badge variant={product.fields.exist ? 'default' : 'secondary'}>
                                  {product.fields.exist ? 'Disponible' : 'Agotado'}
                                </Badge>
                              </TableCell>
                              <TableCell>{product.fields.featured ? 'Si' : 'No'}</TableCell>
                              <TableCell>{product.fields.frontPage ? 'Si' : 'No'}</TableCell>
                              <TableCell>{product.fields.vendor}</TableCell>

                              <TableCell className='text-right'>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='sm'>
                                      •••
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem>
                                      <Eye className='mr-2 h-4 w-4' />
                                      Ver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className='mr-2 h-4 w-4' />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className='text-red-600'
                                      onClick={() => handleDelete(product.id)}>
                                      <Trash2 className='mr-2 h-4 w-4' />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className='flex justify-between items-center p-4 border-t'>
                        <div className='text-sm text-gray-600'>
                          Mostrando {products.length} de {pagination.total} productos
                        </div>
                        <div className='space-x-2'>
                          <Button
                            variant='outline'
                            disabled={!pagination.offset}
                            onClick={() => fetchProducts()}>
                            Primera página
                          </Button>
                          <Button
                            variant='outline'
                            disabled={!pagination.offset}
                            onClick={() => fetchProducts(pagination.offset)}>
                            Siguiente página
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
