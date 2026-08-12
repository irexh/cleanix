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
        <a href="#kako-deluje">Kako deluje</a>
        <a href="#storitve">Storitve</a>
        <a href="/business">Cleanix Business</a>
        <a href="#o-nas">Zakaj cleanix</a>
      </nav>

      <div className="header-actions">
        <a className="hidden" href="/booking">
          Rezerviraj <span>→</span>
        </a>

        {hasSale ? (
          <a className="sale-gift-link" href="#akcija" aria-label="Poglej akcijo">
            <span>🎁</span>
            Akcija
          </a>
        ) : null}

        {showProfile ? (
          <a className="header-profile-link" href={profileHref}>
            Profil
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
              <span>Menu</span>
            </div>
          </div>
        </div>

        <a href="#kako-deluje" onClick={closeMenu}>
          Kako deluje
        </a>
        <a href="#storitve" onClick={closeMenu}>
          Storitve
        </a>
        <a href="/business" onClick={closeMenu}>
          Cleanix Business
        </a>
        <a href="#o-nas" onClick={closeMenu}>
          Zakaj cleanix
        </a>
        <a href="/booking" className="mobile-menu-cta" onClick={closeMenu}>
          Rezerviraj čiščenje
        </a>
      </div>
    </header>
  );
}
