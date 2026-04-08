'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow, TiLocation } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';

import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const HelmetReveal = dynamic(() => import('./HelmetReveal'), { ssr: false });

const CLOVER_PATH = "M1675.37 130.687C1796.88 117.897 1895.22 172.947 1991.32 238.845C2022.4 260.158 2054.23 284.254 2091.96 291.93C2155.16 304.787 2213.46 255.503 2262.94 223.089C2358.1 160.754 2474.56 118.923 2589.05 143.485C2697.07 166.658 2783.81 234.884 2843.17 326.636C2907.12 425.499 2940.04 545.104 2924.51 662.718C2900.3 846.207 2794.55 986.749 2662.3 1108.52C2602.72 1163.38 2540.69 1214.11 2485.77 1274.04C2406.37 1360.65 2343.12 1470.81 2318.75 1586.25C2312.12 1617.66 2300.48 1677.64 2320.62 1706.28C2325.47 1713.18 2332.52 1716.94 2340.8 1718.13C2372.79 1722.72 2416.25 1697.19 2442.75 1681.9C2569.76 1608.63 2662.9 1482.01 2727.41 1353C2750.33 1307.17 2769.79 1259.53 2791.29 1213.01C2852.93 1079.63 2928.82 957.434 3051.02 871.227C3163.2 792.085 3296.19 758.028 3432.2 782.454C3546.06 802.9 3654.95 860.22 3721.61 956.803C3788.79 1054.12 3802.24 1173.28 3783.09 1287.76C3777.41 1321.7 3767.48 1354.77 3761.53 1388.66C3742.01 1500.05 3795.17 1525.61 3869.08 1591.66C3902.39 1621.56 3932.13 1655.22 3957.7 1691.98C4018.99 1778.36 4043.12 1885.69 4024.69 1989.99C4001.92 2114.74 3918.31 2223.3 3814.83 2293.63C3739.06 2344.41 3651.46 2374.78 3560.52 2381.79C3398.96 2394.15 3246.47 2337.22 3107.03 2261.58C2997.8 2202.33 2889.54 2142.52 2765.28 2121.78C2676.83 2107.02 2560.88 2094.25 2479.57 2138.85C2453.18 2153.31 2472.3 2190.25 2486.12 2206.59C2576.37 2313.35 2725.9 2383.59 2861.78 2408.48C2956.98 2422.24 3053.21 2431.04 3149.02 2440.97C3461.48 2473.34 3760.05 2729.39 3708.05 3072.46C3696.96 3141.47 3667.6 3206.25 3623.01 3260.08C3546.91 3351.75 3440.69 3395.71 3325.01 3412.72C3267 3421.24 3190.6 3414.58 3145.76 3455.06C3111.05 3486.39 3093.8 3539.56 3075.63 3582.7C3040.15 3669.26 2986.19 3747.36 2909.08 3802.18C2695.81 3953.8 2404.92 3856.63 2262.11 3654.94C2148.85 3494.97 2129.25 3307.34 2166.4 3119.48C2180.61 3047.6 2200.09 2978.2 2211.98 2906.46C2213.7 2893.68 2215.74 2880.93 2217.24 2867.92C2232.87 2732.24 2207.57 2561.56 2126.73 2449.34C2065.73 2364.67 2000.77 2534.81 1987.1 2577.12C1946.6 2702.52 1943.07 2834.44 1972.2 2962.89C2014.43 3135.25 2047.86 3289.75 1999.23 3465.19C1927.16 3725.19 1673.22 3918.37 1399.03 3856.2C1245.7 3821.43 1131.65 3683.38 1083.11 3539.26C1045.41 3427.37 1003.68 3413.29 891.422 3404.82C650.411 3386.63 452.42 3228.09 462.585 2971.01C466.718 2853.75 510.216 2741.31 586.066 2651.79C715.521 2501.12 893.472 2440.68 1085.54 2421.66C1167.23 2413.57 1255.56 2410.01 1335.81 2395.3C1453.31 2372.5 1570.54 2318.17 1659.66 2237.88C1686.21 2213.97 1744.2 2155.84 1696.43 2125.88C1671.85 2110.46 1621.79 2102.61 1593.48 2100.32C1461.57 2089.67 1328.94 2120.81 1209.34 2175.53C1157.83 2199.1 1108.85 2228.2 1058.64 2254.31C947.2 2312.63 825.607 2360.11 698.851 2365.82C550.972 2372.02 408.288 2325.78 299.806 2222.52C193.209 2121.05 129.407 1980.75 156.801 1831.72C174.793 1733.84 229.142 1651.22 301.583 1584.14C333.372 1554.71 369.44 1531.09 400.111 1500.49C456.629 1444.11 439.311 1369.75 425.255 1300.08C405.974 1205.06 407.497 1108.34 442.136 1017.14C506.363 848.027 675.469 765.759 849.15 759.782C1117.63 750.544 1317.62 969.471 1408.56 1201.87C1455.06 1322.99 1505.66 1439.9 1590.72 1539.67C1646.97 1607.04 1717.78 1668.7 1799.07 1703.3C1808.91 1707.49 1827.89 1711.83 1838.39 1712.3C1887.81 1714.53 1874.11 1625.04 1869.12 1595.86C1847.81 1471.16 1786.79 1354.89 1704.42 1259.64C1651.32 1198.24 1590.59 1145.34 1532.71 1088.67C1416.77 975.397 1320.54 833.934 1298.23 669.994C1280.37 536.269 1316.85 400.962 1399.53 294.352C1470.9 200.592 1557.73 146.294 1675.37 130.687Z";

