import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import NavBar from "@/components/Navbar";

const Features = dynamic(() => import("@/components/Features"), { ssr: true });
const Lab = dynamic(() => import("@/components/Lab"), { ssr: true });
const BlogPreview = dynamic(() => import("@/components/BlogPreview"), { ssr: true });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#f8f8f6]">
      <NavBar variant="light" />
      <Hero />
      <Features />
      <Lab />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  );
}
