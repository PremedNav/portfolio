'use client';

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import ZoovAnimation from "./ZoovAnimation";
import CloverAnimation from "./CloverAnimation";

gsap.registerPlugin(ScrollTrigger);

const RiveAnimation = dynamic(() => import("./RiveAnimation"), { ssr: false });

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src = null, riveSrc = null, title, description, isComingSoon = false, ribbon = null, link = null, videoClassName = '', children = null }) => {
  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Wrapper {...wrapperProps} className="relative size-full overflow-hidden block cursor-pointer">
      {children ? (
        <div className="absolute inset-0">{children}</div>
      ) : riveSrc ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <RiveAnimation
            src={riveSrc}
            className="w-[60%] h-[60%]"
          />
        </div>
      ) : (
        <video
          src={src}
          loop
          muted
          autoPlay
          playsInline
          className={`absolute left-0 top-0 size-full object-cover object-center ${videoClassName || ''}`}
        />
      )}
      {ribbon && (
        <div className="absolute right-[-60px] top-[-60px] z-20 h-[160px] w-[160px] pointer-events-none" style={{ transform: 'rotate(45deg)' }}>
          <div
            className={`absolute bottom-0 left-0 w-full h-full flex items-end justify-center pb-2 text-[11px] font-bold uppercase tracking-wider shadow-lg rounded-lg ${
              ribbon === 'Discontinued'
                ? 'bg-red-500 text-white'
                : ribbon === 'Not Public'
                ? 'bg-orange-500 text-white'
                : ribbon === 'Remodeling'
                ? 'bg-cyan-500 text-white'
                : ribbon.startsWith('Complete')
                ? 'bg-emerald-500 text-white'
                : 'bg-yellow-300 text-black'
            }`}
          >
            {ribbon}
          </div>
        </div>
      )}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-white">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base text-white">{description}</p>
          )}
          {ribbon?.startsWith('Complete') && (
            <p className="mt-2 max-w-56 text-[10px] leading-snug text-white/35">
              Available under Commons Clause. Free to use commercially but cannot be resold or charged to end users. Usage disclosure is required.
            </p>
          )}
        </div>

        {isComingSoon && (() => {
          const Tag = link ? 'div' : 'a';
          const tagProps = link ? {} : {
            href: ribbon?.startsWith('Complete') ? 'mailto:navmainemail@gmail.com' : '#',
          };
          return (
            <Tag
              {...tagProps}
              className="group relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-white/30 bg-black/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-yellow-300 hover:text-black hover:border-yellow-300"
            >
              <TiLocationArrow className="relative z-20 transition-transform duration-300 group-hover:rotate-45" />
              <p className="relative z-20">{link ? 'visit project' : ribbon?.startsWith('Complete') ? 'contact for more info' : ribbon === 'Discontinued' ? 'no longer available' : 'coming soon'}</p>
            </Tag>
          );
        })()}
      </div>
    </Wrapper>
  );
};

