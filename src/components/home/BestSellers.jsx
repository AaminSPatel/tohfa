"use client";
import { Children } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Carousel, { CarouselItem } from "@/components/ui/Carousel";

/** Receives server-rendered <ProductCard>s as children so cards stay server components. */
export default function BestSellers({ content, children }) {
  return (
    <section className="bg-sand/60 section-y overflow-hidden" aria-labelledby="bestsellers-heading">
      <div className="container-page">
        <SectionHeading id="bestsellers-heading" title={content.title} intro={content.intro} link={{ label: "Shop all", href: "/shop" }} />
        <Carousel label="best selling gifts" className="mt-8 sm:mt-10">
          {Children.toArray(children).map((child, i) => (
            <CarouselItem key={i} className="w-[72%] sm:w-[42%] md:w-[32%] lg:w-[24%]">{child}</CarouselItem>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
