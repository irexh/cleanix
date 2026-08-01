"use client";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
      <h2 className="text-6xl font-extrabold text-gray-900 leading-tight">
        Professional
        <br />
        Home Cleaning
      </h2>

      <p className="mt-8 text-xl text-gray-600 max-w-2xl">
        Book trusted cleaners online in less than one minute.
        Fast, secure and professional.
      </p>

      <div className="mt-12 flex gap-6">
        <button
          onClick={() => scrollTo("booking")}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Book Cleaning
        </button>

        <button
          onClick={() => scrollTo("services")}
          className="border border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition"
        >
          Learn More
        </button>
      </div>
    </section>
  );
}