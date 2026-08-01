type StepExtrasProps = {
  extras: string[];
  setExtras: (extras: string[]) => void;
  nextStep: () => void;
};

const availableExtras = [
  "Deep Cleaning",
  "Inside Oven",
  "Inside Fridge",
  "Windows",
  "Balcony",
  "Ironing",
];

export default function StepExtras({
  extras,
  setExtras,
  nextStep,
}: StepExtrasProps) {
  const toggleExtra = (extra: string) => {
    if (extras.includes(extra)) {
      setExtras(extras.filter((item) => item !== extra));
    } else {
      setExtras([...extras, extra]);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        Select extra services
      </h2>

      <div className="grid gap-4">
        {availableExtras.map((extra) => (
          <button
            key={extra}
            onClick={() => toggleExtra(extra)}
            className={`border rounded-xl p-5 text-left transition ${
              extras.includes(extra)
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-50"
            }`}
          >
            {extra}
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={nextStep}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl"
        >
          Continue
        </button>
      </div>
    </>
  );
}