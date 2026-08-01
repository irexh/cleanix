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
              disabled={isLoading || isCurrent}
              className={`rounded-full px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
            >
              {isCurrent ? `${action.label} ✓` : action.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}