export const L = (n) => `<span style="user-select:none" class="text-white/20">${String(n).padStart(2,' ')}  </span>`;
export const synthrCodeHTML = `${L(1)}<span class="text-cyan-400">use</span> <span class="text-teal-300">std::tensor</span>::{<span class="text-teal-300">Tensor</span>, <span class="text-teal-300">SparseMask</span>, <span class="text-teal-300">RotaryEmbed</span>};
${L(2)}<span class="text-cyan-400">use</span> <span class="text-teal-300">std::ops</span>::{<span class="text-emerald-300">einsum</span>, <span class="text-emerald-300">softmax</span>, <span class="text-emerald-300">dropout</span>, <span class="text-emerald-300">rms_norm</span>};
${L(3)}<span class="text-cyan-400">use</span> <span class="text-teal-300">std::distribute</span>::<span class="text-teal-300">Mesh</span>;
${L(4)}
${L(5)}<span class="text-purple-400">@kernel</span>(grid=[N/<span class="text-amber-300">256</span>], block=[<span class="text-amber-300">256</span>])
${L(6)}<span class="text-purple-400">@autodiff</span>(mode=<span class="text-green-400">reverse</span>, order=<span class="text-amber-300">2</span>)
${L(7)}<span class="text-purple-400">@quantize</span>(precision=<span class="text-green-400">fp8_e4m3</span>, fallback=<span class="text-green-400">bf16</span>)
${L(8)}<span class="text-cyan-400">module</span> <span class="text-yellow-300">TransformerBlock</span>&lt;T: <span class="text-teal-300">TensorKind</span>, D: <span class="text-teal-300">Dim</span>&gt; {
${L(9)}
${L(10)}  <span class="text-gray-500">// Flash attention w/ rotary position embeddings</span>
${L(11)}  <span class="text-purple-400">@fuse</span>(strategy=<span class="text-green-400">aggressive</span>, mem_bound=<span class="text-green-400">shared</span>)
${L(12)}  <span class="text-cyan-400">fn</span> <span class="text-emerald-300">multi_head_attn</span>(
${L(13)}    Q: <span class="text-teal-300">Tensor</span>&lt;T, [B, H, S, D]&gt;,
${L(14)}    K: <span class="text-teal-300">Tensor</span>&lt;T, [B, H, S, D]&gt;,
${L(15)}    V: <span class="text-teal-300">Tensor</span>&lt;T, [B, H, S, D]&gt;,
${L(16)}    mask: <span class="text-teal-300">SparseMask</span>&lt;[S, S], layout=<span class="text-green-400">causal</span>&gt;,
${L(17)}    rope: <span class="text-teal-300">RotaryEmbed</span>&lt;D, base=<span class="text-amber-300">500000</span>&gt;,
${L(18)}  ) -&gt; <span class="text-teal-300">Tensor</span>&lt;T, [B, H, S, D]&gt; <span class="text-purple-400">@where</span> D % <span class="text-amber-300">128</span> == <span class="text-amber-300">0</span> {
${L(19)}
${L(20)}    <span class="text-cyan-400">let</span> Q_rot = rope.<span class="text-emerald-300">apply</span>(Q, dim=<span class="text-amber-300">-1</span>);
${L(21)}    <span class="text-cyan-400">let</span> K_rot = rope.<span class="text-emerald-300">apply</span>(K, dim=<span class="text-amber-300">-1</span>);
${L(22)}
${L(23)}    <span class="text-cyan-400">let</span> scale = <span class="text-amber-300">1.0</span> / D.<span class="text-emerald-300">sqrt</span>().<span class="text-emerald-300">cast</span>&lt;T&gt;();
${L(24)}    <span class="text-cyan-400">let</span> attn = <span class="text-emerald-300">einsum</span>(<span class="text-green-400">"bhsd,bhtd-&gt;bhst"</span>, Q_rot, K_rot)
${L(25)}      <span class="text-red-400">|&gt;</span> .<span class="text-emerald-300">mul</span>(scale)
${L(26)}      <span class="text-red-400">|&gt;</span> mask.<span class="text-emerald-300">apply</span>(_, fill=<span class="text-amber-300">-inf</span>)
${L(27)}      <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">softmax</span>(dim=<span class="text-amber-300">-1</span>, algo=<span class="text-green-400">online_safe</span>)
${L(28)}      <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">dropout</span>(p=<span class="text-amber-300">0.0</span>, <span class="text-purple-400">@compile_only</span>);
${L(29)}
${L(30)}    <span class="text-cyan-400">let</span> out = <span class="text-emerald-300">einsum</span>(<span class="text-green-400">"bhst,bhtd-&gt;bhsd"</span>, attn, V);
${L(31)}    <span class="text-cyan-400">return</span> out <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">rearrange</span>(<span class="text-green-400">"b h s d -&gt; b s (h d)"</span>)
${L(32)}               <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">linear</span>(<span class="text-cyan-400">self</span>.Wo, bias=<span class="text-green-400">none</span>);
${L(33)}  }
${L(34)}
${L(35)}  <span class="text-gray-500">// Gated FFN with SwiGLU activation</span>
${L(36)}  <span class="text-purple-400">@pipeline</span>(stages=<span class="text-amber-300">4</span>, interleave=<span class="text-green-400">1F1B</span>)
${L(37)}  <span class="text-purple-400">@checkpoint</span>(policy=<span class="text-green-400">selective</span>, granularity=<span class="text-green-400">op</span>)
${L(38)}  <span class="text-cyan-400">fn</span> <span class="text-emerald-300">feedforward</span>(
${L(39)}    x: <span class="text-teal-300">Tensor</span>&lt;T, [B, S, E]&gt;,
${L(40)}  ) -&gt; <span class="text-teal-300">Tensor</span>&lt;T, [B, S, E]&gt; {
${L(41)}    <span class="text-cyan-400">let</span> gate = x <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">linear</span>(<span class="text-cyan-400">self</span>.Wg) <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">silu</span>();
${L(42)}    <span class="text-cyan-400">let</span> up   = x <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">linear</span>(<span class="text-cyan-400">self</span>.Wu);
${L(43)}    <span class="text-cyan-400">return</span> (gate * up)
${L(44)}      <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">linear</span>(<span class="text-cyan-400">self</span>.Wd)
${L(45)}      <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">rms_norm</span>(<span class="text-cyan-400">self</span>.γ, eps=<span class="text-amber-300">1e-6</span>);
${L(46)}  }
${L(47)}
${L(48)}  <span class="text-gray-500">// Forward pass w/ residual + MoE routing</span>
${L(49)}  <span class="text-purple-400">@distribute</span>(mesh=[dp=<span class="text-amber-300">8</span>, tp=<span class="text-amber-300">4</span>, pp=<span class="text-amber-300">2</span>, ep=<span class="text-amber-300">16</span>])
${L(50)}  <span class="text-cyan-400">fn</span> <span class="text-emerald-300">forward</span>(x: <span class="text-teal-300">Tensor</span>&lt;T, [B, S, E]&gt;) -&gt; <span class="text-teal-300">Loss</span> {
${L(51)}    <span class="text-cyan-400">let</span> residual = x;
${L(52)}    <span class="text-cyan-400">let</span> h = x <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">rms_norm</span>(<span class="text-cyan-400">self</span>.γ1, eps=<span class="text-amber-300">1e-6</span>)
${L(53)}              <span class="text-red-400">|&gt;</span> <span class="text-cyan-400">self</span>.<span class="text-emerald-300">multi_head_attn</span>(_, _, _)
${L(54)}              <span class="text-red-400">|&gt;</span> residual.<span class="text-emerald-300">add</span>(_);
${L(55)}    <span class="text-cyan-400">let</span> out = h <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">rms_norm</span>(<span class="text-cyan-400">self</span>.γ2, eps=<span class="text-amber-300">1e-6</span>)
${L(56)}                <span class="text-red-400">|&gt;</span> <span class="text-cyan-400">self</span>.<span class="text-emerald-300">feedforward</span>(_)
${L(57)}                <span class="text-red-400">|&gt;</span> h.<span class="text-emerald-300">add</span>(_);
${L(58)}    <span class="text-cyan-400">return</span> out <span class="text-red-400">|&gt;</span> <span class="text-emerald-300">sparse_moe</span>(
${L(59)}      experts=<span class="text-cyan-400">self</span>.experts[<span class="text-amber-300">0</span>..<span class="text-amber-300">E</span>],
${L(60)}      router=<span class="text-cyan-400">self</span>.gate,
${L(61)}      top_k=<span class="text-amber-300">2</span>,
${L(62)}      capacity_factor=<span class="text-amber-300">1.25</span>,
${L(63)}      <span class="text-purple-400">@load_balance</span>(aux_loss=<span class="text-amber-300">0.01</span>)
${L(64)}    );
${L(65)}  }
${L(66)}}`;

