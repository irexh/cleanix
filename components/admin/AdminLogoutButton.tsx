"use client";

import {signOut} from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({callbackUrl: "/sl/login"})}
      className="rounded-full bg-[#173e35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f2b25]"
    >
      Odjava
    </button>
  );
}
