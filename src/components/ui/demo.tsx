"use client";

import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import dacDevelopersImg from "@/Img/Projects/DacDevelopers.webp";
import hahaToysImg from "@/Img/Projects/hahatoys.webp";
import indianMountainImg from "@/Img/Projects/indianmountain.webp";
import sparoLivingImg from "@/Img/Projects/sparoliving.webp";
import viveImg from "@/Img/Projects/Vive.webp";

const items: CardStackItem[] = [
  {
    id: 1,
    title: "DAC Developers",
    description: "Real estate digital flagship built for high-intent property inquiries and lead conversion",
    imageSrc: dacDevelopersImg,
    href: "https://dacdevelopers.com/",
    ctaLabel: "Live Website",
  },
  {
    id: 2,
    title: "Haha Toys",
    description: "High-converting D2C toy storefront with seamless product discovery and checkout",
    imageSrc: hahaToysImg,
    href: "https://www.thehahatoys.com/",
    ctaLabel: "Live Website",
  },
  {
    id: 3,
    title: "Indian Mountain Rovers",
    description: "Adventure travel & Himalayan expedition booking platform crafted for explorers",
    imageSrc: indianMountainImg,
    href: "https://www.indianmountainrovers.com/",
    ctaLabel: "Live Website",
  },
  {
    id: 4,
    title: "Sparo Living",
    description: "Modern home & lifestyle e-commerce experience with editorial product storytelling",
    imageSrc: sparoLivingImg,
    href: "https://sparoliving.com/",
    ctaLabel: "Live Website",
  },
  {
    id: 5,
    title: "Vive Beauty Care",
    description: "Curated beauty & wellness brand experience designed for trust and repeat orders",
    imageSrc: viveImg,
    href: "https://vivebeautycare.com/",
    ctaLabel: "Live Website",
  },
];

export default function CardStackDemoPage() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-5xl px-4 flex flex-col items-center justify-center">
        <CardStack
          items={items}
          initialIndex={0}
          autoAdvance
          intervalMs={2400}
          pauseOnHover
          showDots
        />
      </div>
    </div>
  );
}
