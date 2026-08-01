type StepContactProps = {
  fullName: string;
  setFullName: (value: string) => void;

  email: string;
  setEmail: (value: string) => void;

  phone: string;
  setPhone: (value: string) => void;

  address: string;
  setAddress: (value: string) => void;

  notes: string;
  setNotes: (value: string) => void;

  nextStep: () => void;
};

export default function StepContact({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  notes,
  setNotes,
  nextStep,
}: StepContactProps) {
  const isValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    address.trim() !== "";

  return (
    <>
      <h2 className="text-4xl font-bold mb-8">
        Your Details
      </h2>

      <div className="space-y-6">

        <div>
          <label className="block mb-2 font-semibold">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@email.com"
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+386..."
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Service Address
          </label>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, City"
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Additional Notes
          </label>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything our cleaners should know?"
            className="w-full border rounded-xl p-4 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            disabled={!isValid}
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