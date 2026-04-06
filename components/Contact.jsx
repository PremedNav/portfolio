'use client';

import AnimatedTitle from "./AnimatedTitle";

import { TiLocationArrow } from "react-icons/ti";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="mt-20 mb-0 min-h-96 w-screen  px-10">
      <div className="relative rounded-lg bg-[#f8f8f6] py-24 text-[#181816] sm:overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase text-[#8a8a7e]">
            Get In Touch
          </p>

          <AnimatedTitle
            title="g<b>o</b>t a n<b>o</b>vel <br /> chall<b>e</b>nge? <br /> let&#39;s s<b>o</b>lve it."
            className="special-font !md:text-[6.2rem] w-full font-fk-screamer !text-5xl !font-black !leading-[.9]"
          />

          <a href="mailto:navmainemail@gmail.com" className="group relative mt-10 inline-block cursor-pointer">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 56" preserveAspectRatio="none">
              <path
                d="M8,2 L170,2 Q185,2 190,10 L198,42 Q200,50 192,54 L24,54 Q10,54 6,46 L2,14 Q0,6 8,2 Z"
                className="fill-yellow-300"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-2 px-7 py-3 font-general text-xs uppercase text-black">
              <TiLocationArrow />
              <span className="relative inline-flex overflow-hidden">
                <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Get in touch
                </span>
                <span className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Get in touch
                </span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
