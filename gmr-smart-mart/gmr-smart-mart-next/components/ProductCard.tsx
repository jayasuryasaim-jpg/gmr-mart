interface Product {
  name: string;
  price: number;
  image: string;
  offer: string;
}

interface Props {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({
  product,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
    >
      <div className="h-52 bg-slate-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 object-contain"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">
            {product.name}
          </h3>

          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
            {product.offer}
          </span>
        </div>

        <p className="text-green-600 font-black text-xl">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
}