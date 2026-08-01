type StepPropertySizeProps = {
  propertySize: string;
  setPropertySize: (value: string) => void;
  nextStep: () => void;
};

export default function StepPropertySize({
  propertySize,
  setPropertySize,
  nextStep,
}: StepPropertySizeProps) {
  const sizes = [
    "Up to 40 m²",
    "41 - 60 m²",
    "61 - 80 m²",
    "81 - 100 m²",
    "101 - 150 m²",
    "150+ m²",
  ];

  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        What is the size of your property?
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => {
              setPropertySize(size);
              nextStep();
            }}
            className={`border rounded-xl p-6 transition ${
              propertySize === size
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-50"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </>
  );
}