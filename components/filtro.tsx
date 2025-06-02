'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FiltroSearchProps {
  valueDefault: {
    typeSearch: string[];
    typePrice: number[];
  };
  typeCategoriaPrice: (category: string[], price: number[]) => void;
  closeFilter: () => void;
  search: string;
  isMobile: boolean;
  children?: React.ReactNode;
}

export function FiltroSearch({
  valueDefault,
  typeCategoriaPrice,
  closeFilter,
  search,
  isMobile,
  children,
}: FiltroSearchProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(valueDefault.typeSearch);
  const [priceRange, setPriceRange] = useState<number[]>(valueDefault.typePrice);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
  });

  const categories = [
    { id: 'camperas_mujer', name: 'Camperas Mujer' },
    { id: 'camperas_hombre', name: 'Camperas Hombre' },
    { id: 'mochilas', name: 'Mochilas' },
    { id: 'billeteras', name: 'Billeteras' },
    { id: 'carteras', name: 'Carteras' },
    { id: 'riñoneras', name: 'Riñoneras' },
  ];

  useEffect(() => {
    typeCategoriaPrice(selectedCategories, priceRange);
  }, [selectedCategories, priceRange, typeCategoriaPrice]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 70000]);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFiltersCount =
    selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 70000 ? 1 : 0);

  return (
    <div className={`${isMobile ? 'h-full flex flex-col text-white' : 'text-foreground'}`}>
      {isMobile && (
        <div className='flex items-center justify-between p-4 border-b bg-card'>
          <div className='flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            <h2 className='font-semibold'>Filtros</h2>
            {activeFiltersCount > 0 && (
              <Badge variant={isMobile ? 'default' : 'secondary'} size='sm'>
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button variant={isMobile ? 'default' : 'secondary'} size='icon' onClick={closeFilter}>
            <X className='w-5 h-5' />
          </Button>
        </div>
      )}

      <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : ''} space-y-6`}>
        {children && (
          <div className='space-y-2'>
            <h3 className='font-medium text-sm text-muted-foreground'>Búsqueda</h3>
            {children}
          </div>
        )}

        {activeFiltersCount > 0 && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-sm text-muted-foreground'>Filtros activos</h3>
              <Button
                variant={isMobile ? 'default' : 'secondary'}
                size='sm'
                onClick={clearAllFilters}
                className='text-sm'>
                Limpiar todo
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return (
                  <Badge
                    key={categoryId}
                    variant={isMobile ? 'default' : 'secondary'}
                    className='text-sm'>
                    {category?.name}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground'
                      onClick={() => handleCategoryToggle(categoryId)}>
                      <X className='w-3 h-3' />
                    </Button>
                  </Badge>
                );
              })}
              {(priceRange[0] > 0 || priceRange[1] < 70000) && (
                <Badge variant={isMobile ? 'default' : 'secondary'} className='text-sm'>
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground'
                    onClick={() => setPriceRange([0, 70000])}>
                    <X className='w-3 h-3' />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Categorías */}
        <div className='space-y-3'>
          <Button
            variant='primary'
            onClick={() => toggleSection('categories')}
            className='w-full justify-between p-0 h-auto font-medium text-sm'>
            Categorías
            {expandedSections.categories ? (
              <ChevronUp className='w-4 h-4' />
            ) : (
              <ChevronDown className='w-4 h-4' />
            )}
          </Button>
          {expandedSections.categories && (
            <div className='space-y-2'>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className='flex items-center space-x-2 cursor-pointer group'>
                  <input
                    type='checkbox'
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className='rounded border-gray-300 text-primary focus:ring-primary'
                  />
                  <span className='text-sm group-hover:opacity-70 transition-colors flex-1'>
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Precio */}
        <div className='space-y-3'>
          <Button
            variant='primary'
            onClick={() => toggleSection('price')}
            className='w-full justify-between p-0 h-auto font-medium text-sm'
            aria-expanded={expandedSections.price} // Mejora accesibilidad
          >
            Precio
            {expandedSections.price ? (
              <ChevronUp className='w-4 h-4' aria-hidden='true' />
            ) : (
              <ChevronDown className='w-4 h-4' aria-hidden='true' />
            )}
          </Button>

          {expandedSections.price && (
            <div className='space-y-4'>
              {/* Inputs de número */}
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label htmlFor='min-price' className='block text-sm text-muted-foreground mb-1'>
                    Mínimo
                  </label>
                  <input
                    id='min-price'
                    type='number'
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                    className='w-full text-black px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                    min='0'
                    max={priceRange[1]}
                  />
                </div>
                <div>
                  <label htmlFor='max-price' className='block text-sm text-muted-foreground mb-1'>
                    Máximo
                  </label>
                  <input
                    id='max-price'
                    type='number'
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                    className='w-full text-black px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                    min={priceRange[0]}
                    max='100000'
                  />
                </div>
              </div>

              {/* Sliders */}
              <div className='space-y-2'>
                <label id='min-range-label' htmlFor='min-range' className='sr-only'>
                  Rango mínimo de precio
                </label>
                <input
                  id='min-range'
                  type='range'
                  min='0'
                  max='70000'
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className='w-full'
                  aria-labelledby='min-range-label price-range-text'
                  aria-valuetext={`${priceRange[0].toLocaleString()}`}
                />
                <label id='max-range-label' htmlFor='max-range' className='sr-only'>
                  Rango máximo de precio
                </label>
                <input
                  id='max-range'
                  type='range'
                  min='0'
                  max='70000'
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className='w-full'
                  aria-labelledby='max-range-label price-range-text'
                  aria-valuetext={`${priceRange[1].toLocaleString()}`}
                />
              </div>

              {/* Texto descriptivo */}
              <div
                id='price-range-text'
                className='text-center text-sm text-muted-foreground'
                role='status'>
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div className='border-t p-4 bg-card'>
          <Button
            className='w-full text-white bg-purple-600 hover:bg-purple-700'
            onClick={closeFilter}>
            Aplicar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
