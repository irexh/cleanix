"use client";

import {useEffect, useRef, useState} from "react";
import {signOut} from "next-auth/react";

type ProfileMenuProps = {
  profileHref: string;
  settingsHref: string;
};

export default function ProfileMenu({
  profileHref,
  settingsHref
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-menu-trigger"
        aria-label="Uporabniški meni"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="profile-menu-head" />
        <span className="profile-menu-body" />
      </button>

      {isOpen ? (
        <div className="profile-menu-dropdown">
          <a href={profileHref} onClick={() => setIsOpen(false)}>
            Račun
          </a>
          <a href={settingsHref} onClick={() => setIsOpen(false)}>
            Nastavitve
          </a>
          <button
            type="button"
            onClick={() => signOut({callbackUrl: "/sl/login"})}
          >
            Odjavi
          </button>
        </div>
      ) : null}
    </div>
  );
}
