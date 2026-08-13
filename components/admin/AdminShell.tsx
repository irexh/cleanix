import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const adminLinks = [
  {href: "/sl/admin", label: "Nadzorna plošča"},
  {href: "/sl/admin/inbox", label: "Prejeta sporočila"},
  {href: "/sl/admin/clients", label: "Stranke"},
  {href: "/sl/admin/companies", label: "Podjetja"},
  {href: "/sl/admin/properties", label: "Nepremičnine"},
  {href: "/sl/admin/services", label: "Storitve"},
  {href: "/sl/admin/offers", label: "Ponudbe"},
  {href: "/sl/admin/calendar", label: "Koledar"},
  {href: "/sl/admin/employees", label: "Zaposleni"},
  {href: "/sl/admin/gallery", label: "Galerija"},
  {href: "/sl/admin/content", label: "Vsebina"},
  {href: "/sl/admin/analytics", label: "Analitika"},
  {href: "/sl/admin/settings", label: "Nastavitve"}
];

export default function AdminShell({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#123b7a]">
      <div className="grid min-h-screen lg:grid-cols-[220px_1fr]">
        <aside className="border-r border-[#dbe7fb] bg-white px-4 py-5">
          <a href="/sl/admin" className="mb-5 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="text-[#4d8dff]">✦</span>
            cleanix
          </a>

          <nav className="grid gap-0.5">
            {adminLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-[13px] font-bold leading-[1.15] text-[#123b7a] transition hover:bg-[#eaf2ff]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-5 grid gap-2">
            <a
              href="/"
              className="rounded-full border border-[#123b7a] px-4 py-2.5 text-center text-[13px] font-bold transition hover:bg-[#123b7a] hover:text-white"
            >
              Nazaj na spletno stran
            </a>
            <AdminLogoutButton />
          </div>
        </aside>

        <div className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
