"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";

type DeleteInboxButtonProps = {
  id: string;
  type: "booking" | "business-inquiry";
};

const routeMap = {
  booking: "bookings",
  "business-inquiry": "business-inquiries"
} as const;

export default function DeleteInboxButton({id, type}: DeleteInboxButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [_isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!window.confirm("Ali ste prepričani, da želite izbrisati?")) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/${routeMap[type]}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Brisanje ni uspelo.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Prišlo je do napake pri brisanju."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex justify-center rounded-full border border-red-600 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Brisanje..." : "Izbriši"}
      </button>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
