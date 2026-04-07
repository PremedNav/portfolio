export interface LabExperiment {
  slug: string;
  title: string;
  description: string;
  src: string;
  tags: string[];
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    slug: 'particle-life',
    title: 'Particle Life',
    description: 'Built on Jeffrey Ventrella\'s Clusters concept — I extended the original particle life rules with a text-targeting system where 1,800 particles across six species swarm into letterforms using only pairwise force functions. No pathfinding, no physics engine. I added randomized attraction/repulsion matrices and tuned the damping and force radii to keep formations stable without losing the organic emergent behavior.',
    src: '/widgets/particlelife.html?v=5',
    tags: ['AI'],
  },
  {
    slug: 'game-of-life',
    title: 'Game of Life',
    description: 'Conway\'s 1970 cellular automaton — I rewrote the simulation from scratch using double-buffered Uint8Arrays on a 300\u00D7300 toroidal grid, replacing the typical nested-array approach with a pre-built 512-entry neighbor lookup table and direct putImageData rendering. The result is a zero-dependency implementation that holds 60fps with smooth cell aging colors.',
    src: '/widgets/dna.html?v=3',
    tags: ['Canvas 2D'],
  },
  {
    slug: 'quantum-network',
    title: 'Quantum Network',
    description: 'Inspired by quantum entanglement visualizations — I built a proximity-based particle network where connections form and break based on distance thresholds, with cursor interaction simulating the observer effect. I added velocity-dependent color shifting and adaptive connection opacity so the graph structure reads clearly even at high particle counts.',
    src: '/widgets/quantum.html',
    tags: ['WebGL'],
  },
  {
    slug: 'black-hole',
    title: 'Black Hole',
    description: 'Schwarzschild black hole simulation — I wrote custom GLSL shaders for the gravitational lensing, bending background star light using the geodesic equation from general relativity rather than the typical post-process distortion trick. The accretion disk uses volumetric ray marching with Doppler shift coloring for physically-motivated visuals.',
    src: '/widgets/blackhole.html',
    tags: ['Three.js'],
  },
  {
    slug: 'neural-synapse',
    title: 'Neural Synapse',
    description: 'A 3D neural network visualization loosely based on the Hodgkin-Huxley firing model — I simplified the differential equations into a threshold-based trigger system that propagates signals along synaptic connections in real time. I added Hebbian-style connection strengthening so frequently-used pathways visually thicken over time.',
    src: '/widgets/neuron.html',
    tags: ['Three.js'],
  },
  {
    slug: 'morphology',
    title: 'Morphology',
    description: 'Shape-morphing particle system — I implemented optimal transport-style point assignment between target geometries so each particle takes the shortest path to its destination, avoiding the random scrambling you see in typical morph demos. Cursor proximity adds a repulsion field that deforms the shapes organically while they transition.',
    src: '/widgets/morphology.html',
    tags: ['WebGL'],
  },
  {
    slug: 'fluid-dynamics',
    title: 'Fluid Dynamics',
    description: 'Adapted from Pavel Dobryakov\'s WebGL fluid simulation — I reworked the color injection to use velocity-mapped gradients instead of the original\'s random splats, added vorticity confinement tuning for tighter curl patterns, and rewrote the bloom pass for smoother falloff. The core is a 20-iteration Jacobi pressure solver running entirely in fragment shaders.',
    src: '/widgets/fluid.html',
    tags: ['WebGL'],
  },
{
    slug: 'lorenz-attractor',
    title: 'Lorenz Attractor',
    description: 'Edward Lorenz\'s 1963 chaotic system (\u03C3=10, \u03C1=28, \u03B2=8/3) — I render 4,000 particles tracing the strange attractor simultaneously rather than a single trajectory, with speed-mapped color gradients that reveal how nearby initial conditions diverge exponentially. Added orbital camera controls and adaptive timestep to keep the integration stable at any zoom level.',
    src: '/widgets/lorenz.html',
    tags: ['Canvas 2D'],
  },
{
    slug: 'flow-field',
    title: 'Flow Field',
    description: 'A classic Perlin noise flow visualization — I layered two octaves of simplex noise at different frequencies and evolution rates so the field has both large-scale currents and fine turbulence. 3,000 particles trace the gradient with direction-mapped hue and a fading trail buffer that reveals the underlying flow topology over time.',
    src: '/widgets/flowfield.html',
    tags: ['Canvas 2D'],
  },
  {
    slug: 'boids-flocking',
    title: 'Boids Flocking',
    description: 'Craig Reynolds\' 1986 flocking algorithm — I rebuilt it with a spatial hash grid for O(n) neighbor lookups instead of the naive O(n\u00B2) approach, added proportional boundary steering that scales to any viewport, and tuned the separation/alignment/cohesion weights for tighter, more natural flock formations. Move your cursor to scatter them.',
    src: '/widgets/boids.html?v=3',
    tags: ['Canvas 2D'],
  },
];

export function getAllLabSlugs(): string[] {
  return LAB_EXPERIMENTS.map((e) => e.slug);
}

export function getLabExperiment(slug: string): LabExperiment | undefined {
  return LAB_EXPERIMENTS.find((e) => e.slug === slug);
}
