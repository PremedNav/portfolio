'use client';

import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="mt-20 mb-0 min-h-96 w-screen  px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">
            Get In Touch
          </p>

          <AnimatedTitle
            title="g<b>o</b>t a n<b>o</b>vel <br /> chall<b>e</b>nge? <br /> let&#39;s s<b>o</b>lve it."
            className="special-font !md:text-[6.2rem] w-full font-fk-screamer !text-5xl !font-black !leading-[.9]"
          />

          <a href="mailto:navmainemail@gmail.com"><Button title="Get in touch" leftIcon={<TiLocationArrow />} containerClass="mt-10 cursor-pointer bg-yellow-300 flex-center gap-1" /></a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
