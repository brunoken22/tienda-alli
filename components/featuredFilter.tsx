import TemplateFeaturedFilter from "./templateFeaturedFilter"

const featuredFilter = [
  {
    id: 1,
    name: "Mujer",
    img: "/mujer.webp",
    url: '/productos?price=%5B0%2C70000%5D&type=%5B"camperas_mujer"%2C"camperas_niños"%5D&limit=15&offset=0',
  },
  {
    id: 2,
    name: "Hombres",
    img: "/hombre.webp",
    url: '/productos?price=%5B0%2C70000%5D&type=%5B"camperas_mujer"%2C"camperas_niños"%5D&limit=15&offset=0',
  },
  {
    id: 3,
    name: "Mochilas",
    img: "/mochilas.webp",
    url: '/productos?price=%5B0%2C70000%5D&type=%5B"mochilas"%5D&limit=15&offset=0',
  },
  {
    id: 4,
    name: "Billeteras/Carteras",
    img: "/billeteras.webp",
    url: '/productos?price=%5B0%2C70000%5D&type=%5B"billeteras"%2C"riñoneras"%2C"carteras"%5D&limit=15&offset=0',
  },
]

export default function FeaturedFilter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {featuredFilter.map((item) => (
        <TemplateFeaturedFilter name={item.name} img={item.img} url={item.url} key={item.id} />
      ))}
    </div>
  )
}
