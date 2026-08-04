import Image from "next/image";

const images = [
  {src: "/images/cisto-home-hero.png", title: "Homepage hero"},
  {src: "/images/cisto-biznis-hero.png", title: "Business hero"},
  {src: "/images/redno-ciscenje-hero.png", title: "Redno čiščenje"},
  {src: "/images/generalno-ciscenje-hero.png", title: "Generalno čiščenje"}
];

export default function AdminGalleryPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Pregled slik, ki se trenutno uporabljajo na spletni strani.
        </p>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {images.map((image) => (
            <article key={image.src} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
              <div className="relative h-52 bg-[#eaf2ff]">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h2 className="font-extrabold">{image.title}</h2>
                <p className="mt-2 break-all text-xs text-[#5d716a]">{image.src}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
