"use client";

import Link from "next/link";
import {FormEvent, useEffect, useState} from "react";
import {getSession, signIn} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setSuccessMessage("Račun je ustvarjen. Zdaj se lahko prijaviš.");
    }
  }, [searchParams]);

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
        setError("Napacen e-postni naslov ali geslo.");
        setIsLoading(false);
        return;
      }

      const session = await getSession();
      const role =
        (
          session?.user as
            | (NonNullable<typeof session>["user"] & {role?: string})
            | undefined
        )?.role ?? "CUSTOMER";

      if (role === "ADMIN") {
        router.replace("/sl/admin");
      } else if (role === "EMPLOYEE" || role === "MANAGER") {
        router.replace("/sl/employee");
      } else {
        router.replace("/sl/profile");
      }

      router.refresh();
    } catch (submissionError) {
      console.error(submissionError);
      setError("Prijava trenutno ni uspela. Poskusite znova.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#e8f1ff_42%,#f8fbff_100%)] px-6 py-8 text-[#123b7a]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <section className="mx-auto w-full max-w-md rounded-[36px] border border-[#dbe7fb] bg-white p-8 shadow-[0_30px_80px_rgba(47,111,228,0.10)] sm:p-10">
          <a
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#123b7a]"
          >
            <span className="text-[#4d8dff]">✦</span>
            cleanix
          </a>

          <p className="mb-1 text-sm font-bold uppercase tracking-[0.22em] text-[#2f6fe4]">
            Prijava
          </p>
          <h1 className="text-1xl font-bold tracking-tight text-[#123b7a]">
            Dobrodošli
          </h1>
          <p className="mb-1 mt-4 text-sm text-[#5d716a]">
            Vpisite svoj email in geslo za dostop do sistema.
          </p>

          {successMessage ? (
            <p className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {successMessage}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-[#123b7a]">
                E-postni naslov
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[#dbe7fb] bg-[#f8fbff] px-4 py-4 outline-none transition focus:border-[#4d8dff] focus:bg-white"
                placeholder="ime@cleanix.si"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#123b7a]">
                Geslo
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#dbe7fb] bg-[#f8fbff] px-4 py-4 outline-none transition focus:border-[#4d8dff] focus:bg-white"
                placeholder="••••••••"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#2f6fe4] px-5 py-3.5 font-bold text-white transition hover:bg-[#123b7a] disabled:opacity-50"
            >
              {isLoading ? "Prijavljanje ..." : "Prijava"}
            </button>

            <p className="text-center text-sm text-[#5d716a]">
              Če nimaš računa,{" "}
              <Link href="/sl/register" className="font-bold text-[#2f6fe4]">
                registriraj se
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