const Features = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Lando Norris-style: colored blocks cover text, then wipe away left-to-right
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'restart none none reset',
      },
    });

    // Blocks start fully covering, then wipe off to the right
    tl.fromTo(
      '.ln-block',
      { x: '0%' },
      { x: '101%', duration: 0.7, stagger: 0.12, ease: 'power3.inOut' },
      0.2
    );

    // Subtitle fade up
    tl.fromTo(
      '.ln-sub',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out' },
      0.6
    );

    // Bento cards fade up on scroll
    const cards = sectionRef.current.querySelectorAll('.bento-card-anim');
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'restart none none reset',
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
  <section id="projects" className="bg-[#f8f8f6] pb-52" ref={sectionRef}>
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <div className="relative overflow-hidden inline-block">
          <span className="ln-block absolute -inset-1 bg-yellow-300" />
          <p className="font-circular-web text-lg text-[#181816]">
            What I&apos;m Building
          </p>
        </div>
        <div className="relative overflow-hidden mt-1 max-w-md">
          <span className="ln-block absolute -inset-1 bg-yellow-300" />
          <p className="font-circular-web text-lg text-[#8a8a7e]">
            A collection of projects spanning medical AI, ML infrastructure,
            edtech, and industrial intelligence. Each one solving a different hard problem.
          </p>
        </div>
      </div>

      <BentoTilt className="bento-card-anim border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh] bg-black">
        <BentoCard
          riveSrc="/rive/hero_section.riv"
          title={
            <img
              src="/img/studyur-logo-white.svg"
              alt="Studyur"
              className="h-36 md:h-44 w-auto pointer-events-none"
              style={{ marginTop: '-60px', marginBottom: '-60px', marginLeft: '-35px' }}
            />
          }
          description="A study platform for students to study harder, smarter, deeper, and faster — maximizing information gained in the shortest time using AI and a suite of tools."
          ribbon="Under Construction"
          isComingSoon
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-card-anim bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2 bg-black">
          <BentoCard
            title={
              <img
                src="/img/clover-logo-white.svg"
                alt="Clover"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A proprietary 12-billion parameter AI model. Not available to the public — built on the belief that LLMs aren't the future, and other AI models will benefit humankind more."
            ribbon="Not Public"
            isComingSoon
          >
            <CloverAnimation />
          </BentoCard>
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0 bg-black">
          <BentoCard
            title={
              <img
                src="/img/zoov-logo-white.svg"
                alt="Zoov"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A proprietary medical AI transcription platform to help healthcare providers spend more time with patients and less on paperwork. Discontinued after Doximity launched a free AI scribe."
            ribbon="Discontinued"
            isComingSoon
          >
            <ZoovAnimation />
          </BentoCard>
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_1 me-14 md:col-span-1 md:me-0 bg-black">
          <BentoCard
            src="/videos/feature-4.mp4"
            videoClassName="translate-x-[10%]"
            title={
              <img
                src="/img/premeder-logo-white.svg"
                alt="PreMeder"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A pre-health web app for tracking applications, accessing resources, and preparing for every step of the admissions process."
            ribbon="Remodeling"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-yellow-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_2 bg-black">
          <BentoCard
            src="/videos/feature-5.mp4"
            videoClassName="translate-x-[10%]"
            title={
              <img
                src="/img/pangroup-logo.svg"
                alt="Pangroup"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A nonprofit helping high school students get into their dream college, discontinued due to scheduling conflicts among all founders."
            ribbon="Discontinued"
            isComingSoon
          />
        </BentoTilt>
      </div>

      {/* Second project grid */}
      <div className="mt-7 grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-card-anim bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2 bg-black">
          <BentoCard
            src="/videos/trovex.mp4"
            videoClassName="!object-contain scale-[1.3]"
            title={
              <img
                src="/img/trovex-logo-white.svg"
                alt="Trovex"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A proprietary AI-powered search for your files, support chat, receptionist, and more. Intelligent retrieval across your entire workflow."
            ribbon="Under Development"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0 bg-black">
          <BentoCard
            title={
              <img
                src="/img/synthr-logo-white.svg"
                alt="Synthr"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A programming language purpose-built for ML pipelines. Tensor-native syntax, auto-differentiation, and GPU-first execution."
            ribbon="Complete"
            isComingSoon
          >
            <div className="size-full bg-black p-4 pt-16 overflow-hidden font-mono text-[10px] md:text-xs leading-relaxed flex justify-end">
              <pre className="text-white/90" dangerouslySetInnerHTML={{ __html: synthrCodeHTML }} />
            </div>
          </BentoCard>
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_1 me-14 md:col-span-1 md:me-0 bg-black">
          <BentoCard
            src="/videos/histia.mp4"
            videoClassName="!left-auto !top-auto !right-4 !bottom-4 !w-[65%] !h-[65%] !object-contain"
            title={
              <img
                src="/img/histia-logo-white.svg"
                alt="Histia"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A proprietary Whole-Slide Imaging platform powered by AI. Automated labeling, annotation, and analysis of whole slides for faster, smarter pathology."
            ribbon="Complete"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_2 bg-black">
          <BentoCard
            src="/videos/topographify.mp4"
            title={
              <img
                src="/img/topographify-logo-white.svg"
                alt="Topographify"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="Proprietary high-resolution terrain mapping and analysis. Real-time 3D topographic generation from satellite and LiDAR data."
            ribbon="Complete"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-card-anim bento-tilt_2 bg-black">
          <BentoCard
            src="/videos/aethon.mp4"
            videoClassName="!object-contain scale-[0.9] translate-x-[10%]"
            title={
              <img
                src="/img/aethon-logo-white.svg"
                alt="Aethon"
                className="h-12 md:h-16 w-auto pointer-events-none"
              />
            }
            description="A proprietary AI model trained on biochemical processes and pathways, working to discover novel biochemical mechanisms across eukaryotes, prokaryotes, and archaea."
            ribbon="Complete"
            isComingSoon
          />
        </BentoTilt>
      </div>

      <BentoTilt className="bento-card-anim border-hsla relative mt-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh] bg-black">
        <BentoCard
          src="/videos/rivex.mp4"
          videoClassName="!object-contain scale-[1.1]"
          title={
            <img
              src="/img/rivex-logo-white.svg"
              alt="Rivex"
              className="h-12 md:h-16 w-auto pointer-events-none"
            />
          }
          description="A proprietary AI-powered visual inspection platform. Sensor and imaging models that detect issues in robotic and packing machines to prevent downtime before it happens."
          ribbon="Complete"
          isComingSoon
        />
      </BentoTilt>
    </div>
  </section>
  );
};

export default Features;
