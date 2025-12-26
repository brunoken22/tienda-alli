import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className='bg-primary text-secondary  border-t mt-auto'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-2 group'>
              <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                <span className='text-purple-600 font-bold text-lg'>A</span>
              </div>
              <span className='max-lg:hidden text-white font-bold text-xl md:text-2xl group-hover:text-purple-200 transition-colors'>
                Tienda de ALLI
              </span>
            </Link>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Tu tienda online de confianza con los mejores productos y la mejor atención al
              cliente.
            </p>
            <div className='flex gap-3'>
              <Link
                href='https://www.facebook.com/search/top/?q=tienda%20alli'
                target='_blank'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='w-4 h-4' />
              </Link>
              <Link
                href='https://www.instagram.com/brunoken18/'
                target='_blank'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='w-4 h-4' />
              </Link>
              <Link
                href='https://www.linkedin.com/in/brunoken18/'
                target='_blank'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Instagram'
              >
                <Linkedin className='w-4 h-4' />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Enlaces Rápidos</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/productos'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Novedades
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Contacto</h3>
            <ul className='space-y-3 text-sm'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-4 h-4 mt-1 text-muted-foreground flex-shrink-0' />
                <span className='text-muted-foreground'>
                  Buenos Aires, Argentina,
                  {/* <br />
                  Ciudad, País 12345 */}
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                <Link
                  href='tel:+541161204047'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  +54 (11) 6120-4047
                </Link>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                <Link
                  href='mailto:info@tutienda.com'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  bruno_am_22@hotmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              © {new Date().getFullYear()} Tienda Alli. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
