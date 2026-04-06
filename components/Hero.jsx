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

const WIDGETS = [
  { src: '/widgets/dna.html', title: 'Game of Life', label: 'Game of Life' },
  { src: '/widgets/quantum.html', title: 'Quantum Network', label: 'Quantum Network' },
  { src: '/widgets/blackhole.html', title: 'Black Hole', label: 'Black Hole' },
  { src: '/widgets/neuron.html', title: 'Neuron', label: 'Neural Synapse' },
  { src: '/widgets/morphology.html', title: 'Morphology', label: 'Morphology' },
];

const Hero = () => {
  const dark = false;
  const [loading, setLoading] = useState(true);
  const [coloradoTime, setColoradoTime] = useState('');

  const [heroReady, setHeroReady] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState(0);

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
  }, []);

  // Fallback: dismiss loader after 3s
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // ── Listen for hero-ready to defer widgets ──
  useEffect(() => {
    const onReady = () => setHeroReady(true);
    window.addEventListener('hero-ready', onReady);
    return () => window.removeEventListener('hero-ready', onReady);
  }, []);

  // ── Stagger widget loading after hero is ready ──
  useEffect(() => {
    if (!heroReady) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleWidgets(count);
      if (count >= WIDGETS.length) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [heroReady]);

  // ── Broadcast theme to widget iframes ──
  useEffect(() => {
    const msg = { theme: 'light' };
    const iframes = document.querySelectorAll('iframe[data-widget]');
    iframes.forEach((f) => f.contentWindow?.postMessage(msg, '*'));
    const handler = (e) => {
      if (e.data?.type === 'widget-ready' && e.source) {
        e.source.postMessage(msg, '*');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
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
        stroke: '#181816',
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
      fill: '#181816',
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

      // Trapezoid frame entrance
      gsap.set('#video-frame', {
        opacity: 1,
        clipPath: 'polygon(14% 0%, 72% 0%, 88% 90%, 0% 95%)',
        scale: 0.6,
        willChange: 'clip-path, transform',
      });
      tl.to('#video-frame', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
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

  // ── Trapezoid scroll animation ──
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#f8f8f6]">

      {/* ── Loading Screen ── */}
      <div
        ref={loaderRef}
        className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden"
        style={{ backgroundColor: '#f8f8f6' }}
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
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-[#f8f8f6]"
        style={{ opacity: 0 }}
      >

      {/* ── HelmetReveal: face/skeleton + contour bg + brush ── */}
      <HelmetReveal dark={dark} />

      {/* ── 5 Interactive 3D Widgets (deferred + staggered after hero-ready) ── */}
      {heroReady && WIDGETS.slice(0, visibleWidgets).map((w, i) => {
        const positions = [
          { top: '50%', left: '-2%',  ty: '-50%' },
          { top: '8%',  left: '10%' },
          { top: '-2%', left: '50%', tx: '-50%' },
          { top: '8%',  right: '10%' },
          { top: '50%', right: '-2%', ty: '-50%' },
        ];
        const p = positions[i];
        return (
          <div
            key={w.title}
            className="group absolute z-[12] pointer-events-auto hidden sm:block w-[180px] h-[180px] sm:w-[280px] sm:h-[280px]"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              transform: `translate(${p.tx || '0'}, ${p.ty || '0'})`,
            }}
          >
            <iframe
              src={w.src}
              data-widget
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'transparent',
                border: 'none',
                WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 65%)',
                maskImage: 'radial-gradient(circle at center, black 25%, transparent 65%)',
              }}
              title={w.title}
              loading="lazy"
              allowTransparency
              onLoad={(e) => {
                e.target.contentWindow?.postMessage(
                  { theme: dark ? 'dark' : 'light' }, '*'
                );
              }}
            />
            {/* Curved arc label on hover */}
            <svg
              className="absolute left-0 w-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ top: '70%', height: '40px' }}
              viewBox="0 0 200 40"
              overflow="visible"
            >
              <defs>
                <path
                  id={`arc-${i}`}
                  d="M 20,5 A 100,100 0 0,0 180,5"
                  fill="none"
                />
              </defs>
              <text
                className="select-none"
                fill={dark ? 'rgba(232,230,225,0.7)' : 'rgba(26,26,26,0.7)'}
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.15em"
                textAnchor="middle"
              >
                <textPath href={`#arc-${i}`} startOffset="50%">
                  {w.label.toUpperCase()}
                </textPath>
              </text>
            </svg>
          </div>
        );
      })}

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
          <a href="mailto:navmainemail@gmail.com" className="group relative inline-block cursor-pointer">
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
              <span className="relative inline-flex overflow-hidden">
                <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Read my blog
                </span>
                <span className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
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
          <CloverIcon size={20} loading color="#181816" />
        </button>
      </div>

      </div>{/* end #video-frame */}

      {/* ── Chat Panel ── */}
      <div
        ref={chatRef}
        data-lenis-prevent
        className="fixed z-[200] flex flex-col w-[90vw] max-w-[640px] h-[70vh] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-black/15"
        style={{ visibility: 'hidden', pointerEvents: 'none', opacity: 0, backgroundColor: '#ffffff', border: '1px solid #d0d0c6', top: 'calc(50% - min(35vh, 300px))', left: 'calc(50% - min(45vw, 320px))' }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #d0d0c6' }}>
          <div className="flex items-center gap-3">
            <CloverIcon size={30} color="#181816" />
            <div>
              <span className="font-robert-regular text-sm font-medium text-[#181816] block leading-tight">Clover</span>
              <span className="text-[10px] text-green-400/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </span>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="w-8 h-8 rounded-lg flex-center text-[#8a8a7e] hover:text-[#181816] hover:bg-black/5 transition-all"
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
                  <CloverIcon size={22} color="#181816" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                msg.role === 'user'
                  ? 'text-[#181816] rounded-br-md border-[#d0d0c6]'
                  : 'text-[#5a5a50] rounded-bl-md border-[#d0d0c6]'
              }`} style={{ backgroundColor: msg.role === 'user' ? '#f0f0ec' : '#f8f8f6' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-3 flex-row">
              <div className="shrink-0 mt-0.5">
                <CloverIcon size={22} loading color="#181816" />
              </div>
              <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm border border-[#d0d0c6]" style={{ backgroundColor: '#f8f8f6' }}>
                <span className="shimmer-text">Thinking</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: '#f0f0ec', border: '1px solid #d0d0c6' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Ask about Navtej..."
              className="flex-1 bg-transparent text-sm text-[#181816] placeholder-[#8a8a7e] outline-none font-robert-regular"
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
