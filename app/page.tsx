'use client';

import { useEffect } from "react";
import Hero from "@/components/Hero";
import NavBar from "@/components/Navbar";
import Features from "@/components/Features";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let rafId = 0;

    function initLenis() {
      import('lenis').then((mod) => {
        const Lenis = mod.default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          smoothWheel: true,
        });

        function raf(time: number) {
          lenis!.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      });
    }

    window.addEventListener('hero-ready', initLenis, { once: true });

    return () => {
      window.removeEventListener('hero-ready', initLenis);
      cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      <NavBar />
      <Hero />
      <Features />
      <Contact />
      <Footer />
    </main>
  );
}
