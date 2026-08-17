"use client";

import Image from "next/image";
import {useEffect, useState} from "react";

type HomeHeroSliderProps = {
  images: Array<{
    src: string;
    alt: string;
  }>;
};

export default function HomeHeroSlider({images}: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="hero-art hero-art-premium" aria-hidden="true">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`hero-slide ${index === activeIndex ? "active" : ""}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="hero-art-image"
            sizes="(max-width: 1024px) 100vw, 56vw"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="hero-slider-dots">
        {images.map((image, index) => (
          <button
            key={`${image.src}-dot`}
            type="button"
            className={`hero-slider-dot ${index === activeIndex ? "active" : ""}`}
            aria-label={`Prikaži sliko ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
