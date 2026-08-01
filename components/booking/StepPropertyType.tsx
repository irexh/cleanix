type StepPropertyTypeProps = {
  propertyType: string;
  setPropertyType: (value: string) => void;
  nextStep: () => void;
};

export default function StepPropertyType({
  propertyType,
  setPropertyType,
  nextStep,
}: StepPropertyTypeProps) {
  const types = [
    "Apartment",
    "House",
    "Office",
    "Airbnb",
  ];

  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        What type of property?
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => {
              setPropertyType(type);
              nextStep();
            }}
            className={`border rounded-xl p-6 transition ${
              propertyType === type
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </>
  );
}