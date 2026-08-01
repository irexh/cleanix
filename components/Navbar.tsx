"use client";

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between p-6">
      <h1
        onClick={() => scrollTo("booking")}
        className="text-3xl font-bold text-blue-600 cursor-pointer"
      >
        Cleanix
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => scrollTo("services")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Services
        </button>

        <button
          onClick={() => scrollTo("booking")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Prices
        </button>

        <button
          onClick={() => scrollTo("contact")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Contact
        </button>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Login
        </button>
      </div>
    </nav>
  );
}