interface Props {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryBar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-5 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
            selectedCategory === cat
              ? "bg-black text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}