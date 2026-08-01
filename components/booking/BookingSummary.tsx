type BookingSummaryProps = {
  city: string;
  propertyType: string;
  propertySize: string;
  bathrooms: number;
  extras: string[];
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
};

export default function BookingSummary({
  city,
  propertyType,
  propertySize,
  bathrooms,
  extras,
  selectedDate,
  selectedTime,
  totalPrice,
}: BookingSummaryProps) {
  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 border">

        <h2 className="text-2xl font-bold mb-6">
          Booking Summary
        </h2>

        <div className="space-y-4 text-gray-700">

          {city && (
            <div className="flex justify-between">
              <span>City</span>
              <span>{city}</span>
            </div>
          )}

          {propertyType && (
            <div className="flex justify-between">
              <span>Property</span>
              <span>{propertyType}</span>
            </div>
          )}

          {propertySize && (
            <div className="flex justify-between">
              <span>Size</span>
              <span>{propertySize}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Bathrooms</span>
            <span>{bathrooms}</span>
          </div>

          {selectedDate && (
            <div className="flex justify-between">
              <span>Date</span>
              <span>{selectedDate}</span>
            </div>
          )}

          {selectedTime && (
            <div className="flex justify-between">
              <span>Time</span>
              <span>{selectedTime}</span>
            </div>
          )}

          {extras.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Extras</p>

              <ul className="space-y-1">
                {extras.map((extra) => (
                  <li key={extra}>✓ {extra}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        <hr className="my-8" />

        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">
            Total
          </span>

          <span className="text-3xl font-bold text-blue-600">
            €{totalPrice}
          </span>
        </div>

      </div>
    </div>
  );
}