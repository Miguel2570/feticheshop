import { Hero } from "@/components/home/Hero";
import { CategoriesGrid } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestsellerProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Newsletter } from "@/components/home/Newsletter";
import FAQList from "./faq/page";

export default function Home() {
  return (
    <>
      <Hero />

      <CategoriesGrid />

      <FeaturedProducts />

      <BestSellers />

      <WhyChooseUs />

      <FAQList />

      <Newsletter />
    </>
  );
}