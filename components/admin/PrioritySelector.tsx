"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";

type PriorityValue = "LOW" | "NORMAL" | "HIGH";

const priorityLabels: Record<PriorityValue, string> = {
  LOW: "Nizka",
  NORMAL: "Normalna",
  HIGH: "Visoka"
};

const priorityStyles: Record<PriorityValue, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-red-100 text-red-800"
};

export default function PrioritySelector({
  currentPriority,
  endpoint,
  compact = false
}: {
  currentPriority: string;
  endpoint: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [priority, setPriority] = useState<PriorityValue>(
    normalizePriority(currentPriority)
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSave() {
    setError("");
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({priority})
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Prioritete ni bilo mogoče shraniti.");
      }

      setMessage("Shranjeno.");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Prišlo je do napake pri shranjevanju."
      );
    }
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <label className="block text-sm font-bold text-[#173e35]">
        Prioriteta
        <select
          value={priority}
          onChange={(event) => setPriority(normalizePriority(event.target.value))}
          className={`mt-2 w-full rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff] ${
            priorityStyles[priority]
          }`}
        >
          <option value="LOW">Nizka</option>
          <option value="NORMAL">Normalna</option>
          <option value="HIGH">Visoka</option>
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-full bg-[#2f6fe4] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#123b7a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Shrani prioriteto
        </button>
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {!compact ? (
        <p className="text-xs text-[#5d716a]">
          {priorityLabels[priority]} prioriteta pomaga označiti nujne termine in poslovne
          zahteve.
        </p>
      ) : null}
    </div>
  );
}

function normalizePriority(value: string): PriorityValue {
  if (value === "LOW" || value === "NORMAL" || value === "HIGH") {
    return value;
  }

  return "NORMAL";
}
