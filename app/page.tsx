import { FeaturedPrograms } from "@/components/home/FeaturedPrograms";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustBar } from "@/components/home/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <TrustBar />
      <FeaturedPrograms />
      <Footer />
    </>
  );
}
