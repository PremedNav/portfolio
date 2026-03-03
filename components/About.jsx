'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          About Me
        </p>

        <AnimatedTitle
          title="Buil<b>d</b>ing the future <br /> one pr<b>o</b>ject at a time"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>Software architect, pre-med student, and builder since age 6.</p>
          <p className="text-gray-500">
            I build medical AI platforms, ML infrastructure, and creative web
            experiences — driven by curiosity, not compensation.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="/img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10">
            <div className="max-w-md">
              <p className="font-general text-[10px] uppercase tracking-widest text-white/50">
                Who I Am
              </p>
              <h2 className="mt-2 font-fk-screamer text-2xl font-black uppercase leading-tight text-white sm:text-4xl">
                Builder since<br />age 6.
              </h2>
              <p className="mt-3 font-robert-regular text-xs leading-relaxed text-white/60 sm:text-sm">
                From writing my first lines of code at 6 to architecting medical AI platforms and ML infrastructure today — I build because I have to, not because I&apos;m told to.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
