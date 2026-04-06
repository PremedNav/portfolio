import Hero from "@/components/Hero";
import NavBar from "@/components/Navbar";
import Features from "@/components/Features";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#f8f8f6]">
      <NavBar variant="light" />
      <Hero />
      <Features />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  );
}
