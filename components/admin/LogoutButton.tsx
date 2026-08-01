"use client";

import { signOut } from "next-auth/react";
import {useLocale, useTranslations} from "next-intl";

export default function LogoutButton() {
  const t = useTranslations("admin.actions");
  const locale = useLocale();
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: locale === "en" ? "/en/login" : "/login",
        })
      }
      className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
    >
      {t("logout")}
    </button>
  );
}
