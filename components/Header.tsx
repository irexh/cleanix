"use client";

import {useEffect, useState} from "react";
import Image from "next/image";

type HeaderProps = {
  hasSale: boolean;
  showProfile: boolean;
  profileHref: string;
};

export default function Header({hasSale, showProfile, profileHref}: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <a href="#domov" className="brand" aria-label="cleanix domov" onClick={closeMenu}>
        <Image
          src="/images/cisto-logo-transparent.png"
          alt="cleanix logo"
          width={38}
          height={38}
          className="brand-logo"
        />
        <span>cleanix</span>
      </a>

      <nav className="desktop-nav" aria-label="Glavna navigacija">
        <a href="#storitve">Storitve</a>
        <a href="#kako-deluje">Kako deluje</a>
        <a href="/business">Za podjetja</a>
        <a href="/cenik">Cenik</a>
        <a href="#o-nas">O nas</a>
      </nav>

      <div className="header-actions">
        {showProfile ? (
          <a className="header-profile-link" href={profileHref}>
            Profil
          </a>
        ) : (
          <a className="header-login-link" href="/auth/signin">
            Prijava
          </a>
        )}

        <a className="header-primary-cta" href="/booking">
          Naroči čiščenje
        </a>

        {hasSale ? (
          <a className="header-sale-dot" href="#akcija" aria-label="Poglej akcijo">
            Akcija
          </a>
        ) : null}

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={open ? "Zapri meni" : "Odpri meni"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu-backdrop ${open ? "open" : ""}`} onClick={closeMenu} />

      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-menu-top">
          <div className="mobile-menu-brand">
            <Image
              src="/images/cisto-logo-transparent.png"
              alt="cleanix logo"
              width={28}
              height={28}
            />
            <div>
              <strong>cleanix</strong>
              <span>Meni</span>
            </div>
          </div>
        </div>

        <a href="#storitve" onClick={closeMenu}>
          Storitve
        </a>
        <a href="#kako-deluje" onClick={closeMenu}>
          Kako deluje
        </a>
        <a href="/business" onClick={closeMenu}>
          Za podjetja
        </a>
        <a href="/cenik" onClick={closeMenu}>
          Cenik
        </a>
        <a href="#o-nas" onClick={closeMenu}>
          O nas
        </a>
        <a href={showProfile ? profileHref : "/auth/signin"} onClick={closeMenu}>
          {showProfile ? "Profil" : "Prijava"}
        </a>
        <a href="/booking" className="mobile-menu-cta" onClick={closeMenu}>
          Naroči čiščenje
        </a>
      </div>
    </header>
  );
}
