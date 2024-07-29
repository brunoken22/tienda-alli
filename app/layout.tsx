import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {LayoutRecoilRoot} from '@/components/layout';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Tienda Alli',
  description: 'Útiles,mochilas,cartucheras y más',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='es'>
      <head>
        <link
          rel='preload'
          href='https://tienda-alli.vercel.app/api/product/featured'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='https://tienda-alli.vercel.app/api/product/frontPage'
          as='fetch'
          crossOrigin='anonymous'
        />
        <meta
          name='google-site-verification'
          content='CnmK8AWJQTO2MYQ5J7dOu9_dhCFy-ttErrYHDEWbOyw'
        />
      </head>
      <body className={inter.className}>
        <LayoutRecoilRoot>{children}</LayoutRecoilRoot>
      </body>
    </html>
  );
}
