import connectToDatabase from "@/lib/dbConnect";
import { Product } from "@/Models/Product";
import ProductDetails from "@/app/components/ProductDetails";
import LatestProducts from "@/app/components/LatestProducts";
import ProductTabs from "@/app/components/Tabs";
import Rating from "@/app/components/Rating";

export default async function Page({ params }) {
  const { slug } = await params;

  await connectToDatabase();
  const product = await Product.findById(slug).lean();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ProductDetails product={JSON.stringify(product)} />
        <ProductTabs description={product.description} reviews={""}/>
        {/* Latest products */}
        <LatestProducts />
        <Rating item={JSON.stringify(product)}/>
      </div>
    </>
  );
}