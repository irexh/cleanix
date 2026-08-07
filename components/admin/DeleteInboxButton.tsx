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
  const [showConfirm, setShowConfirm] = useState(false);
  const [_isPending, startTransition] = useTransition();

  const handleDelete = async () => {
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
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="inline-flex justify-center rounded-full border border-red-600 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Brisanje..." : "Izbriši"}
      </button>

      {showConfirm ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-[#8b1d1d]">
          <p className="font-semibold">Ali ste prepričani, da želite izbrisati?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Da
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="rounded-full border border-[#7a7a7a] bg-white px-4 py-2 text-sm font-bold text-[#173e35] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ne
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
