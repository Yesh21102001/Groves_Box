import Home1 from "../src/components/Home/Home";
import {
  getProducts,
  getCollections,
  getNewArrivals,
  getProductsByCollection,
} from "../src/lib/shopify_utilis";
import { homeConfig } from "../src/config/home.config";

export default async function Home() {
  const {
    bestSellers,
    onSale,
    newArrivals: newArrivalsConfig,
    categories: categoriesConfig,
  } = homeConfig;

  const [bestSellersData, saleData, collectionsData, newArrivalsData] =
    await Promise.all([
      getProductsByCollection(bestSellers.collectionHandle, bestSellers.limit).then(
        (d) => (d.length > 0 ? d : getProducts(bestSellers.limit)),
      ),
      getProductsByCollection(onSale.collectionHandle, onSale.limit).then((d) =>
        d.length > 0 ? d : getProducts(onSale.limit),
      ),
      getCollections(20),
      getNewArrivals(newArrivalsConfig.limit).then((d) =>
        d && d.length > 0 ? d : getProducts(newArrivalsConfig.limit),
      ),
    ]);

  const trimmedCategories = (collectionsData || []).slice(
    0,
    categoriesConfig.limit,
  );
  const featuredCategory = trimmedCategories.length > 0 ? trimmedCategories[0] : null;
  const categoryProducts = featuredCategory
    ? await getProductsByCollection(featuredCategory.handle, 8)
    : [];

  return (
    <Home1
      initialData={{
        products: bestSellersData || [],
        saleProducts: saleData || [],
        categories: trimmedCategories,
        newArrivals: newArrivalsData || [],
        featuredCategory,
        categoryProducts,
        testimonials: homeConfig.testimonials.items,
        workshops: [],
      }}
    />
  );
}
