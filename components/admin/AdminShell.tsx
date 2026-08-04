import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const adminLinks = [
  {href: "/sl/admin", label: "Dashboard"},
  {href: "/sl/admin/inbox", label: "Inbox"},
  {href: "/sl/admin/clients", label: "Clients"},
  {href: "/sl/admin/companies", label: "Companies"},
  {href: "/sl/admin/properties", label: "Properties"},
  {href: "/sl/admin/services", label: "Services"},
  {href: "/sl/admin/offers", label: "Offers"},
  {href: "/sl/admin/calendar", label: "Calendar"},
  {href: "/sl/admin/employees", label: "Employees"},
  {href: "/sl/admin/gallery", label: "Gallery"},
  {href: "/sl/admin/content", label: "Content"},
  {href: "/sl/admin/settings", label: "Settings"}
];

export default function AdminShell({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#123b7a]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#dbe7fb] bg-white px-5 py-6">
          <a href="/sl/admin" className="mb-8 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="text-[#4d8dff]">✦</span>
            cleanix
          </a>

          <nav className="grid gap-1">
            {adminLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-[#123b7a] transition hover:bg-[#eaf2ff]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 grid gap-3">
            <a
              href="/"
              className="rounded-full border border-[#123b7a] px-4 py-3 text-center text-sm font-bold transition hover:bg-[#123b7a] hover:text-white"
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
