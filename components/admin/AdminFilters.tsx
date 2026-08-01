"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState, useTransition} from "react";

export default function AdminFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "ALL");

  function updateFilters(nextSearch: string, nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSearch.trim()) {
      params.set("q", nextSearch.trim());
    } else {
      params.delete("q");
    }

    if (nextStatus !== "ALL") {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  }

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-end">
      <div className="flex-1">
        <label className="mb-2 block text-sm font-bold text-[#173e35]">
          Išči rezervacijo
        </label>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ime, e-pošta ali mesto"
          className="w-full rounded-2xl border border-[#d7d2c8] bg-white px-4 py-3 outline-none transition focus:border-[#2b8c73]"
        />
      </div>

      <div className="w-full md:w-64">
        <label className="mb-2 block text-sm font-bold text-[#173e35]">
          Status
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full rounded-2xl border border-[#d7d2c8] bg-white px-4 py-3 outline-none transition focus:border-[#2b8c73]"
        >
          <option value="ALL">Vsi statusi</option>
          <option value="PENDING">Čaka na potrditev</option>
          <option value="CONFIRMED">Potrjeno</option>
          <option value="IN_PROGRESS">V teku</option>
          <option value="COMPLETED">Zaključeno</option>
          <option value="CANCELLED">Preklicano</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => updateFilters(search, status)}
          disabled={isPending}
          className="rounded-full bg-[#173e35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f2b25] disabled:opacity-60"
        >
          Filtriraj
        </button>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatus("ALL");
            startTransition(() => {
              router.push("/admin");
            });
          }}
          disabled={isPending}
          className="rounded-full border border-[#173e35] px-5 py-3 text-sm font-bold text-[#173e35] transition hover:bg-[#173e35] hover:text-white disabled:opacity-60"
        >
          Počisti
        </button>
      </div>
    </div>
  );
}