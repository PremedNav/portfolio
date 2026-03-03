'use client';

import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CLOVER_PATH =
  'M1675.37 130.687C1796.88 117.897 1895.22 172.947 1991.32 238.845C2022.4 260.158 2054.23 284.254 2091.96 291.93C2155.16 304.787 2213.46 255.503 2262.94 223.089C2358.1 160.754 2474.56 118.923 2589.05 143.485C2697.07 166.658 2783.81 234.884 2843.17 326.636C2907.12 425.499 2940.04 545.104 2924.51 662.718C2900.3 846.207 2794.55 986.749 2662.3 1108.52C2602.72 1163.38 2540.69 1214.11 2485.77 1274.04C2406.37 1360.65 2343.12 1470.81 2318.75 1586.25C2312.12 1617.66 2300.48 1677.64 2320.62 1706.28C2325.47 1713.18 2332.52 1716.94 2340.8 1718.13C2372.79 1722.72 2416.25 1697.19 2442.75 1681.9C2569.76 1608.63 2662.9 1482.01 2727.41 1353C2750.33 1307.17 2769.79 1259.53 2791.29 1213.01C2852.93 1079.63 2928.82 957.434 3051.02 871.227C3163.2 792.085 3296.19 758.028 3432.2 782.454C3546.06 802.9 3654.95 860.22 3721.61 956.803C3788.79 1054.12 3802.24 1173.28 3783.09 1287.76C3777.41 1321.7 3767.48 1354.77 3761.53 1388.66C3742.01 1500.05 3795.17 1525.61 3869.08 1591.66C3902.39 1621.56 3932.13 1655.22 3957.7 1691.98C4018.99 1778.36 4043.12 1885.69 4024.69 1989.99C4001.92 2114.74 3918.31 2223.3 3814.83 2293.63C3739.06 2344.41 3651.46 2374.78 3560.52 2381.79C3398.96 2394.15 3246.47 2337.22 3107.03 2261.58C2997.8 2202.33 2889.54 2142.52 2765.28 2121.78C2676.83 2107.02 2560.88 2094.25 2479.57 2138.85C2453.18 2153.31 2472.3 2190.25 2486.12 2206.59C2576.37 2313.35 2725.9 2383.59 2861.78 2408.48C2956.98 2422.24 3053.21 2431.04 3149.02 2440.97C3461.48 2473.34 3760.05 2729.39 3708.05 3072.46C3696.96 3141.47 3667.6 3206.25 3623.01 3260.08C3546.91 3351.75 3440.69 3395.71 3325.01 3412.72C3267 3421.24 3190.6 3414.58 3145.76 3455.06C3111.05 3486.39 3093.8 3539.56 3075.63 3582.7C3040.15 3669.26 2986.19 3747.36 2909.08 3802.18C2695.81 3953.8 2404.92 3856.63 2262.11 3654.94C2148.85 3494.97 2129.25 3307.34 2166.4 3119.48C2180.61 3047.6 2200.09 2978.2 2211.98 2906.46C2213.7 2893.68 2215.74 2880.93 2217.24 2867.92C2232.87 2732.24 2207.57 2561.56 2126.73 2449.34C2065.73 2364.67 2000.77 2534.81 1987.1 2577.12C1946.6 2702.52 1943.07 2834.44 1972.2 2962.89C2014.43 3135.25 2047.86 3289.75 1999.23 3465.19C1927.16 3725.19 1673.22 3918.37 1399.03 3856.2C1245.7 3821.43 1131.65 3683.38 1083.11 3539.26C1045.41 3427.37 1003.68 3413.29 891.422 3404.82C650.411 3386.63 452.42 3228.09 462.585 2971.01C466.718 2853.75 510.216 2741.31 586.066 2651.79C715.521 2501.12 893.472 2440.68 1085.54 2421.66C1167.23 2413.57 1255.56 2410.01 1335.81 2395.3C1453.31 2372.5 1570.54 2318.17 1659.66 2237.88C1686.21 2213.97 1744.2 2155.84 1696.43 2125.88C1671.85 2110.46 1621.79 2102.61 1593.48 2100.32C1461.57 2089.67 1328.94 2120.81 1209.34 2175.53C1157.83 2199.1 1108.85 2228.2 1058.64 2254.31C947.2 2312.63 825.607 2360.11 698.851 2365.82C550.972 2372.02 408.288 2325.78 299.806 2222.52C193.209 2121.05 129.407 1980.75 156.801 1831.72C174.793 1733.84 229.142 1651.22 301.583 1584.14C333.372 1554.71 369.44 1531.09 400.111 1500.49C456.629 1444.11 439.311 1369.75 425.255 1300.08C405.974 1205.06 407.497 1108.34 442.136 1017.14C506.363 848.027 675.469 765.759 849.15 759.782C1117.63 750.544 1317.62 969.471 1408.56 1201.87C1455.06 1322.99 1505.66 1439.9 1590.72 1539.67C1646.97 1607.04 1717.78 1668.7 1799.07 1703.3C1808.91 1707.49 1827.89 1711.83 1838.39 1712.3C1887.81 1714.53 1874.11 1625.04 1869.12 1595.86C1847.81 1471.16 1786.79 1354.89 1704.42 1259.64C1651.32 1198.24 1590.59 1145.34 1532.71 1088.67C1416.77 975.397 1320.54 833.934 1298.23 669.994C1280.37 536.269 1316.85 400.962 1399.53 294.352C1470.9 200.592 1557.73 146.294 1675.37 130.687Z';

