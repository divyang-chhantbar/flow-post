"use client";
import Home from "@/components/HeroSection";
import FeaturesSection from "@/components/FeatureSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsGrid from "@/components/Testimonial";
import CallToAction from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Home />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsGrid />
      <CallToAction />
      <Footer/>
    </div>
  );
}