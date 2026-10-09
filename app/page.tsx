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
    onSale,
  } = homeConfig;

  const [saleData, collectionsData, newArrivalsData] =
    await Promise.all([
      getProductsByCollection(onSale.collectionHandle, onSale.limit).then((d) =>
        d.length > 0 ? d : getProducts(onSale.limit),
      ),
      getCollections(250),
      getProductsByCollection("new-arrivals", 5).then((collectionProducts) =>
        collectionProducts.length > 0
          ? collectionProducts
          : getNewArrivals(5),
      ),
    ]);

  const allCategories = (collectionsData || []).filter(
    (collection: { handle: string }) => collection.handle !== "frontpage",
  );
  const featuredCategory = allCategories.length > 0 ? allCategories[0] : null;
  const categoryProducts = featuredCategory
    ? await getProductsByCollection(featuredCategory.handle, 8)
    : [];

  return (
    <Home1
      initialData={{
        products: newArrivalsData || [],
        saleProducts: saleData || [],
        categories: allCategories,
        newArrivals: newArrivalsData || [],
        featuredCategory,
        categoryProducts,
        testimonials: homeConfig.testimonials.items,
        workshops: [],
      }}
    />
  );
}
