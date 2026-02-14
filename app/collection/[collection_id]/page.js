import { Collection } from "@/Models/Collection";
import ProductAddCard from "@/app/components/CollecProdAddCard";

const page = async ({ params }) => {
  const { collection_id } =await params;

  const collection = await Collection.findById(collection_id).populate(
    "products"
  );
  const products = collection.products;
  
  return (
    <>
    <ProductAddCard products={JSON.stringify(products)} title={collection.name}/>
    </>
  );
};

export default page;
