"use client";

import type {FormEvent} from "react";

import {useMemo, useState, useTransition} from "react";

type EmailTemplate = {
  label: string;
  subject: string;
  text: string;
};

export default function SendCustomerEmailForm({
  to,
  replyTo,
  customerName,
  defaultSubject,
  templates
}: {
  to: string;
  replyTo?: string;
  customerName: string;
  defaultSubject: string;
  templates: EmailTemplate[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [text, setText] = useState(templates[0]?.text ?? "");
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates[0]?.label ?? ""
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const previewLines = useMemo(
    () => text.split("\n").filter(Boolean).slice(0, 3),
    [text]
  );

  function chooseTemplate(template: EmailTemplate) {
    setSelectedTemplate(template.label);
    setSubject(template.subject);
    setText(
      template.text.replaceAll("{customerName}", customerName).replaceAll("{to}", to)
    );
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to,
          replyTo,
          subject,
          text
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Email ni bilo mogoče poslati.");
      }

      startTransition(() => {
        setMessage("Email je bil poslan.");
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Prišlo je do napake pri pošiljanju emaila."
      );
    }
  }

  return (
    <div className="rounded-3xl border border-[#dbe7fb] bg-[#f8fbff] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#2f6fe4]">
            Pošlji email stranki
          </p>
          <p className="mt-1 text-sm text-[#5d716a]">
            Brez odpiranja pošte pošlji potrditev, prestavitev ali ponudbo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="admin-blue-button px-4 py-2 text-sm"
        >
          {isOpen ? "Zapri" : "Odpri"}
        </button>
      </div>

      {isOpen ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                key={template.label}
                type="button"
                onClick={() => chooseTemplate(template)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  selectedTemplate === template.label
                    ? "bg-[#123b7a] text-white"
                    : "bg-white text-[#123b7a] border border-[#dbe7fb] hover:bg-[#eef4ff]"
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>

          <label className="block text-sm font-bold text-[#173e35]">
            Zadeva
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
            />
          </label>

          <label className="block text-sm font-bold text-[#173e35]">
            Sporočilo
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={8}
              className="mt-2 w-full rounded-2xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
            />
          </label>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-[#5d716a]">
              {previewLines.length > 0 ? previewLines.join(" · ") : "Ni predogleda."}
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="admin-blue-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pošlji email
            </button>
          </div>

          {message ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
