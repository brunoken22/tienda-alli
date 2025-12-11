"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";

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
    { id: "camperas_mujer", name: "Camperas Mujer" },
    { id: "camperas_hombre", name: "Camperas Hombre" },
    { id: "mochilas", name: "Mochilas" },
    { id: "billeteras", name: "Billeteras" },
    { id: "carteras", name: "Carteras" },
    { id: "riñoneras", name: "Riñoneras" },
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
    <div className={`${isMobile ? "h-full flex flex-col text-white" : "text-foreground"}`}>
      {isMobile && (
        <div className='flex items-center justify-between p-4 border-b bg-card'>
          <div className='flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            <h2 className='font-semibold'>Filtros</h2>
            {activeFiltersCount > 0 && (
              <Badge variant={isMobile ? "default" : "secondary"} size='sm'>
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button variant={isMobile ? "default" : "secondary"} size='icon' onClick={closeFilter}>
            <X className='w-5 h-5' />
          </Button>
        </div>
      )}

      <div className={`${isMobile ? "flex-1 overflow-y-auto p-4" : ""} space-y-6`}>
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
                variant={isMobile ? "default" : "secondary"}
                size='sm'
                onClick={clearAllFilters}
                className='text-sm'
              >
                Limpiar todo
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return (
                  <Badge
                    key={categoryId}
                    variant={isMobile ? "default" : "secondary"}
                    className='text-sm'
                  >
                    {category?.name}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground'
                      onClick={() => handleCategoryToggle(categoryId)}
                    >
                      <X className='w-3 h-3' />
                    </Button>
                  </Badge>
                );
              })}
              {(priceRange[0] > 0 || priceRange[1] < 70000) && (
                <Badge variant={isMobile ? "default" : "secondary"} className='text-sm'>
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground'
                    onClick={() => setPriceRange([0, 70000])}
                  >
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
            onClick={() => toggleSection("categories")}
            className='w-full justify-between p-0 h-auto font-medium text-sm'
          >
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
                  className='flex items-center space-x-2 cursor-pointer group'
                >
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
        <div className='space-y-3 '>
          <h3
            // onClick={() => toggleSection("categories")}
            className='w-full  text-xl font-bold'
          >
            Precio
          </h3>
          <div className='relative py-2'>
            <Slider.Root
              className='relative flex items-center w-full h-5'
              value={[priceRange[0], priceRange[1]]}
              max={70000}
              step={1000}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
            >
              <Slider.Track className='bg-gray-300 relative flex-1 rounded-full h-1.5'>
                <Slider.Range className='absolute bg-primary rounded-full h-full' />
              </Slider.Track>

              {/* Thumb mínimo con etiqueta */}
              <Slider.Thumb
                className='relative block w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary transition-transform'
                aria-label='Precio mínimo'
              >
                <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap'>
                  ${priceRange[0].toLocaleString()}
                  <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45'></div>
                </div>
              </Slider.Thumb>

              {/* Thumb máximo con etiqueta */}
              <Slider.Thumb
                className='relative block w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary transition-transform'
                aria-label='Precio máximo'
              >
                <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap'>
                  ${priceRange[1].toLocaleString()}
                  <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45'></div>
                </div>
              </Slider.Thumb>
            </Slider.Root>

            {/* Límites del slider */}
            <div className='flex justify-between mt-2 text-sm text-gray-200'>
              <span>$0</span>
              <span>$70k</span>
            </div>
          </div>

          {/* Inputs manuales */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='min-price' className='block text-sm font-medium text-gray-200 mb-2'>
                Precio mínimo
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                  $
                </span>
                <input
                  id='min-price'
                  type='number'
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = Math.min(Number(e.target.value), priceRange[1]);
                    setPriceRange([newMin, priceRange[1]]);
                  }}
                  className='w-full pl-8 pr-4 py-3 text-base border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  min='0'
                  max={priceRange[1]}
                  step='1000'
                />
              </div>
            </div>

            <div>
              <label htmlFor='max-price' className='block text-sm font-medium text-gray-200 mb-2'>
                Precio máximo
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                  $
                </span>
                <input
                  id='max-price'
                  type='number'
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = Math.max(Number(e.target.value), priceRange[0]);
                    setPriceRange([priceRange[0], newMax]);
                  }}
                  className='w-full pl-8 pr-4 py-3 text-base border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  min={priceRange[0]}
                  max='70000'
                  step='1000'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <div className='border-t p-4 bg-card'>
          <Button
            className='w-full text-white bg-purple-600 hover:bg-purple-700'
            onClick={closeFilter}
          >
            Aplicar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
