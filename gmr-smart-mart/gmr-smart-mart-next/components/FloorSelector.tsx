interface Props {
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
}

export default function FloorSelector({
  selectedFloor,
  setSelectedFloor,
}: Props) {
  const floors = [
    "Ground Floor",
    "First Floor",
    "Second Floor",
  ];

  return (
    <div className="flex gap-4 flex-wrap mb-8">
      {floors.map((floor) => (
        <button
          key={floor}
          onClick={() => setSelectedFloor(floor)}
          className={`px-6 py-3 rounded-2xl font-bold transition-all ${
            selectedFloor === floor
              ? "bg-green-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {floor}
        </button>
      ))}
    </div>
  );
}