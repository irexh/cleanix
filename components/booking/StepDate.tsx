type StepDateProps = {
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedTime: string;
  setSelectedTime: (value: string) => void;
  nextStep: () => void;
};

const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function StepDate({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  nextStep,
}: StepDateProps) {
  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        Choose date & time
      </h2>

      <div className="space-y-8">

        <div>
          <label className="block mb-2 font-semibold">
            Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div>
          <label className="block mb-3 font-semibold">
            Time
          </label>

          <div className="grid grid-cols-5 gap-3">

            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-xl border p-3 transition ${
                  selectedTime === time
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50"
                }`}
              >
                {time}
              </button>
            ))}

          </div>
        </div>

        <div className="flex justify-end">

          <button
            disabled={!selectedDate || !selectedTime}
            onClick={nextStep}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl disabled:opacity-40"
          >
            Continue
          </button>

        </div>

      </div>
    </>
  );
}