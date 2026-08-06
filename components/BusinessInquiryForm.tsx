"use client";

import {FormEvent, useState} from "react";

export default function BusinessInquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/business-inquiry", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({fullName, email, phone, message})
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(result.error ?? "Povpraševanja trenutno ni mogoče poslati.");
      setIsLoading(false);
      return;
    }

    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSuccess("Hvala. Povpraševanje smo prejeli in vas kmalu kontaktiramo.");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-[#123b7a]">
          Ime in priimek
        </span>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-2xl border border-[#cfe0ff] bg-white px-5 py-4 text-[#123b7a] outline-none transition focus:border-[#2f6fe4]"
          placeholder="Vaše ime in priimek"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#123b7a]">
            E-poštni naslov
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-[#cfe0ff] bg-white px-5 py-4 text-[#123b7a] outline-none transition focus:border-[#2f6fe4]"
            placeholder="ime@podjetje.si"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#123b7a]">
            Mobilna številka
          </span>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-2xl border border-[#cfe0ff] bg-white px-5 py-4 text-[#123b7a] outline-none transition focus:border-[#2f6fe4]"
            placeholder="040 000 000"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-[#123b7a]">
          Sporočilo
        </span>
        <textarea
          required
          maxLength={500}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-36 w-full resize-y rounded-2xl border border-[#cfe0ff] bg-white px-5 py-4 text-[#123b7a] outline-none transition focus:border-[#2f6fe4]"
          placeholder="Na kratko opišite prostor, željeni termin ali posebne želje."
        />
        <span className="mt-2 block text-right text-xs font-bold text-[#5d716a]">
          {message.length}/500
        </span>
      </label>

      {error ? (
        <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-[#2f6fe4] px-7 py-4 font-extrabold text-white transition hover:bg-[#215ac0] disabled:opacity-60"
      >
        {isLoading ? "Pošiljanje ..." : "Pošlji povpraševanje"}
      </button>
    </form>
  );
}
