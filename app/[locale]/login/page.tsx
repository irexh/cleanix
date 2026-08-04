"use client";

import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false
      });

      if (result?.error) {
        setError("Napačen e-poštni naslov ali geslo.");
        setIsLoading(false);
        return;
      }

      window.location.href = "/sl/admin";
    } catch (error) {
      console.error(error);
      setError("Prijava trenutno ni uspela. Poskusite znova.");
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ef] p-6 text-[#173e35]">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <a href="/" className="mb-10 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="text-[#ef856d]">✦</span>
          cleanix
        </a>

        <p className="mb-3 text-sm font-bold tracking-wider text-[#2b8c73]">
          ADMINISTRACIJA
        </p>
        <h1 className="text-3xl font-bold">Prijava</h1>
        <p className="mb-8 mt-3 text-sm leading-6 text-slate-500">
          Prijavite se za upravljanje rezervacij.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">E-poštni naslov</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-[#2b8c73]"
              placeholder="admin@cleanix.si"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">Geslo</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-[#2b8c73]"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#2b8c73] px-5 py-3 font-bold text-white transition hover:bg-[#1d6c58] disabled:opacity-50"
          >
            {isLoading ? "Prijavljanje ..." : "Prijava"}
          </button>
        </form>
      </section>
    </main>
  );
}
