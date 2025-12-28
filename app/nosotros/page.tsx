import type { Metadata } from "next";
import { Package, Users, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce más sobre nosotros y nuestra historia en Tienda Alli",
  openGraph: {
    title: "Nosotros | Tienda Alli",
    description: "Descubre quiénes somos y nuestra pasión por ofrecerte los mejores productos",
    url: "https://tienda-alli.vercel.app/nosotros",
    siteName: "Tienda Alli",
    images: [
      {
        url: "/tienda-alli.webp",
        width: 1200,
        height: 630,
        alt: "Tienda Alli - Conoce nuestro equipo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros | Tienda Alli",
    description: "Descubre quiénes somos y nuestra pasión por ofrecerte los mejores productos",
    images: ["https://tienda-alli.vercel.app/tienda-alli.webp"],
  },
  alternates: {
    canonical: "https://tienda-alli.vercel.app/nosotros",
  },
  authors: [{ name: "Bruno ken", url: "https://brunoken.vercel.app/" }],
};

export default function Nosotros() {
  const values = [
    {
      icon: Package,
      title: "Variedad y Calidad",
      description:
        "Desde cartucheras con diseños innovadores hasta mochilas duraderas, cada producto en Tienda Alli refleja nuestro compromiso con la calidad. Seleccionamos cuidadosamente nuestros productos para asegurarnos de que cumplan con las necesidades y expectativas de nuestros clientes.",
    },
    {
      icon: Users,
      title: "Filosofía de Negocio",
      description:
        "En Tienda Alli, creemos en la accesibilidad, la innovación y el apoyo a la comunidad educativa. Nos esforzamos por brindar productos asequibles y relevantes, promoviendo así el éxito académico y el bienestar de los estudiantes.",
    },
    {
      icon: Award,
      title: "Nuestro Compromiso",
      description:
        "Con un equipo apasionado y enfocado en el cliente, trabajamos incansablemente para garantizar que cada experiencia de compra en Tienda Alli sea satisfactoria. Valoramos la retroalimentación y nos esforzamos por mejorar continuamente.",
    },
  ];

  return (
    <div className=' bg-gradient-to-b from-background to-muted/20'>
      <div className='container mx-auto px-4 py-10 max-w-6xl'>
        {/* Hero Section */}
        <div className='text-center mb-16 space-y-6'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4'>
            <Heart className='w-10 h-10 text-primary' />
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-balance'>
            Nuestra <span className='text-primary'>Historia</span>
          </h1>
          <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed'>
            En el corazón de <span className='font-semibold text-primary'>Tienda Alli</span>, nos
            dedicamos a ofrecer una amplia gama de cartucheras, mochilas y más. Nuestra historia
            está impulsada por la pasión de proporcionar a estudiantes y educadores las herramientas
            adecuadas para el éxito académico.
          </p>
        </div>

        {/* Values Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className='bg-primary text-secondary border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group'
              >
                <div className='inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors'>
                  <Icon className='w-7 h-7 text-secondary' />
                </div>
                <h3 className='text-xl font-bold mb-4 text-foreground'>{value.title}</h3>
                <p className='text-muted-foreground leading-relaxed text-pretty'>
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className='bg-card border border-border rounded-2xl p-8 md:p-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='space-y-2'>
              <div className='text-4xl md:text-5xl font-bold text-primary'>100+</div>
              <div className='text-sm md:text-base text-muted-foreground'>Productos</div>
            </div>
            <div className='space-y-2'>
              <div className='text-4xl md:text-5xl font-bold text-primary'>1000+</div>
              <div className='text-sm md:text-base text-muted-foreground'>Clientes Felices</div>
            </div>
            <div className='space-y-2'>
              <div className='text-4xl md:text-5xl font-bold text-primary'>5★</div>
              <div className='text-sm md:text-base text-muted-foreground'>Calificación</div>
            </div>
            <div className='space-y-2'>
              <div className='text-4xl md:text-5xl font-bold text-primary'>24/7</div>
              <div className='text-sm md:text-base text-muted-foreground'>Soporte</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
