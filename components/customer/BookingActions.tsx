"use client";

import {useActionState} from "react";

import {
  cancelCustomerBookingAction,
  rescheduleCustomerBookingAction,
  type ProfileSettingsState
} from "@/app/[locale]/profile/actions";

type BookingActionsProps = {
  bookingId: string;
  selectedDate: string;
  selectedTime: string;
  bookingStatus: string;
};

type ActionState = ProfileSettingsState;

const initialState: ActionState = {
  success: false,
  message: ""
};

const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
];

function bookingDateTime(selectedDate: string, selectedTime: string) {
  return new Date(`${selectedDate}T${selectedTime}:00`);
}

function isWithin24Hours(selectedDate: string, selectedTime: string) {
  const diffMs = bookingDateTime(selectedDate, selectedTime).getTime() - Date.now();

  return diffMs < 1000 * 60 * 60 * 24;
}

export default function BookingActions({
  bookingId,
  selectedDate,
  selectedTime,
  bookingStatus
}: BookingActionsProps) {
  const [cancelState, cancelAction, cancelPending] = useActionState(
    cancelCustomerBookingAction,
    initialState
  );
  const [rescheduleState, rescheduleAction, reschedulePending] = useActionState(
    rescheduleCustomerBookingAction,
    initialState
  );

  const locked = bookingStatus === "CANCELLED" || bookingStatus === "COMPLETED";
  const deadlineReached = isWithin24Hours(selectedDate, selectedTime);

  if (locked) {
    return (
      <div className="rounded-xl border border-[#dbe7fb] bg-white px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
          Upravljanje
        </p>
        <p className="mt-1 text-xs text-[#5d716a]">Termin je zaklenjen.</p>
      </div>
    );
  }

  return (
    <details className="rounded-xl border border-[#dbe7fb] bg-white px-3 py-2">
      <summary className="cursor-pointer list-none text-[10px] font-bold uppercase tracking-[0.14em] text-[#2f6fe4]">
        Upravljanje
      </summary>

      <div className="mt-3 grid gap-3">
        {deadlineReached ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            Sprememba ali preklic sta po pravilih mogoča le več kot 24 ur pred
            terminom.
          </p>
        ) : null}

        {!deadlineReached ? (
          <>
            <form action={cancelAction} className="grid gap-2">
              <input type="hidden" name="bookingId" value={bookingId} />

              <label className="grid gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
                  Razlog preklica
                </span>
                <textarea
                  name="reason"
                  required
                  maxLength={500}
                  rows={2}
                  placeholder="Na kratko napišite razlog"
                  className="rounded-lg border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-xs font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
                />
              </label>

              {cancelState.message ? (
                <p
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    cancelState.success
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {cancelState.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={cancelPending}
                className="w-fit rounded-full bg-[#ef4444] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {cancelPending ? "Preklicujem ..." : "Prekliči termin"}
              </button>
            </form>

            <form action={rescheduleAction} className="grid gap-2 border-t border-[#ece7dc] pt-3">
              <input type="hidden" name="bookingId" value={bookingId} />

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
                    Nov datum
                  </span>
                  <input
                    type="date"
                    name="newDate"
                    required
                    className="rounded-lg border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-xs font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
                    Nova ura
                  </span>
                  <select
                    name="newTime"
                    required
                    defaultValue=""
                    className="rounded-lg border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-xs font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
                  >
                    <option value="" disabled>
                      Izberi uro
                    </option>
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
                  Razlog spremembe
                </span>
                <textarea
                  name="reason"
                  required
                  maxLength={500}
                  rows={2}
                  placeholder="Na kratko opišite novo željo"
                  className="rounded-lg border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-xs font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
                />
              </label>

              {rescheduleState.message ? (
                <p
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    rescheduleState.success
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {rescheduleState.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={reschedulePending}
                className="w-fit rounded-full bg-[#2f6fe4] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123b7a] disabled:opacity-50"
              >
                {reschedulePending ? "Shranjujem ..." : "Pošlji spremembo"}
              </button>
            </form>
          </>
        ) : null}
      </div>
    </details>
  );
}
