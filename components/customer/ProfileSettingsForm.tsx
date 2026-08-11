"use client";

import {useActionState} from "react";

import {
  updateProfileSettings,
  type ProfileSettingsState
} from "@/app/[locale]/profile/actions";

const initialState: ProfileSettingsState = {
  success: false,
  message: ""
};

type ProfileSettingsFormProps = {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
};

export default function ProfileSettingsForm({
  initialName,
  initialEmail,
  initialPhone
}: ProfileSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileSettings,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
          Ime in priimek
        </span>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialName}
          className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-sm font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
          E-pošta
        </span>
        <input
          type="email"
          name="email"
          required
          defaultValue={initialEmail}
          className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-sm font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5d716a]">
          Telefonska številka
        </span>
        <input
          type="text"
          name="phone"
          defaultValue={initialPhone}
          placeholder="069 665 229"
          className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-sm font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
        />
      </label>

      {state.message ? (
        <p
          className={`rounded-xl px-3 py-2 text-xs font-medium ${
            state.success
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-full bg-[#2f6fe4] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123b7a] disabled:opacity-50"
      >
        {isPending ? "Shranjujem ..." : "Shrani spremembe"}
      </button>
    </form>
  );
}
