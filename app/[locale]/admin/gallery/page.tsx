import Image from "next/image";
import type {ReactNode} from "react";

import {
  addGalleryImageAction,
  deleteGalleryImageAction,
  updateHeroImagesAction
} from "@/app/[locale]/admin/gallery/actions";
import {galleryPrisma} from "@/lib/gallery-prisma";
import {getSiteContentMap} from "@/lib/site-content";

const availableImages = [
  "/images/cisto-home-hero.png",
  "/images/cisto-biznis-hero.png",
  "/images/redno-ciscenje-hero.png",
  "/images/generalno-ciscenje-hero.png",
  "/images/cisto-logo-transparent.png"
];

export default async function AdminGalleryPage() {
  const content = await getSiteContentMap();
  const galleryImages = await galleryPrisma.galleryImage.findMany({
    where: {isActive: true},
    orderBy: {createdAt: "desc"}
  });

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Media
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Tukaj nastavis glavne slike na spletni strani in dodas slike v galerijo.
        </p>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Hero slike</h2>
          <p className="mt-2 text-sm text-[#5d716a]">
            Uporabi obstojece poti iz seznama ali javni URL slike.
          </p>

          <form action={updateHeroImagesAction} className="mt-6 grid gap-5 lg:grid-cols-2">
            <ImageField
              label="Homepage hero slika"
              name="home_hero_image"
              defaultValue={content.home_hero_image}
            />
            <ImageField
              label="Business hero slika"
              name="business_hero_image"
              defaultValue={content.business_hero_image}
            />

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-[#2f6fe4] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#123b7a]"
              >
                Shrani slike
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Dodaj sliko v galerijo</h2>
          <form action={addGalleryImageAction} className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.5fr_auto] lg:items-end">
            <label className="grid gap-2 text-sm font-bold">
              Naslov
              <input
                name="title"
                required
                placeholder="npr. Ciscenje pisarne"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Pot ali URL slike
              <input
                name="src"
                required
                placeholder="/images/cisto-home-hero.png"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-[#2f6fe4] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#123b7a]"
            >
              Dodaj
            </button>
          </form>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {availableImages.map((src) => (
            <MediaCard key={src} title="Obstojeca slika" src={src} />
          ))}
          {galleryImages.map((image) => (
            <MediaCard
              key={image.id}
              title={image.title}
              src={image.src}
              deleteForm={
                <form action={deleteGalleryImageAction} className="mt-4">
                  <input type="hidden" name="id" value={image.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
                  >
                    Fshije
                  </button>
                </form>
              }
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function ImageField({
  label,
  name,
  defaultValue
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="grid gap-3 text-sm font-bold">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        list="available-media"
        className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
      />
      <datalist id="available-media">
        {availableImages.map((src) => (
          <option key={src} value={src} />
        ))}
      </datalist>
    </label>
  );
}

function MediaCard({
  title,
  src,
  deleteForm
}: {
  title: string;
  src: string;
  deleteForm?: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <div className="relative h-52 bg-[#eaf2ff]">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="p-5">
        <h2 className="font-extrabold">{title}</h2>
        <p className="mt-2 break-all text-xs text-[#5d716a]">{src}</p>
        {deleteForm}
      </div>
    </article>
  );
}
