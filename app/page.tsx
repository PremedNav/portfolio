import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import NavBar from "@/components/Navbar";

const ContourBackground = dynamic(() => import("@/components/ContourBackground"), { ssr: false });
const Features = dynamic(() => import("@/components/Features"), { ssr: true });
const Lab = dynamic(() => import("@/components/Lab"), { ssr: true });
const BlogPreview = dynamic(() => import("@/components/BlogPreview"), { ssr: true });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <>
      <ContourBackground />
      <main className="relative z-[2] min-h-screen w-screen overflow-x-hidden">
        <NavBar variant="light" />
        <Hero />
        <Features />
        <BlogPreview />
        <Lab />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
