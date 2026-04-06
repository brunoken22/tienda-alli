import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className='bg-primary text-secondary  border-t mt-auto'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-2 group'>
              <Image
                src='/logo.webp'
                alt='GabiiAlli'
                title='GabiiAlli'
                width={100}
                height={100}
                className='hover:opacity-60'
              />
            </Link>
            <p className='text-sm  leading-relaxed'>
              Tu tienda online de confianza con los mejores productos y la mejor atención al
              cliente.
            </p>
            <div className='flex gap-3'>
              <Link
                href='https://www.facebook.com/profile.php?id=61578429236119'
                target='_blank'
                className='w-9 h-9 rounded-full bg-muted bg-secondary/20 hover:bg-secondary/80 hover:text-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='w-4 h-4' />
              </Link>
              <Link
                href='https://www.instagram.com/brunoken18/'
                target='_blank'
                className='w-9 h-9 rounded-full bg-muted bg-secondary/20 hover:bg-secondary/80 hover:text-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='w-4 h-4' />
              </Link>
              {/* <Link
                href='https://www.linkedin.com/in/brunoken18/'
                target='_blank'
                className='w-9 h-9 rounded-full bg-muted bg-secondary/20 hover:bg-secondary/80 hover:text-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Instagram'
              >
                <Linkedin className='w-4 h-4' />
              </Link> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Enlaces Rápidos</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/productos' className=' hover:opacity-70 transition-colors'>
                  Productos
                </Link>
              </li>
              <li>
                <Link href='/' className=' hover:opacity-70 transition-colors'>
                  Categorías
                </Link>
              </li>
              <li>
                <Link href='/' className=' hover:opacity-70 transition-colors'>
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href='/' className=' hover:opacity-70 transition-colors'>
                  Novedades
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Contacto</h4>
            <ul className='space-y-3 text-sm'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-4 h-4 mt-1  flex-shrink-0' />
                <span className=''>
                  Buenos Aires, Argentina,
                  {/* <br />
                  Ciudad, País 12345 */}
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='w-4 h-4  flex-shrink-0' />
                <Link href='tel:+54111159102865' className=' hover:opacity-70 transition-colors'>
                  +54 (11) 5910-2865
                </Link>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-4 h-4  flex-shrink-0' />
                <Link
                  href='mailto:bruno_am_22@hotmail.com'
                  className=' hover:opacity-70 transition-colors'
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
            <p className='text-sm  text-center md:text-left'>
              © {new Date().getFullYear()} Gabii Alli. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
