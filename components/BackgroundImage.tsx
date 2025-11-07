"use client";

import { useState } from "react";
import Image from "next/image";

interface BackgroundImageProps {
  src: string;
  index: number;
}

export default function BackgroundImage({ src, index }: BackgroundImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleImageError = () => {
    if (imgSrc.endsWith(".webp")) {
      const originalSrc = imgSrc.replace(
        ".webp",
        imgSrc.includes("light") ? ".jpg" : ".png"
      );
      setImgSrc(originalSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={`Background ${index + 1}`}
      fill
      sizes="(max-width: 768px) 33vw, 20vw"
      className="object-cover"
      loading="lazy"
      quality={75}
      onError={handleImageError}
    />
  );
}
