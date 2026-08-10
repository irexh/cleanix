"use client";

import Link from "next/link";
import {useActionState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {registerCustomerAction} from "./actions";

const initialState = {error: ""};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, action, isPending] = useActionState(
    registerCustomerAction,
    initialState
  );

  if (searchParams.get("registered") === "1") {
    router.replace("/sl/login");
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-3 py-3 text-[#123b7a] sm:px-4 sm:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[420px] items-start justify-center pt-3">
        <section className="w-full rounded-[22px] border border-[#dbe7fb] bg-white p-5 shadow-[0_12px_30px_rgba(47,111,228,0.08)] sm:p-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-lg font-extrabold text-[#123b7a]"
          >
            <span className="text-[#4d8dff]">✦</span>
            cleanix
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f6fe4]">
            Registracija
          </p>
          <h1 className="mt-0 text-xs font-bold leading-tight text-[#123b7a]">
            
          </h1>

          <form action={action} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-[#123b7a]">
                Ime in priimek
              </span>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 outline-none focus:border-[#4d8dff] focus:bg-white"
                placeholder="Ana Novak"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold text-[#123b7a]">
                E-poštni naslov
              </span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 outline-none focus:border-[#4d8dff] focus:bg-white"
                placeholder="ime@cleanix.si"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold text-[#123b7a]">
                Geslo
              </span>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 outline-none focus:border-[#4d8dff] focus:bg-white"
                placeholder="Vsaj 6 znakov"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold text-[#123b7a]">
                Ponovi geslo
              </span>
              <input
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 outline-none focus:border-[#4d8dff] focus:bg-white"
                placeholder="Ponovi geslo"
              />
            </label>

            {state.error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[#2f6fe4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#123b7a] disabled:opacity-50"
            >
              {isPending ? "Registracija ..." : "Registriraj se"}
            </button>

            <p className="text-center text-xs text-[#5d716a]">
              Že imaš račun?{" "}
              <Link href="/sl/login" className="font-bold text-[#2f6fe4]">
                Prijava
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
