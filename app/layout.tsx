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
      <body className={inter.className}>
        <LayoutRecoilRoot>{children}</LayoutRecoilRoot>
      </body>
    </html>
  );
}
