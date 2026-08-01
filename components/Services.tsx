export default function Services() {
  return (
    <section className="max-w-7xl mx-auto py-24 px-6">

      <h2 className="text-4xl font-bold text-center mb-16">
        Why Choose Cleanix?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-5xl mb-4">🧹</div>

          <h3 className="text-2xl font-semibold mb-3">
            Professional Cleaning
          </h3>

          <p className="text-gray-600">
            Our experienced cleaners leave every home spotless.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-5xl mb-4">⏰</div>

          <h3 className="text-2xl font-semibold mb-3">
            Always On Time
          </h3>

          <p className="text-gray-600">
            Book online and our team arrives exactly when expected.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-5xl mb-4">⭐</div>

          <h3 className="text-2xl font-semibold mb-3">
            Trusted Service
          </h3>

          <p className="text-gray-600">
            Thousands of satisfied customers trust Cleanix every day.
          </p>
        </div>

      </div>

    </section>
  );
}