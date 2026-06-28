interface Props {
  product: any;
  onClose: () => void;
}

export default function ProductModal({
  product,
  onClose,
}: Props) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-[90%] max-w-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-100 rounded-2xl p-6 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="h-64 object-contain"
            />
          </div>

          <div>
            <h2 className="text-3xl font-black mb-3">
              {product.name}
            </h2>

            <p className="text-green-600 text-2xl font-black mb-4">
              ₹{product.price}
            </p>

            <div className="flex gap-3 mb-5">
              {["500ml", "1L", "2L"].map((q) => (
                <button
                  key={q}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>Manufactured:</strong> 12 May 2026</p>
              <p><strong>Expiry:</strong> 18 May 2026</p>
              <p><strong>Aisle:</strong> A3</p>
              <p><strong>Rack:</strong> Blue Rack</p>
              <p><strong>Stock:</strong> Available</p>
            </div>

            <button className="mt-8 w-full bg-green-600 text-white py-4 rounded-2xl font-bold">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}