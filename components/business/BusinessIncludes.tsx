"use client";

import {useMemo, useState} from "react";
import Image from "next/image";

type BusinessIncludeTab = {
  key: string;
  label: string;
  image: string;
  points: string[];
};

const tabs: BusinessIncludeTab[] = [
  {
    key: "pisarne",
    label: "Pisarne",
    image: "/images/business-includes/pisarne.png",
    points: [
      "praznjenje smeti",
      "sesanje in pomivanje tal",
      "čiščenje vidnih površin",
      "čiščenje vrat, kljuk, stikal",
      "brisanje prahu",
      "čiščenje steklenih površin"
    ]
  },
  {
    key: "sejne-sobe",
    label: "Sejne sobe",
    image: "/images/business-includes/sejne-sobe.png",
    points: [
      "ureditev miz in stolov",
      "brisanje prahu",
      "čiščenje miznih površin",
      "sesanje in pomivanje tal",
      "čiščenje stekla in vrat"
    ]
  },
  {
    key: "skupni-prostori",
    label: "Skupni prostori",
    image: "/images/business-includes/skupni-prostori.png",
    points: [
      "praznjenje smeti",
      "čiščenje hodnikov in vhodov",
      "sesanje in pomivanje tal",
      "čiščenje steklenih površin",
      "brisanje prahu",
      "osnovna ureditev prostora"
    ]
  },
  {
    key: "sanitarije",
    label: "Toaletni prostori",
    image: "/images/business-includes/sanitarije.png",
    points: [
      "čiščenje školjk, bidejev in umivalnikov",
      "čiščenje ogledal in luči",
      "pomivanje tal",
      "čiščenje vidnih elementov",
      "polnjenje sanitarnega materiala"
    ]
  }
];

export default function BusinessIncludes() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [pulsingTab, setPulsingTab] = useState<string | null>(null);

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.key === activeTab) ?? tabs[0],
    [activeTab]
  );

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    setPulsingTab(tabKey);
    window.setTimeout(() => setPulsingTab(null), 180);
  };

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX BUSINESS
            </p>
            <h2
              className="mt-1 text-lg font-bold leading-tight text-[#123b7a] sm:text-xl"
              style={{letterSpacing: "0.06em", wordSpacing: "0.18em"}}
            >
              Kaj vključuje čiščenje?
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-[#dbe7fb] bg-[#f8fbff]">
          <div className="grid grid-cols-2 gap-px bg-[#dbe7fb] text-center text-[11px] font-bold text-[#2f6fe4] sm:grid-cols-4">
            {tabs.map((tab) => {
              const active = tab.key === activeTab;
              const pulsing = tab.key === pulsingTab;

              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleTabClick(tab.key)}
                  className={[
                    "px-2 py-3 transition duration-200",
                    "active:scale-[0.98]",
                    active ? "bg-[#2f6fe4] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]" : "bg-[#f8fbff] hover:bg-[#eef5ff]",
                    pulsing ? "scale-[0.99]" : ""
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="overflow-hidden rounded-[18px] bg-white shadow-sm">
              <Image
                src={currentTab.image}
                alt={currentTab.label}
                width={900}
                height={650}
                className="h-full w-full object-cover transition duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5d716a]">
                Vključeno
              </p>
              <ul className="grid gap-3">
                {currentTab.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-xl bg-white px-3 py-2 text-sm text-[#123b7a] shadow-sm"
                  >
                    <span className="mt-0.5 shrink-0 text-[#2f6fe4]">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
