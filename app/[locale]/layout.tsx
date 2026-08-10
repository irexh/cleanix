import type {Metadata} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {ReactNode} from "react";

import "../globals.css";
import {routing} from "@/i18n/routing";


export const metadata: Metadata = {
  title: "Cleanix",
  icons: {
    icon: "/images/cisto-logo-transparent.png?v=2",
    shortcut: "/images/cisto-logo-transparent.png?v=2",
    apple: "/apple-icon.png?v=2"
  },
  description: "Profesionalno čiščenje doma po vaši meri"
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
