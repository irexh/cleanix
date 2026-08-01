type StepCityProps = {
  city: string;
  setCity: (value: string) => void;
  nextStep: () => void;
};

export default function StepCity({
  city,
  setCity,
  nextStep,
}: StepCityProps) {
  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        Where do you need cleaning?
      </h2>

      <select
        className="w-full border rounded-xl p-4 text-lg"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          nextStep();
        }}
      >
        <option value="">Choose city...</option>
        <option>Ljubljana</option>
        <option>Maribor</option>
        <option>Celje</option>
        <option>Kranj</option>
      </select>
    </>
  );
}