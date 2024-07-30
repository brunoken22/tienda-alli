import type {Metadata} from 'next';
import ProductosComponent from '@/components/productos';

export const metadata: Metadata = {
  title: 'Productos | Tienda Alli',
  description: 'Los productos (Tienda Alli)',
};
export default function Products() {
  return <ProductosComponent></ProductosComponent>;
}
