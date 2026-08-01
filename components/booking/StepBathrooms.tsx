type StepBathroomsProps = {
  bathrooms: number;
  setBathrooms: (value: number) => void;
  nextStep: () => void;
};

export default function StepBathrooms({
  bathrooms,
  setBathrooms,
  nextStep,
}: StepBathroomsProps) {
  const items = [1, 2, 3, 4];

  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        How many bathrooms?
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => {
              setBathrooms(item);
              nextStep();
            }}
            className={`border rounded-xl p-6 transition ${
              bathrooms === item
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-50"
            }`}
          >
            {item} Bathroom{item > 1 ? "s" : ""}
          </button>
        ))}
      </div>
    </>
  );
}