const CloverIcon = ({ size = 20, loading = false, color = 'white' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 4096 4096"
    fill="none"
    className="shrink-0"
  >
    <path fill={color} d={CLOVER_PATH} />
    {loading && (
      <path
        fill="none"
        stroke="#edff66"
        strokeWidth={150}
        strokeLinecap="round"
        strokeDasharray="3000 12000"
        className="clover-loading-path"
        d={CLOVER_PATH}
      />
    )}
  </svg>
);

const LOGO_GROUPS = [
  [
    { src: '/logos/openai.svg', alt: 'OpenAI' },
    { src: '/logos/anthropic.svg', alt: 'Anthropic' },
    { src: '/logos/nasa.svg', alt: 'NASA' },
  ],
  [
    { src: '/logos/xai.svg', alt: 'xAI' },
    { src: '/logos/spacex.svg', alt: 'SpaceX' },
    { src: '/logos/tesla.svg', alt: 'Tesla' },
  ],
];

const Hero = () => {
  const dark = true;
  const [loading, setLoading] = useState(true);
  const [coloradoTime, setColoradoTime] = useState('');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hi! I'm Clover. Ask me anything about Navtej's work, experience, or interests." },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const chatRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const pillRef = useRef(null);
  const logoContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const pulseRef = useRef(null);
  const drawDoneRef = useRef(false);
  const signatureRef = useRef(null);
  const marqueeRef = useRef(null);
  const helmetWrapperRef = useRef(null);
  const topMessageRef = useRef(null);

  // ── Colorado time ──
  useEffect(() => {
    const updateTime = () => {
      setColoradoTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'America/Denver',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Preload model images → dismiss loader when ready ──
  useEffect(() => {
    const srcs = [
      '/models/face.png', '/models/face-depth.png',
      '/models/skeleton.png', '/models/skeleton-depth.png',
    ];
    let loaded = 0;
    srcs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= srcs.length) setLoading(false);
      };
      img.src = src;
    });

    // Prefetch below-fold resources while loader plays
    const warmup = ['/videos/feature-4.mp4', '/videos/trovex.mp4'];
    warmup.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  // Fallback: dismiss loader after 3s
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // ── Auto-scroll chat to bottom ──
  useEffect(() => {
    const el = chatMessagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages, chatLoading]);

  // ── Chat panel open/close animation ──
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    if (chatOpen) {
      el.style.visibility = 'visible';
      el.style.pointerEvents = 'auto';
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(el, {
        opacity: 0, scale: 0.92, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
        },
      });
    }
  }, [chatOpen]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: 'user', text: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    }
    setChatLoading(false);
  };

  // ── Lock scrolling during loading ──
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // ── Phase 1: Logo draw animation + pulse ──
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;
    const paths = loader.querySelectorAll('.logo-path');

    paths.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
        fill: 'transparent',
        stroke: '#fffffc',
        strokeWidth: 12,
      });
    });

    const drawTl = gsap.timeline({
      onComplete: () => {
        drawDoneRef.current = true;
        pulseRef.current = gsap.to(paths, {
          opacity: 0.4,
          duration: 0.6,
          stagger: 0.06,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
      },
    });

    drawTl.to(paths, {
      strokeDashoffset: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.inOut',
    });

    drawTl.to(paths, {
      fill: '#fffffc',
      strokeWidth: 0,
      duration: 0.3,
      ease: 'power1.inOut',
    }, '-=0.1');

    return () => {
      drawTl.kill();
      if (pulseRef.current) pulseRef.current.kill();
    };
  }, []);

  // ── Phase 2: Exit animation when loading finishes ──
  useEffect(() => {
    if (loading) return;
    const loader = loaderRef.current;
    if (!loader) return;
    const paths = loader.querySelectorAll('.logo-path');

    function doExit() {
      if (pulseRef.current) pulseRef.current.kill();
      gsap.set(paths, { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          window.dispatchEvent(new Event('hero-ready'));
        },
      });

      // Frame entrance: zoom in from 0.85
      gsap.set('#video-frame', {
        opacity: 1,
        scale: 0.85,
        willChange: 'transform',
      });
      tl.to('#video-frame', {
        scale: 1,
        duration: 1.4,
        ease: 'power4.inOut',
        force3D: true,
        onComplete: () => {
          gsap.set('#video-frame', { willChange: 'auto' });
        },
      }, 0.2);

      // Loader fades out
      tl.to(loader, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => { loader.style.display = 'none'; },
      }, 0);

      // Headings: clip-path text reveal (delayed to avoid overlap with frame morph)
      gsap.set('.hero-heading-anim', { opacity: 1 });
      tl.fromTo('.hero-heading-anim',
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 20 },
        { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' },
        1.0
      );

      // Subtext + button: fade up (delayed to avoid overlap with frame morph)
      tl.fromTo('.hero-subtext-anim',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        1.3
      );
    }

    if (drawDoneRef.current) {
      doExit();
    } else {
      const check = setInterval(() => {
        if (drawDoneRef.current) {
          clearInterval(check);
          doExit();
        }
      }, 50);
      return () => clearInterval(check);
    }
  }, [loading]);

  // ── Close chat on scroll ──
  useEffect(() => {
    if (!chatOpen) return;
    const handleScroll = () => setChatOpen(false);
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chatOpen]);

  // ── Logo group crossfade ──
  useEffect(() => {
    const container = logoContainerRef.current;
    if (!container) return;
    const groups = container.querySelectorAll('.logo-group');
    if (groups.length < 2) return;

    let current = 0;
    let interval;

    function startCycling() {
      interval = setInterval(() => {
        const prev = current;
        current = (current + 1) % groups.length;
        gsap.to(groups[prev], { opacity: 0, duration: 1, ease: 'sine.inOut', overwrite: true });
        gsap.to(groups[current], { opacity: 1, duration: 1, ease: 'sine.inOut', overwrite: true });
      }, 4000);
    }

    const onReady = () => setTimeout(startCycling, 3000);
    window.addEventListener('hero-ready', onReady);
    return () => {
      window.removeEventListener('hero-ready', onReady);
      if (interval) clearInterval(interval);
    };
  }, []);

  // ── Pinned scroll: Lando Norris-style hero transition ──
  useGSAP(() => {
    const sig = signatureRef.current;
    const marquee = marqueeRef.current;
    const helmetWrapper = helmetWrapperRef.current;
    const sigPaths = sig ? sig.querySelectorAll('.sig-path') : [];

    // Set up signature paths — hide completely until drawn
    sigPaths.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });

    // Master pinned timeline — pin the entire hero section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.6,
      },
    });

    // Phase 1 (0–0.3): Hero text, buttons, logos fade out + slide down
    tl.fromTo('.hero-heading-anim, .hero-subtext-anim',
      { opacity: 1, y: 0 },
      { opacity: 0, y: 60, duration: 0.3, stagger: 0.02, ease: 'none' },
    0);

    // Phase 1 (0–0.5): Hero zooms out to a smaller centered box
    tl.fromTo('#video-frame',
      { scale: 1, borderRadius: '0px' },
      { scale: 0.4, borderRadius: '16px', duration: 0.5, ease: 'none' },
    0);

    // Phase 1 (0.2–0.5): HelmetReveal wrapper fades — box bg stays, moving elements go away
    if (helmetWrapper) {
      tl.to(helmetWrapper, {
        opacity: 0,
        duration: 0.3,
        ease: 'none',
      }, 0.2);
    }

    // Phase 1.5 (0.05–0.3): Marquee text fades in (auto-scrolls via CSS, not GSAP)
    if (marquee) {
      tl.fromTo(marquee, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' }, 0.05);
    }

    // Phase 3 (0.7–0.9): Top message fades in near end of signature draw
    const topMsg = topMessageRef.current;
    if (topMsg) {
      tl.fromTo(topMsg, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.2, ease: 'none' }, 0.7);
    }

    // Phase 2 (0.15–0.9): Signature draws in + scales up over the box
    if (sig && sigPaths.length) {
      tl.fromTo(sig, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, 0.15);
      tl.fromTo(sig, { scale: 0.8 }, { scale: 1.5, duration: 0.85, ease: 'none' }, 0.15);

      const drawStart = 0.15;
      const drawEnd = 0.9;
      const drawDuration = drawEnd - drawStart;
      const perPath = drawDuration / sigPaths.length;

      sigPaths.forEach((path, i) => {
        const t = drawStart + i * perPath;
        tl.set(path, { opacity: 1 }, t);
        tl.to(path, { strokeDashoffset: 0, duration: perPath, ease: 'none' }, t);
      });
    }
  });

  return (
    <div id="hero-section" className="relative h-dvh w-screen overflow-hidden">

      {/* ── Scrolling marquee text (auto-scrolls via CSS, fades in via GSAP) ── */}
      <div
        ref={marqueeRef}
        className="absolute inset-0 z-[5] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
        style={{ opacity: 0 }}
      >
        <div className="whitespace-nowrap flex" style={{ animation: 'marqueeLeft 45s linear infinite', fontSize: 'clamp(50px, 8vw, 120px)', fontFamily: "'robert-medium', 'general', sans-serif", fontWeight: 500, color: '#edff66', lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.7, width: 'max-content' }}>
          <span>DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; </span>
          <span>DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; DO EVERYTHING IN YOUR POWER TO MAKE A DIFFERENCE &nbsp;&nbsp;&nbsp;&nbsp; </span>
        </div>
        <div className="whitespace-nowrap flex mt-2" style={{ animation: 'marqueeRight 50s linear infinite', fontSize: 'clamp(50px, 8vw, 120px)', fontFamily: "'robert-medium', 'general', sans-serif", fontWeight: 500, color: 'rgba(255,255,252,0.8)', lineHeight: 1, letterSpacing: '-0.02em', opacity: 0.7, width: 'max-content' }}>
          <span>DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; </span>
          <span>DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; DO THE BEST YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE &nbsp;&nbsp;&nbsp;&nbsp; </span>
        </div>
      </div>

      {/* ── Top message: logo + "MESSAGE FROM NAVTEJ" (like Lando's site) ── */}
      <div
        ref={topMessageRef}
        className="absolute top-40 left-1/2 -translate-x-1/2 z-[12] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#fffffc]/70" style={{ fontFamily: 'General Sans, sans-serif' }}>
          Message from Navtej
        </p>
      </div>

      {/* ── Loading Screen ── */}
      <div
        ref={loaderRef}
        className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden"
        style={{ backgroundColor: '#21211f' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="360"
          height="56"
          viewBox="900 1300 2400 700"
          fill="none"
        >
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M1274.05 1345.03L1401.39 1344.98C1418.62 1391 1448.48 1453.32 1468.91 1500.28L1617.22 1838.88C1634.27 1878.26 1651.96 1916.46 1668.19 1956.16C1625.97 1940.56 1576.21 1918.85 1534.4 1901.22C1526.04 1897.52 1518.71 1893.59 1510.72 1889.42C1499.41 1864.66 1488.29 1839.84 1477.36 1814.97L1230.09 1815.42C1248.75 1776.96 1262.98 1737.15 1281.7 1698.12C1330.46 1698.44 1379.22 1698.41 1427.98 1698.02C1408.99 1658.92 1391.7 1614.16 1374.31 1574.3C1340.3 1498.04 1306.88 1421.62 1274.05 1345.03Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2938.03 1590.47C3023.85 1591.65 3112.59 1590.66 3198.72 1590.52C3177.2 1627.47 3146.58 1672.21 3123.02 1709.05L2922.76 1709.44C2922.47 1751.83 2922.49 1794.22 2922.82 1836.61C3012.59 1835.39 3106.39 1836.47 3196.44 1836.57C3205.83 1850.88 3215.08 1866.21 3224.16 1880.73C3236.7 1902.97 3256.48 1930.99 3270.66 1954.76C3156.97 1953.27 3037.47 1954.83 2923.22 1954.63C2908.08 1941.48 2888.72 1920.81 2874.28 1906.49C2850.23 1882.63 2825.01 1858.17 2801.68 1833.95C2802.29 1798.7 2801.78 1762.36 2801.79 1727.03C2838.96 1685.26 2896.53 1631.59 2938.03 1590.47Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2573.36 1344.53C2631.39 1345.74 2703.55 1345.78 2761.66 1344.65C2737.82 1383.88 2709.63 1424.53 2683.94 1463.25L2549.82 1462.71L2549.86 1870.26L2530.66 1883.56C2497.02 1906.86 2464.28 1933.56 2430.55 1955.66L2430.09 1486.61C2443.63 1470.57 2563.48 1349.1 2573.36 1344.53Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M1545.24 1344.49C1564.74 1349.33 1595.47 1364.17 1614.3 1372.16C1643.96 1384.74 1675.16 1397.08 1703.89 1410.76C1728.8 1464.46 1754.03 1528.71 1777.19 1583.73L1871.29 1802.6C1891.07 1848.92 1915.05 1910.39 1937.93 1954.69L1809.49 1955C1718.64 1753.32 1636.63 1546.14 1545.24 1344.49Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2921.35 1345.01C3031.62 1342.09 3158.5 1345.54 3270.43 1344.88C3247.73 1383.55 3220.2 1424.61 3195.9 1463.06L2923.06 1462.89L2922.65 1492.02L2922.52 1560.92C2883.14 1601.05 2841.64 1641.3 2801.53 1681.06C2802.84 1609.37 2801.82 1535.41 2801.9 1463.54C2842.05 1424.25 2881.87 1384.74 2921.35 1345.01Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M1254.67 1385.26C1258.63 1388.25 1312.98 1515.02 1319.26 1529.02C1302.82 1559.69 1281.21 1616.39 1267.01 1649.74L1164.06 1889.78C1137.05 1904.77 1080.73 1925.02 1048.72 1939.34C1035.07 1945.51 1018.79 1951.09 1004.36 1956.34C1018.25 1929.12 1031.91 1895.13 1044.01 1867.01L1097.75 1743.73L1254.67 1385.26Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2199.38 1345.47L2201.64 1345.8L2202.67 1347.47C2197.03 1363.17 2188.65 1379.79 2181.99 1395.6L2128.1 1521.33L1956.26 1919.96C1951.95 1907.59 1947.5 1897.63 1941.98 1885.52C1925.88 1847.78 1909.49 1810.12 1892.81 1772.54C1932.85 1685.45 1967.01 1594.66 2005.86 1507.08C2018.09 1479.51 2032.39 1435.38 2047.95 1410.22C2067.74 1399.81 2094.71 1389.85 2115.85 1380.72C2143.34 1368.85 2171.17 1355.93 2199.38 1345.47Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M3740.89 1364.44C3746.55 1372.58 3743.86 1787.45 3743.16 1836.15C3735.74 1843.21 3726.65 1850.99 3718.66 1857.66C3681.52 1888.7 3647.47 1924.56 3609.1 1954.36L3584.6 1954.63L3583.22 1952.09C3596.72 1935.58 3610.8 1924.13 3625.09 1908.51C3627.31 1859.85 3624.27 1803.05 3623.89 1754.11L3623.63 1484.45C3659.34 1445.38 3703.46 1403.54 3740.89 1364.44Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M512.24 1564.06C530 1574.9 574.581 1611.12 592.507 1625.08L748.821 1746.89L889.945 1855.92C909.669 1871.18 947.692 1898.97 964.116 1915.04C949.944 1919.73 938.55 1924.51 924.907 1930.19C897.435 1942.41 870.983 1952.59 842.648 1963.53C733.978 1881.03 627.579 1794.6 518.336 1713.03C518.41 1664.72 513.29 1613.16 512.24 1564.06Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M471.978 1334.04C482.356 1339.12 540.027 1385.34 552.6 1395.05L699.421 1508.05C730.927 1532.41 765.217 1560.36 797.867 1583.28C800.833 1633.78 804.26 1684.26 808.15 1734.72C787.56 1719.87 768.809 1704.02 747.979 1689.09L479.055 1480.76C436.791 1448.15 392.158 1414.75 351.195 1381.37C391.357 1365.08 431.715 1350.04 471.978 1334.04Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M353.922 1442.17C392.245 1469.88 432.089 1502.9 470.268 1531.85L470.143 1865.03C451.092 1877.87 429.783 1895.69 412.204 1909.99C392.058 1925.6 372.897 1941.23 352.425 1956.73C354.905 1833.16 352.906 1703.41 352.765 1579.4L352.243 1494.39C352.151 1482.47 351.251 1452.54 353.922 1442.17Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M962.201 1345.4C965.042 1349.45 963.332 1456.16 963.284 1468.26C962.418 1596.83 962.857 1725.41 964.6 1853.97L908.732 1810.89C889.138 1795.08 867.859 1779.14 847.742 1763.69L847.723 1433.45C885.626 1403.89 923.786 1374.54 962.201 1345.4Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M3417.56 1738.45C3420.54 1740.72 3421.38 1781.8 3422.95 1789.88C3441.75 1806.48 3462.51 1831.79 3490.28 1834.48C3527.52 1838.08 3563.41 1842.7 3595.39 1826.16C3594.97 1849.91 3594.88 1873.65 3595.13 1897.39C3575.27 1915.79 3555.81 1935.81 3536.77 1954.86L3500.19 1954.82C3475.55 1954.84 3450.91 1954.55 3426.27 1953.94C3418.27 1948.74 3410.6 1943.22 3403.29 1937.4C3376.09 1915.77 3324.5 1872.98 3309.76 1844.46C3305.3 1835.83 3305.69 1815.14 3305.61 1805.27C3343.57 1783.71 3380.9 1761.43 3417.56 1738.45Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M3714.12 1344.94L3714.53 1345.15L3715.08 1347.39C3686.9 1379.81 3632.03 1431.44 3600.25 1463.48C3551.8 1462.72 3503.34 1462.64 3454.89 1463.23C3445.82 1450.09 3436.95 1436.86 3428.29 1423.55C3417.33 1403.97 3389.01 1363.81 3375.27 1345.04L3714.12 1344.94Z" />
          <path className="logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2521.87 1344.69L2523.18 1345.15C2523.15 1350.26 2422.37 1449.15 2408.22 1463.51C2347.74 1461.95 2281.15 1462.84 2220.32 1462.72L2218.9 1462.01L2218.09 1459.22C2241.9 1428.13 2270.36 1378.84 2293.62 1344.88C2369.7 1345.22 2445.79 1345.15 2521.87 1344.69Z" />
        </svg>
      </div>

      {/* ── Video Frame (trapezoid container) ── */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-[#21211f]"
        style={{ opacity: 0 }}
      >

      {/* ── Static face (visible after HelmetReveal fades) ── */}
      <img
        src="/models/face.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* ── HelmetReveal wrapper (fades during scroll via ref) ── */}
      <div ref={helmetWrapperRef} className="absolute inset-0 z-0">
        <HelmetReveal dark={dark} />
      </div>

      {/* ── Hero Text Content ── */}
      <div className="absolute bottom-16 sm:bottom-8 left-0 z-[30] px-5 sm:px-10">
        <h1
          className={`hero-heading-anim special-font hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]' : 'text-[#1a1a1a]'
          }`}
          style={{ opacity: 0 }}
        >
          Navtej Singh
        </h1>

        <p
          className={`hero-subtext-anim mt-2 sm:mt-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/70' : 'text-[#1a1a1a]/70'
          }`}
          style={{ opacity: 0 }}
        >
          Software Architect &nbsp;|&nbsp; Pre-Med
        </p>

        <p
          className={`hero-subtext-anim mt-1.5 sm:mt-2 flex items-center gap-3 text-[11px] sm:text-xs transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/60' : 'text-[#1a1a1a]/60'
          }`}
          style={{ opacity: 0 }}
        >
          <span className="flex items-center gap-1.5">
            <TiLocation className="text-sm" />
            Colorado, USA
          </span>
          {coloradoTime && <span>{coloradoTime}</span>}
        </p>

        <p
          className={`hero-subtext-anim mt-3 sm:mt-5 max-w-[280px] sm:max-w-sm font-robert-regular text-xs sm:text-sm leading-relaxed transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/60' : 'text-[#1a1a1a]/60'
          }`}
          style={{ opacity: 0 }}
        >
          <span className="hidden sm:inline">Hi! I&apos;m a 20-year-old pre-med student and software architect,
          programming since I was 6. I build medical AI platforms, ML
          infrastructure, and distributed systems. I&apos;ve recently been doing web dev for fun. I don&apos;t take compensation, I just love solving hard problems.</span>
          <span className="sm:hidden">20-year-old pre-med student &amp; software architect. I build medical AI, ML infrastructure, and distributed systems.</span>
        </p>

        <div className="hero-subtext-anim mt-4 sm:mt-5 flex items-center gap-3" style={{ opacity: 0 }}>
          <a href="/contact" className="group relative inline-block cursor-pointer">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 56" preserveAspectRatio="none">
              <path
                d="M8,2 L170,2 Q185,2 190,10 L198,42 Q200,50 192,54 L24,54 Q10,54 6,46 L2,14 Q0,6 8,2 Z"
                className="fill-yellow-300"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-2 px-7 py-3 font-general text-xs uppercase text-black">
              <TiLocationArrow />
              <span className="relative inline-flex overflow-hidden leading-tight py-px">
                <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Get in touch
                </span>
                <span className="absolute inset-0 translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Get in touch
                </span>
              </span>
            </span>
          </a>
          <a href="/blog" className="group relative inline-block cursor-pointer">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 56" preserveAspectRatio="none">
              <path
                d="M8,2 L170,2 Q185,2 190,10 L198,42 Q200,50 192,54 L24,54 Q10,54 6,46 L2,14 Q0,6 8,2 Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-2 px-7 py-3 font-general text-xs uppercase text-white">
              <TiLocationArrow />
              <span className="relative inline-flex overflow-hidden leading-tight py-px">
                <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Read my blog
                </span>
                <span className="absolute inset-0 translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Read my blog
                </span>
              </span>
            </span>
          </a>
        </div>

        <p
          className={`hero-subtext-anim mt-3 sm:mt-4 font-robert-regular text-[10px] sm:text-xs transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/30' : 'text-[#1a1a1a]/30'
          }`}
          style={{ opacity: 0 }}
        >
          <span className="hidden sm:inline">Talk to Clover, an LLM I made, via the clover in the bottom middle.</span>
          <span className="sm:hidden">Tap the clover to chat with Clover AI.</span>
        </p>
      </div>

      {/* ── Logos — bottom right ── */}
      <div className="hero-subtext-anim absolute bottom-8 right-8 z-[30] hidden sm:block" style={{ opacity: 0 }}>
        <p
          className="mb-3 text-right text-[10px] font-medium uppercase tracking-[0.25em] text-white/40"
        >
          Previously optimized systems for
        </p>
        <div ref={logoContainerRef} className="relative">
          {LOGO_GROUPS.map((group, gi) => (
            <div
              key={gi}
              className={`logo-group flex items-center justify-end gap-4 sm:gap-6${gi > 0 ? ' absolute top-0 right-0' : ''}`}
              style={{ opacity: gi === 0 ? 1 : 0, willChange: 'opacity' }}
            >
              {group.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-3 sm:h-5 w-auto shrink-0 opacity-50 transition-all duration-700"
                  style={{ filter: 'none' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Chat Pill ── */}
      <div className="hero-subtext-anim absolute bottom-5 right-5 z-[35] sm:bottom-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2" style={{ opacity: 0 }}>
        <button
          ref={pillRef}
          onClick={() => setChatOpen((prev) => !prev)}
          className="hover:scale-110 transition-transform duration-200 cursor-pointer"
        >
          <CloverIcon size={20} loading color="#fffffc" />
        </button>
      </div>

      </div>{/* end #video-frame */}

      {/* ── Signature stroke-draw overlay (OUTSIDE video-frame so it overflows the box) ── */}
      <div
        ref={signatureRef}
        className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="131.568 68.328 176.432 90.172"
          className="signature-svg w-[55vw] max-w-[650px]"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 30px rgba(237,255,102,0.3))' }}
        >
          <path className="sig-path" d="M 137.000,153.500 C 136.028,150.221 137.000,150.500 137.000,147.500" strokeWidth="5.396" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 137.000,147.500 C 139.297,143.361 138.528,143.221 142.000,139.500" strokeWidth="4.014" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 142.000,139.500 C 146.536,133.527 146.297,133.361 151.000,127.500" strokeWidth="3.236" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 151.000,127.500 C 156.733,120.161 156.536,120.027 162.000,112.500" strokeWidth="2.764" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 162.000,112.500 C 167.583,104.053 167.733,104.161 173.000,95.500" strokeWidth="2.623" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 173.000,95.500 C 177.074,89.044 177.083,89.053 181.000,82.500" strokeWidth="2.853" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 181.000,82.500 C 183.000,75.500 183.074,79.044 185.000,75.500" strokeWidth="3.421" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 185.000,75.500 C 187.475,78.796 187.000,75.500 189.000,82.500" strokeWidth="4.531" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 189.000,82.500 C 190.417,87.526 190.975,87.296 192.000,92.500" strokeWidth="3.744" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 192.000,92.500 C 194.000,98.500 193.917,98.526 196.000,104.500" strokeWidth="3.301" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 196.000,104.500 C 197.781,110.582 198.000,110.500 200.000,116.500" strokeWidth="3.248" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 200.000,116.500 C 202.210,122.641 202.281,122.582 205.000,128.500" strokeWidth="3.205" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 205.000,128.500 C 207.702,132.904 207.210,133.141 210.000,137.500" strokeWidth="3.354" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 210.000,137.500 C 210.345,143.189 211.202,139.904 212.000,142.500" strokeWidth="3.948" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 212.000,142.500 C 217.712,138.049 216.345,140.689 222.000,132.500" strokeWidth="4.680" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 222.000,132.500 C 225.500,126.500 226.212,127.049 229.000,120.500" strokeWidth="3.445" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 229.000,120.500 C 232.500,114.500 232.500,114.500 236.000,108.500" strokeWidth="3.193" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 236.000,108.500 C 239.675,102.595 239.500,102.500 243.000,96.500" strokeWidth="3.063" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 243.000,96.500 C 245.500,91.500 245.675,91.595 248.000,86.500" strokeWidth="3.287" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 248.000,86.500 C 250.408,82.640 250.000,82.500 252.000,78.500" strokeWidth="3.556" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 252.000,78.500 C 254.140,74.412 252.908,76.140 253.000,73.500" strokeWidth="4.515" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 253.000,73.500 C 249.959,73.817 251.640,72.412 247.000,74.500" strokeWidth="4.942" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 247.000,74.500 C 243.450,75.350 243.459,75.317 240.000,76.500" strokeWidth="4.721" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 240.000,76.500 C 236.000,78.000 235.950,77.850 232.000,79.500" strokeWidth="4.541" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 232.000,79.500 C 227.269,80.123 228.000,81.000 224.000,82.500" strokeWidth="4.490" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 224.000,82.500 C 220.573,85.149 221.769,84.123 221.000,87.500" strokeWidth="5.064" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 221.000,87.500 C 222.895,91.430 221.573,90.649 226.000,93.500" strokeWidth="4.692" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 226.000,93.500 C 229.550,94.350 228.895,95.430 233.000,95.500" strokeWidth="4.138" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 233.000,95.500 C 236.929,97.228 237.050,96.850 241.000,98.500" strokeWidth="3.854" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 241.000,98.500 C 245.017,99.438 244.929,99.728 249.000,100.500" strokeWidth="3.753" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 249.000,100.500 C 252.500,101.500 252.517,101.438 256.000,102.500" strokeWidth="3.881" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 256.000,102.500 C 259.668,103.112 259.500,103.500 263.000,104.500" strokeWidth="3.921" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 263.000,104.500 C 265.716,105.723 265.668,105.612 268.000,107.500" strokeWidth="4.060" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 268.000,107.500 C 271.563,109.095 270.216,109.223 272.000,111.500" strokeWidth="4.565" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 272.000,111.500 C 271.775,115.456 272.563,114.595 270.000,118.500" strokeWidth="4.801" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 270.000,118.500 C 267.597,121.103 268.275,121.456 265.000,123.500" strokeWidth="4.134" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 265.000,123.500 C 261.318,127.452 261.097,127.103 257.000,130.500" strokeWidth="3.639" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 257.000,130.500 C 252.601,133.200 252.818,133.452 248.000,135.500" strokeWidth="3.543" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 248.000,135.500 C 242.618,138.301 242.601,138.200 237.000,140.500" strokeWidth="3.299" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 237.000,140.500 C 231.048,142.659 231.118,142.801 225.000,144.500" strokeWidth="3.247" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 225.000,144.500 C 219.581,146.437 219.548,146.159 214.000,147.500" strokeWidth="3.330" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 214.000,147.500 C 209.010,148.205 209.081,148.437 204.000,148.500" strokeWidth="3.416" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 204.000,148.500 C 200.500,148.500 200.510,148.705 197.000,148.500" strokeWidth="3.795" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 197.000,148.500 C 193.419,149.709 194.000,148.500 191.000,148.500" strokeWidth="4.422" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 191.000,148.500 C 187.621,146.399 188.419,147.209 187.000,143.500" strokeWidth="4.898" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 187.000,143.500 C 186.266,138.464 186.121,139.399 188.000,134.500" strokeWidth="4.549" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 188.000,134.500 C 190.566,130.530 189.766,130.464 194.000,127.500" strokeWidth="3.878" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 194.000,127.500 C 199.262,123.134 199.066,123.030 205.000,119.500" strokeWidth="3.318" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 205.000,119.500 C 214.157,113.307 214.262,113.634 224.000,108.500" strokeWidth="2.593" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 224.000,108.500 C 236.006,103.515 235.657,102.807 248.000,98.500" strokeWidth="2.323" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 248.000,98.500 C 263.494,91.985 263.506,92.015 279.000,85.500" strokeWidth="2.001" stroke="#edff66" strokeLinecap="round"/>
          <path className="sig-path" d="M 279.000,85.500 C 290.933,80.327 290.994,80.485 303.000,75.500" strokeWidth="2.098" stroke="#edff66" strokeLinecap="round"/>
        </svg>
      </div>

      {/* ── Chat Panel ── */}
      <div
        ref={chatRef}
        data-lenis-prevent
        className="fixed z-[200] flex flex-col w-[90vw] max-w-[640px] h-[70vh] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-black/15"
        style={{ visibility: 'hidden', pointerEvents: 'none', opacity: 0, backgroundColor: '#1a1a18', border: '1px solid #262624', top: 'calc(50% - min(35vh, 300px))', left: 'calc(50% - min(45vw, 320px))' }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #262624' }}>
          <div className="flex items-center gap-3">
            <CloverIcon size={30} color="#fffffc" />
            <div>
              <span className="font-robert-regular text-sm font-medium text-[#fffffc] block leading-tight">Clover</span>
              <span className="text-[10px] text-green-400/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </span>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="w-8 h-8 rounded-lg flex-center text-[#7f7f73] hover:text-[#fffffc] hover:bg-black/5 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={chatMessagesRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'ai' && (
                <div className="shrink-0 mt-0.5">
                  <CloverIcon size={22} color="#fffffc" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                msg.role === 'user'
                  ? 'text-[#fffffc] rounded-br-md border-[#262624]'
                  : 'text-[#9a9a8e] rounded-bl-md border-[#262624]'
              }`} style={{ backgroundColor: msg.role === 'user' ? '#262624' : '#21211f' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-3 flex-row">
              <div className="shrink-0 mt-0.5">
                <CloverIcon size={22} loading color="#fffffc" />
              </div>
              <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm border border-[#262624]" style={{ backgroundColor: '#21211f' }}>
                <span className="shimmer-text">Thinking</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: '#262624', border: '1px solid #333330' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Ask about Navtej..."
              className="flex-1 bg-transparent text-sm text-[#fffffc] placeholder-[#7f7f73] outline-none font-robert-regular"
            />
            <button
              onClick={handleChatSend}
              className="w-8 h-8 rounded-lg bg-yellow-300 hover:bg-yellow-200 flex-center transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;
