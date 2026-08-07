"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const actions: Array<{
  label: string;
  status: BookingStatus;
  className: string;
}> = [
  {
    label: "Potrdi",
    status: "CONFIRMED",
    className: "bg-blue-600 text-white hover:bg-blue-700"
  },
  {
    label: "V teku",
    status: "IN_PROGRESS",
    className: "bg-amber-500 text-white hover:bg-amber-600"
  },
  {
    label: "Zaključeno",
    status: "COMPLETED",
    className: "bg-emerald-600 text-white hover:bg-emerald-700"
  },
  {
    label: "Prekliči",
    status: "CANCELLED",
    className: "bg-red-600 text-white hover:bg-red-700"
  }
];

export default function AdminBookingActions({
  bookingId,
  currentStatus
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function updateStatus(status: BookingStatus) {
    setError("");
    setPendingStatus(status);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({status})
      });

      if (!response.ok) {
        throw new Error("Statusa ni bilo mogoče posodobiti.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Posodobitev ni uspela. Poskusite znova.");
    } finally {
      setPendingStatus("");
    }
  }

  async function deleteBooking() {
    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Brisanje ni uspelo.");
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
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const isCurrent = currentStatus === action.status;
          const isLoading = isPending || pendingStatus === action.status;

          return (
            <button
              key={action.status}
              type="button"
              onClick={() => updateStatus(action.status)}
              disabled={isLoading || isCurrent || isDeleting}
              className={`rounded-full px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
            >
              {isCurrent ? `${action.label} ✓` : action.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting || isPending}
          className="rounded-full px-3 py-2 text-xs font-bold text-red-600 border border-red-600 bg-white transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Izbriši
        </button>
      </div>

      {showConfirm ? (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-[#8b1d1d]">
          <p className="font-semibold">Ali ste prepričani, da želite izbrisati?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={deleteBooking}
              disabled={isDeleting}
              className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Da
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="rounded-full border border-[#7a7a7a] bg-white px-3 py-2 text-xs font-bold text-[#173e35] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ne
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}