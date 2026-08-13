"use client";

import {
  confirmBooking,
  completeBooking,
  cancelBooking,
  deleteBooking,
} from "@/app/[locale]/admin/actions";
import {Link} from "@/i18n/navigation";
import { useTransition } from "react";
import {useTranslations} from "next-intl";

type Props = {
  id: string;
};

export default function BookingActions({ id }: Props) {
  const t = useTranslations("admin.actions");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/bookings/${id}`}
        className="admin-blue-button px-3 py-2 text-sm"
      >
        {t("view")}
      </Link>

      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await confirmBooking(id);
          })
        }
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm"
      >
        {t("confirm")}
      </button>

      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await completeBooking(id);
          })
        }
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
      >
        {t("complete")}
      </button>

      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await cancelBooking(id);
          })
        }
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
      >
        {t("cancel")}
      </button>

      <button
        disabled={isPending}
        onClick={() => {
          if (!window.confirm(t("deleteConfirm"))) return;

          startTransition(async () => {
            await deleteBooking(id);
          });
        }}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
      >
        {t("delete")}
      </button>
    </div>
  );
}
