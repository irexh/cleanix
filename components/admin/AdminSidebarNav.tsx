"use client";

import {usePathname} from "next/navigation";

type AdminLink = {
  href: string;
  label: string;
};

export default function AdminSidebarNav({links}: {links: AdminLink[]}) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-0.5">
      {links.map((link) => {
        const isExactAdminHome = link.href === "/sl/admin" && pathname === "/sl/admin";
        const isActive = isExactAdminHome || (
          link.href !== "/sl/admin" && pathname.startsWith(link.href)
        );

        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-xl px-3 py-2 text-[13px] font-bold leading-[1.15] transition",
              isActive
                ? "bg-[#123b7a] text-white shadow-sm"
                : "text-[#123b7a] hover:bg-[#eaf2ff]"
            ].join(" ")}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
