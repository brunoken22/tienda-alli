export async function getPriceFilter() {
  const priceDefault = {
    maxPrice: 100000,
    minPrice: 0,
    maxPriceOffer: 100000,
    minPriceOffer: 0,
  };
  try {
    const response = await fetch(`/api/admin/price-filter`);
    const data = await response.json();
    return data?.data || priceDefault;
  } catch (e) {
    console.error("Este es el error del getCategories: ", e);
    return priceDefault;
  }
}
