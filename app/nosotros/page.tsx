import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros | Tienda Alli',
  description: 'Conoce más sobre nosotros y nuestra historia en Tienda Alli',
  openGraph: {
    title: 'Nosotros | Tienda Alli',
    description: 'Descubre quiénes somos y nuestra pasión por ofrecerte los mejores productos',
    url: 'https://tienda-alli.vercel.app/nosotros',
    siteName: 'Tienda Alli',
    images: [
      {
        url: '/tienda-alli.webp',
        width: 1200,
        height: 630,
        alt: 'Tienda Alli - Conoce nuestro equipo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nosotros | Tienda Alli',
    description: 'Descubre quiénes somos y nuestra pasión por ofrecerte los mejores productos',
    images: ['https://tienda-alli.vercel.app/tienda-alli.webp'],
  },
  alternates: {
    canonical: 'https://tienda-alli.vercel.app/nosotros',
  },
  authors: [{ name: 'Bruno ken', url: 'https://brunoken.vercel.app/' }],
};

export default function Nosotros() {
  return (
    <div className='flex gap-4 flex-col p-4 max-w-[50vw] max-md:w-[100%] max-md:max-w-[none] m-auto mt-[8rem] max-md:mt-[8rem]'>
      <span>
        En el corazón de <strong className={`text-primary`}>Tienda Alli</strong>, nos dedicamos a
        ofrecer una amplia gama de cartucheras, mochilas y más. Nuestra historia está impulsada por
        la pasión de proporcionar a estudiantes y educadores las herramientas adecuadas para el
        éxito académico.
      </span>
      <br />
      <span>
        <strong className={`font-bold mt-8`}>Variedad y Calidad</strong>
        <br /> Desde cartucheras con diseños innovadores hasta mochilas duraderas, cada producto en{' '}
        <strong className={`text-primary`}>Tienda Alli</strong> refleja nuestro compromiso con la
        calidad. Seleccionamos cuidadosamente nuestros productos para asegurarnos de que cumplan con
        las necesidades y expectativas de nuestros clientes.
      </span>
      <br />
      <span>
        <strong className={`font-bold mt-8`}> Filosofía de Negocio</strong> <br /> En{' '}
        <strong className={`text-primary`}>Tienda Alli</strong>, creemos en la accesibilidad, la
        innovación y el apoyo a la comunidad educativa. Nos esforzamos por brindar productos
        asequibles y relevantes, promoviendo así el éxito académico y el bienestar de los
        estudiantes.
      </span>
      <br />
      <span>
        {' '}
        <strong className={`font-bold mt-8`}>Nuestro Compromiso </strong> <br />
        Con un equipo apasionado y enfocado en el cliente, trabajamos incansablemente para
        garantizar que cada experiencia de compra en{' '}
        <strong className={`text-primary`}>Tienda Alli</strong> sea satisfactoria. Valoramos la
        retroalimentación y nos esforzamos por mejorar continuamente.
      </span>
      <br />
    </div>
  );
}
