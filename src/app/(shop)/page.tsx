import { Hero } from "@/components/home/Hero";
import { BannerCarouselDesktop } from "@/components/home/BannerCarouselDesktop";
import { BannerCarouselMobile } from "@/components/home/BannerCarouselMobile";
import { CategoriesGrid } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestsellerProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";
import { FAQ } from "@/components/home/FAQ";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="bg-white pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="hidden sm:block">
          <BannerCarouselDesktop />
        </div>

        <div className="block sm:hidden">
          <BannerCarouselMobile />
        </div>
      </div>

      <CategoriesGrid />
      <FeaturedProducts />
      <BestSellers />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Newsletter />
    </>
  );
}