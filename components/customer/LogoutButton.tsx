"use client";

import {useState, useTransition} from "react";
import {signOut} from "next-auth/react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    startTransition(() => {
      signOut({callbackUrl: "/sl/login"});
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading || isPending}
      className="rounded-full border border-[#123b7a] px-5 py-2.5 text-sm font-extrabold text-[#123b7a] transition hover:bg-[#123b7a] hover:text-white disabled:opacity-50"
    >
      {isLoading || isPending ? "Odjava ..." : "Odjava"}
    </button>
  );
}