const LAYERS = [
  { y: 28, xs: [34, 44, 56, 66] },
  { y: 44, xs: [26, 36, 46, 56, 66, 76] },
  { y: 60, xs: [22, 32, 42, 52, 62, 72, 82] },
  { y: 76, xs: [26, 36, 46, 56, 66, 76] },
  { y: 92, xs: [34, 44, 56, 66] },
  { y: 108, xs: [42, 52, 62] },
];

const OUTPUT_Y = 126;
const OUTPUT_X = 52;
const CLOVER_SIZE = 7;

// 3Blue1Brown convention: blue = positive, red = negative
const POS_COLOR = '#5B8DEF';
const NEG_COLOR = '#EF5350';

// Base and peak opacity per layer (neurons glow when activated)
const LAYER_BASE = [0.18, 0.2, 0.22, 0.2, 0.18, 0.22];
const LAYER_PEAK = [0.7, 0.8, 0.9, 0.8, 0.7, 0.85];

const srand = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const weight = (i) => srand(i) * 2 - 1;

export default function CloverAnimation() {
  const ref = useRef(null);

  // Pre-compute edges with individual weights (color + thickness)
  const { edges, outputEdges } = useMemo(() => {
    const edges = [];
    let ei = 0;
    for (let i = 0; i < LAYERS.length - 1; i++) {
      LAYERS[i].xs.forEach((x1) => {
        LAYERS[i + 1].xs.forEach((x2) => {
          const w = weight(ei);
          const mag = Math.abs(w);
          edges.push({
            x1, y1: LAYERS[i].y, x2, y2: LAYERS[i + 1].y,
            li: i,
            color: w >= 0 ? POS_COLOR : NEG_COLOR,
            strokeWidth: 0.05 + mag * 0.18,
          });
          ei++;
        });
      });
    }

    const lastLayer = LAYERS[LAYERS.length - 1];
    const outputEdges = lastLayer.xs.map((x1, i) => {
      const w = weight(ei + i + 500);
      const mag = Math.abs(w);
      return {
        x1, y1: lastLayer.y, x2: OUTPUT_X, y2: OUTPUT_Y,
        color: w >= 0 ? POS_COLOR : NEG_COLOR,
        strokeWidth: 0.05 + mag * 0.18,
      };
    });

    return { edges, outputEdges };
  }, []);

  useGSAP(() => {
    // 3 overlapping forward passes — activations propagate layer by layer
    // Like watching a real NN compute: data flows input → hidden → output
    for (let p = 0; p < 3; p++) {
      const tl = gsap.timeline({ repeat: -1, delay: p * 0.6 });

      LAYERS.forEach((_, li) => {
        const t = li * 0.2;

        // Neurons in this layer activate
        tl.to(`.cn-l${li}`, {
          opacity: LAYER_PEAK[li],
          duration: 0.25,
          ease: 'sine.in',
        }, t);
        tl.to(`.cn-l${li}`, {
          opacity: LAYER_BASE[li],
          duration: 0.4,
          ease: 'sine.out',
        }, t + 0.25);

        // Edges between this layer and next light up
        if (li < LAYERS.length - 1) {
          tl.to(`.cn-e${li}`, {
            opacity: 0.22,
            duration: 0.2,
            ease: 'sine.in',
          }, t + 0.06);
          tl.to(`.cn-e${li}`, {
            opacity: 0.04,
            duration: 0.35,
            ease: 'sine.out',
          }, t + 0.26);
        }
      });

      // Signal reaches output
      const outT = LAYERS.length * 0.2;
      tl.to('.cn-elast', {
        opacity: 0.22,
        duration: 0.2,
        ease: 'sine.in',
      }, outT);
      tl.to('.cn-elast', {
        opacity: 0.04,
        duration: 0.35,
        ease: 'sine.out',
      }, outT + 0.2);

      // Clover glows when data arrives
      tl.to('.cn-clover', {
        opacity: 1,
        duration: 0.25,
        ease: 'sine.in',
      }, outT + 0.08);
      tl.to('.cn-clover', {
        opacity: 0.55,
        duration: 0.4,
        ease: 'sine.out',
      }, outT + 0.33);
    }
  }, { scope: ref });

  return (
    <div ref={ref} className="size-full bg-black">
      <svg
        viewBox="0 0 104 140"
        className="size-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Weighted connections — blue = positive, red = negative */}
        {edges.map((e, i) => (
          <line
            key={i}
            className={`cn-e${e.li}`}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.color}
            strokeWidth={e.strokeWidth}
            opacity="0.04"
          />
        ))}

        {/* Connections to output */}
        {outputEdges.map((e, i) => (
          <line
            key={`o${i}`}
            className="cn-elast"
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.color}
            strokeWidth={e.strokeWidth}
            opacity="0.04"
          />
        ))}

        {/* Neurons — grouped by layer for forward-pass animation */}
        {LAYERS.map((l, li) =>
          l.xs.map((x, ni) => (
            <circle
              key={`${li}-${ni}`}
              className={`cn-l${li}`}
              cx={x} cy={l.y}
              r={1.1}
              fill="white"
              opacity={LAYER_BASE[li]}
            />
          ))
        )}

        {/* Clover output node */}
        <g className="cn-clover" opacity="0.55">
          <circle
            cx={OUTPUT_X} cy={OUTPUT_Y}
            r={CLOVER_SIZE + 1.5}
            fill="none" stroke="white" strokeWidth="0.25" opacity="0.35"
          />
          <svg
            x={OUTPUT_X - CLOVER_SIZE}
            y={OUTPUT_Y - CLOVER_SIZE}
            width={CLOVER_SIZE * 2}
            height={CLOVER_SIZE * 2}
            viewBox="100 80 3900 3900"
          >
            <path fill="white" d={CLOVER_PATH} />
          </svg>
        </g>
      </svg>
    </div>
  );
}
