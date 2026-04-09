'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import AnimatedTitle from '@/components/AnimatedTitle';
import { BentoTilt, BentoCard, synthrCodeHTML } from '@/components/Features';
import dynamic from 'next/dynamic';
import ZoovAnimation from '@/components/ZoovAnimation';
import CloverAnimation from '@/components/CloverAnimation';

const RiveAnimation = dynamic(() => import('@/components/RiveAnimation'), { ssr: false });
import {
  FaUserMd, FaFlask, FaEye, FaBriefcase, FaUsers,
  FaHeart, FaHandsHelping, FaChevronDown, FaGripVertical,
  FaCalendarAlt, FaMapMarkerAlt, FaUserTie, FaGraduationCap,
  FaStar, FaRegStar, FaCode, FaChalkboardTeacher, FaMusic, FaBook,
  FaStethoscope, FaPen, FaUniversity,
} from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { TiLocationArrow } from 'react-icons/ti';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ───────────────────────────────────────────────────────────────────

interface Activity {
  title: string;
  hours: number;
  role?: string;
  contact?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  ongoing?: boolean;
  description?: string;
  meaningfulEssay?: string;
  mostMeaningful?: boolean;
}

interface Category {
  id: string;
  name: string;
  hours: number;
  icon: React.ReactNode;
  activities: Activity[];
}

interface Course {
  code: string;
  title: string;
  credits: number;
  grade: string; // 'A', 'A-', 'B+', 'IP' for in-progress
  honors?: boolean;
}

interface Semester {
  term: string;
  gpa: number;
  credits: number;
  deanslist: boolean;
  inProgress?: boolean;
  courses: Course[];
}

interface APCredit {
  exam: string;
  equivalent: string;
  credits: number;
}


// ─── Academic Data ───────────────────────────────────────────────────────────

const AP_CREDITS: APCredit[] = [
  { exam: 'English Literature & Composition', equivalent: 'ENGL 1999AE', credits: 3 },
  { exam: 'English Language & Composition', equivalent: 'ENGL 1020', credits: 3 },
  { exam: 'Environmental Science', equivalent: 'ENVS 1044 + 1045', credits: 4 },
  { exam: 'Mathematics: Calculus AB', equivalent: 'MATH 1401', credits: 4 },
  { exam: 'Statistics', equivalent: 'MATH 2830', credits: 3 },
  { exam: 'AP World History: Modern', equivalent: 'HIST 1016 + 1026', credits: 6 },
];

const SEMESTERS: Semester[] = [
  {
    term: 'Fall 2023', gpa: 3.980, credits: 15, deanslist: true,
    courses: [
      { code: 'BIOL 2010', title: 'Organisms to Ecosystems', credits: 3, grade: 'A' },
      { code: 'BIOL 2011', title: 'Organisms to Ecosystems Lab', credits: 1, grade: 'A' },
      { code: 'CHEM 2031', title: 'General Chemistry I', credits: 3, grade: 'A' },
      { code: 'CHEM 2038', title: 'General Chemistry Lab I', credits: 1, grade: 'A-' },
      { code: 'PSYC 1000', title: 'Introduction to Psychology I', credits: 3, grade: 'A' },
      { code: 'UNHL 1100', title: 'The Life of the Mind', credits: 3, grade: 'A', honors: true },
      { code: 'UNHL 2755', title: 'First Year Seminar', credits: 1, grade: 'A', honors: true },
    ],
  },
  {
    term: 'Spring 2024', gpa: 4.000, credits: 16, deanslist: true,
    courses: [
      { code: 'BIOL 2020', title: 'Molecules to Cells (Gen Bio)', credits: 3, grade: 'A' },
      { code: 'BIOL 2021', title: 'Molecules to Cells Lab', credits: 1, grade: 'A' },
      { code: 'CHEM 2061', title: 'General Chemistry II', credits: 3, grade: 'A' },
      { code: 'CHEM 2068', title: 'General Chemistry Lab II', credits: 2, grade: 'A' },
      { code: 'COMM 1001', title: 'Presentations and Civic Life', credits: 3, grade: 'A' },
      { code: 'ENGL 2030', title: 'Core Composition II', credits: 3, grade: 'A' },
      { code: 'UNHL 2755', title: 'First Year Seminar', credits: 1, grade: 'A', honors: true },
    ],
  },
  {
    term: 'Summer 2024', gpa: 4.000, credits: 6, deanslist: true,
    courses: [
      { code: 'PSYC 1005', title: 'Introduction to Psychology II', credits: 3, grade: 'A' },
      { code: 'SOCY 1001', title: 'Understanding Social World', credits: 3, grade: 'A' },
    ],
  },
  {
    term: 'Fall 2024', gpa: 4.000, credits: 17, deanslist: true,
    courses: [
      { code: 'BIOL 3445', title: 'Introduction to Evolution', credits: 3, grade: 'A' },
      { code: 'BIOL 3611', title: 'General Cell Biology', credits: 3, grade: 'A' },
      { code: 'CHEM 3411', title: 'Organic Chemistry I', credits: 4, grade: 'A' },
      { code: 'CHEM 3418', title: 'Organic Chemistry Lab I', credits: 1, grade: 'A' },
      { code: 'ENGL 3154', title: 'Technical Writing', credits: 3, grade: 'A' },
      { code: 'UNHL 3170', title: 'Anti-Transgender Legislation', credits: 3, grade: 'A', honors: true },
    ],
  },
  {
    term: 'Spring 2025', gpa: 4.000, credits: 18, deanslist: true,
    courses: [
      { code: 'BIOL 3832', title: 'General Genetics', credits: 3, grade: 'A' },
      { code: 'CHEM 3421', title: 'Organic Chemistry II', credits: 4, grade: 'A' },
      { code: 'CHEM 3428', title: 'Organic Chemistry Lab II', credits: 1, grade: 'A' },
      { code: 'MATH 1401', title: 'Calculus I', credits: 4, grade: 'A' },
      { code: 'UNHL 3999', title: 'Personal & Political Security', credits: 3, grade: 'A', honors: true },
      { code: 'UNHL 3999', title: 'Law, Public Health & Injustice', credits: 3, grade: 'A', honors: true },
    ],
  },
  {
    term: 'Summer 2025', gpa: 4.000, credits: 6, deanslist: true,
    courses: [
      { code: 'MATH 2830', title: 'Introductory Statistics', credits: 3, grade: 'A' },
      { code: 'UNHL 3999', title: 'Special Topics UNHL', credits: 3, grade: 'A', honors: true },
    ],
  },
  {
    term: 'Fall 2025', gpa: 3.860, credits: 15, deanslist: true,
    courses: [
      { code: 'BIOL 3226', title: 'Human Physiology', credits: 3, grade: 'A' },
      { code: 'BIOL 3227', title: 'Human Physiology Lab', credits: 1, grade: 'A' },
      { code: 'BIOL 3411', title: 'Principles of Ecology', credits: 3, grade: 'A' },
      { code: 'CHEM 4810', title: 'General Biochemistry I', credits: 3, grade: 'B+' },
      { code: 'PHYS 2010', title: 'College Physics I', credits: 4, grade: 'A' },
      { code: 'PHYS 2321', title: 'Intro Experimental Phys Lab I', credits: 1, grade: 'A' },
    ],
  },
  {
    term: 'Spring 2026', gpa: 0, credits: 14, deanslist: false, inProgress: true,
    courses: [
      { code: 'BIOL 4165', title: 'Neurobiology', credits: 3, grade: 'IP' },
      { code: 'BIOL 4440', title: 'Ethnobotany', credits: 3, grade: 'IP' },
      { code: 'CHEM 4820', title: 'General Biochemistry II', credits: 3, grade: 'IP' },
      { code: 'PHYS 2020', title: 'College Physics II', credits: 4, grade: 'IP' },
      { code: 'PHYS 2341', title: 'Intro Experimental Phys Lab II', credits: 1, grade: 'IP' },
    ],
  },
];

const ACADEMICS = {
  cumGPA: 3.974,
  totalCredits: 125,
  cuCredits: 93,
  transferCredits: 32,
  apCredits: 23,
  ccaCredits: 9,
  deansListCount: 7,
  university: 'University of Colorado Denver',
  college: 'College of Liberal Arts & Sciences',
  major: 'Biology',
  minor: 'Honors and Leadership',
  prevMajor: 'Biochemistry',
};

// ─── AMCAS GPA Calculations (BCPM vs AO) ────────────────────────────────────

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

const BCPM_PREFIXES = ['BIOL', 'CHEM', 'PHYS', 'MATH'];

function isBCPM(code: string): boolean {
  const prefix = code.split(/\s+/)[0];
  return BCPM_PREFIXES.includes(prefix);
}

function computeGPAs() {
  let bcpmQP = 0, bcpmCr = 0, aoQP = 0, aoCr = 0;
  for (const sem of SEMESTERS) {
    for (const c of sem.courses) {
      const pts = GRADE_POINTS[c.grade];
      if (pts === undefined) continue; // skip IP, W, etc.
      const qp = pts * c.credits;
      if (isBCPM(c.code)) { bcpmQP += qp; bcpmCr += c.credits; }
      else { aoQP += qp; aoCr += c.credits; }
    }
  }
  return {
    bcpm: bcpmCr > 0 ? +(bcpmQP / bcpmCr).toFixed(3) : 0,
    ao: aoCr > 0 ? +(aoQP / aoCr).toFixed(3) : 0,
    bcpmCredits: bcpmCr,
    aoCredits: aoCr,
  };
}

const AMCAS_GPAS = computeGPAs();

// ─── School List Data ────────────────────────────────────────────────────────

interface School {
  name: string;
  location: string;
  mcat: number;
  gpa: number;
  logo?: string; // filename in /img/school-icons/
}

interface SchoolTier {
  label: string;
  color: string;     // Tailwind color token (rose, yellow, emerald)
  bgPill: string;    // pill bg class
  textPill: string;  // pill text class
  schools: School[];
}

const SCHOOL_LIST: SchoolTier[] = [
  {
    label: 'Reach',
    color: 'rose',
    bgPill: 'bg-rose-400/15',
    textPill: 'text-rose-400',
    schools: [
      { name: 'Harvard Medical School', location: 'Boston, MA', mcat: 520, gpa: 3.9, logo: 'harvard.svg' },
      { name: 'UCSF School of Medicine', location: 'San Francisco, CA', mcat: 519, gpa: 3.85, logo: 'ucsf.svg' },
      { name: 'Johns Hopkins SOM', location: 'Baltimore, MD', mcat: 521, gpa: 3.93, logo: 'johns_hopkins.svg' },
      { name: 'Columbia VP&S', location: 'New York, NY', mcat: 521, gpa: 3.9, logo: 'columbia.svg' },
      { name: 'Duke SOM', location: 'Durham, NC', mcat: 520, gpa: 3.88, logo: 'duke.svg' },
      { name: 'UPenn Perelman SOM', location: 'Philadelphia, PA', mcat: 522, gpa: 3.93, logo: 'upenn.svg' },
      { name: 'NYU Grossman SOM', location: 'New York, NY', mcat: 522, gpa: 3.96, logo: 'nyu.svg' },
      { name: 'Stanford SOM', location: 'Stanford, CA', mcat: 519, gpa: 3.89, logo: 'stanford.svg' },
      { name: 'WashU SOM', location: 'St. Louis, MO', mcat: 522, gpa: 3.95, logo: 'washu.svg' },
      { name: 'U of Michigan Med', location: 'Ann Arbor, MI', mcat: 519, gpa: 3.87, logo: 'michigan.svg' },
      { name: 'Yale SOM', location: 'New Haven, CT', mcat: 521, gpa: 3.9, logo: 'yale.svg' },
      { name: 'Mayo Clinic Alix SOM', location: 'Rochester, MN', mcat: 521, gpa: 3.93, logo: 'mayo.svg' },
    ],
  },
  {
    label: 'Target',
    color: 'yellow',
    bgPill: 'bg-yellow-300/15',
    textPill: 'text-yellow-300',
    schools: [
      { name: 'Icahn SOM at Mt. Sinai', location: 'New York, NY', mcat: 520, gpa: 3.87, logo: 'icahn.svg' },
      { name: 'Northwestern Feinberg', location: 'Chicago, IL', mcat: 520, gpa: 3.91, logo: 'northwestern.svg' },
      { name: 'Weill Cornell Medicine', location: 'New York, NY', mcat: 520, gpa: 3.9, logo: 'weill_cornell.svg' },
      { name: 'UChicago Pritzker SOM', location: 'Chicago, IL', mcat: 521, gpa: 3.92, logo: 'pritzker.svg' },
      { name: 'Case Western Reserve', location: 'Cleveland, OH', mcat: 518, gpa: 3.82, logo: 'case_western.svg' },
      { name: 'Brown Alpert Med', location: 'Providence, RI', mcat: 517, gpa: 3.79, logo: 'brown.svg' },
      { name: 'BU Chobanian & Avedisian', location: 'Boston, MA', mcat: 518, gpa: 3.82, logo: 'boston_university.svg' },
    ],
  },
  {
    label: 'Baseline',
    color: 'emerald',
    bgPill: 'bg-emerald-400/15',
    textPill: 'text-emerald-400',
    schools: [
      { name: 'Albert Einstein COM', location: 'Bronx, NY', mcat: 517, gpa: 3.82, logo: 'albert_einstein.svg' },
      { name: 'Dartmouth Geisel SOM', location: 'Hanover, NH', mcat: 516, gpa: 3.78, logo: 'geisel.svg' },
      { name: 'CU Anschutz SOM', location: 'Aurora, CO', mcat: 513, gpa: 3.77, logo: 'cu_anschutz.svg' },
      { name: 'Tufts University SOM', location: 'Boston, MA', mcat: 515, gpa: 3.72, logo: 'tufts.svg' },
      { name: 'Georgetown SOM', location: 'Washington, DC', mcat: 514, gpa: 3.65, logo: 'georgetown.svg' },
      { name: 'Creighton SOM', location: 'Omaha, NE', mcat: 512, gpa: 3.78, logo: 'creighton.svg' },
    ],
  },
];

const SCHOOL_COUNT = SCHOOL_LIST.reduce((sum, tier) => sum + tier.schools.length, 0);

const PROJECT_NAMES = ['Studyur', 'Clover', 'Zoov', 'PreMeder', 'Trovex', 'Pangroup', 'Synthr', 'Histia', 'Topographify', 'Aethon', 'Rivex'];

const PROJECT_INFO: Record<string, { desc: string; ribbon: string }> = {
  Studyur: { desc: 'AI-powered study platform for maximizing learning efficiency.', ribbon: 'Under Construction' },
  Clover: { desc: 'Proprietary 12-billion parameter AI model.', ribbon: 'Not Public' },
  Zoov: { desc: 'Medical AI transcription platform for healthcare providers.', ribbon: 'Discontinued' },
  PreMeder: { desc: 'Pre-health web app for tracking applications & admissions prep.', ribbon: 'Remodeling' },
  Trovex: { desc: 'AI-powered search for files, support chat, and workflow retrieval.', ribbon: 'Under Development' },
  Pangroup: { desc: 'Nonprofit helping high school students get into dream colleges.', ribbon: 'Discontinued' },
  Synthr: { desc: 'Programming language for ML pipelines with tensor-native syntax.', ribbon: 'Complete' },
  Histia: { desc: 'AI-powered Whole-Slide Imaging for pathology analysis.', ribbon: 'Complete' },
  Topographify: { desc: 'High-resolution terrain mapping from satellite & LiDAR data.', ribbon: 'Complete' },
  Aethon: { desc: 'AI model for discovering novel biochemical mechanisms.', ribbon: 'Complete' },
  Rivex: { desc: 'AI visual inspection for robotic & packing machine maintenance.', ribbon: 'Complete' },
};

// ─── Personal Statement ──────────────────────────────────────────────────────

const PERSONAL_STATEMENT = {
  maxChars: 5300,
  text: `\u201CSit still \u2014 this always works!\u201D I sat still as my father urged, breathing in the intense scent of mustard oil while he gently rubbed it across my chest. Within days, my cough would fade. My father\u2019s confidence was absolute: \u201CTraditional remedies, Beta. Passed down for generations.\u201D In our home, this remedy was our trusted cure whenever illness arose, that is. . . until the day my nanaji (grandfather) was diagnosed with leukemia.

Eight months after Nanaji\u2019s diagnosis, the phone rang at 11 AM. I already knew. The mustard oil sat unused on his nightstand in Amritsar, 8,000 miles away. No home remedy could reach through phone lines. The day after his funeral, I stared at my father\u2019s medicine cabinet, at our amber bottle of Tiwana mustard oil. I unscrewed the cap, and it was that familiar intense scent, but now it smelled different. Not like comfort. Like limitations. As with all the questions, my father couldn\u2019t answer when I asked, \u201CWhy couldn\u2019t the doctors resolve it?\u201D In that moment, I understood: I didn\u2019t want to be limited to home remedies. I wanted to be the person with answers when home remedies weren\u2019t enough.

A year after Nanaji\u2019s passing, I started exploring medicine by volunteering at Mountain Peak Primary Care. I learned basic skills: taking vital signs, asking about the chief complaint, and doing blood work. It became routine. Four months in, \u201CBob,\u201D a man in his 50s, came in to detox with trembling hands. I roomed him, took his vitals, and then I did something that wasn\u2019t routine: I just talked to him. In between his tremors, Bob told me that drinking had taken everything away from him: his wife, his kids, his memories. He didn\u2019t just want to detox; he wanted his life back. No one had taught me to take a seat and listen, but in that moment, it felt like the most important thing I could do. I wasn\u2019t naive enough to believe one conversation changed Bob\u2019s path; he was the one who chose to go to sober living and showed up every single day. Months later, he came in for his next visit. This time, he wasn\u2019t sitting alone in the waiting room. This time, Bob had his family by his side. That day, I understood something I couldn\u2019t learn from taking vitals. Medicine isn\u2019t just about treating what\u2019s wrong; it\u2019s about helping someone fight for what\u2019s still possible.

Shadowing at Lowry Family Health Center showed me what that fight looks like from the physician\u2019s side. I met \u201CTom,\u201D a patient in his mid-40s who had alienated himself from the world: no internet, no friends, no job \u2014 just him, his mom, and a television. He believed society had no place for him. Still, he came to see Dr. Bull. He had been off multiple medications for months, dealing with chronic pain and mental health problems that left him so desperate he resorted to scrambling around his room, swallowing whatever pills he found on the ground. Where I saw a crisis, Dr. Bull saw a patient who had already made the hardest choice: showing up. She looked at him and said, \u201CWe\u2019re going to get this figured out.\u201D She didn\u2019t judge him; she met him where he was, remade his care plan, and before he left, prescribed all the medications he needed. One month later, I saw Tom again. This time, he was steady \u2014 coming back because he trusted her. Dr. Bull showed me what a physician can be at the core: the person someone turns to when they\u2019ve turned away from everyone else. That\u2019s the physician I will become \u2014 one who never lets a patient believe there\u2019s no place for them.

That understanding deepened at Dignity Hospice, where \u201CLani\u201D was one of my patients. Over the weeks, she never once brought up her diagnosis. She talked about her life: the job she stuck with for over 40 years because it was safe, not because she loved it; the trip she kept pushing back because there was always another summer; and the things she wished she could say to people no longer around to hear them. One afternoon, she stopped mid-sentence and said, \u201CI don\u2019t know when I\u2019ll be gone, but never wait like I did.\u201D Lani passed three weeks later. She was the first patient I lost. I thought about her on the drive home, the day after, and the week after that \u2014 not because I could\u2019ve done something different, but because she showed me what I\u2019ll be holding every time I open a chart. Not just a diagnosis. Someone\u2019s whole life: their stories, regrets, wisdom, and everything they never got to finish. I will carry what Lani trusted me with into every patient room I walk into \u2014 by never reducing a patient to just their chart.

From Nanaji\u2019s passing to Lani\u2019s and onwards, my understanding of what it means to be a physician has grown far beyond the answers I sought in my father\u2019s cabinet. I want to be the physician whom patients trust when they\u2019re most vulnerable; the one who sees the whole person, not just the chart; and the one who helps patients fight for what\u2019s still possible.

That amber bottle of Tiwana mustard oil still sits in my father\u2019s cabinet. I opened it recently: the same scent, same intensity. But it doesn\u2019t smell like limitations anymore. It smells like purpose. The loss that started it all; the patients who trusted me with their stories; the physicians who showed me what this work demands; and the moments I\u2019ll carry for the rest of my life \u2014 all of it has prepared me for a career in medicine.`,
};

// ─── Activity Data ───────────────────────────────────────────────────────────

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'academics',
    name: 'Academics',
    hours: 0,
    icon: <FaGraduationCap />,
    activities: [],
  },
  {
    id: 'personal-statement',
    name: 'Personal Statement',
    hours: 0,
    icon: <FaPen />,
    activities: [],
  },
  {
    id: 'schools',
    name: "Schools I'm Applying To",
    hours: 0,
    icon: <FaUniversity />,
    activities: [],
  },
  {
    id: 'projects',
    name: 'Projects',
    hours: 0,
    icon: <FaCode />,
    activities: [],
  },
  {
    id: 'volunteer-medical',
    name: 'Community Service/Volunteer – Medical/Clinical',
    hours: 990,
    icon: <FaStethoscope />,
    activities: [
      { title: 'Mountain Peak Primary Care LLC', hours: 910, role: 'Medical Assistant (Volunteer)', contact: 'Hadee Ahmadi, FNP \u00b7 (720) 710-4933', location: '9450 E Mississippi Ave, Unit B, Denver, CO 80247', startDate: '07/10/2024', ongoing: true, description: 'Volunteering at Mountain Peak Primary Care (MPPC) taught me that care begins the moment a patient walks through the door. At our Denver clinic, many patients\u2014Afghan refugees, Latino and Black families, immigrants\u2014arrive uninsured and navigating an unfamiliar system. As I greet them, take their vitals, and draw their blood, I have witnessed how a familiar phrase can transform apprehension into trust. I began teaching myself Farsi after noticing the relief on a patient\u2019s face when I offered a simple \u201CSalaam,\u201D and learned Spanish phrases to bridge the same gap. At our clinic, healthcare disparities are not just statistics in a textbook; they are the people our team cares for every day.', meaningfulEssay: '\u201CSalaam chotor asti, khub asti?\u201D \u2014 Hello, how are you? Are you good? \u2014 I greeted \u201CHamza\u201D as he approached the clinic door. I noticed him balancing on forearm crutches, struggling to open it, so I held it wide and walked inside beside him. He smiled. As I asked the intake questions, Hamza began sharing far more than required. He opened up about his life with cerebral palsy and confided how uneasy his recent physical exam results had left him. Then he told me he had walked in expecting to be judged, bracing for the stigma he had faced before. But because I greeted him in Farsi, genuinely asked about his day, and treated him as a person first, he felt safe. He let his guard down. I thanked Hamza for his trust, took careful notes on each concern, and ensured each reached his provider. I wanted his voice to carry beyond our conversation. Hamza taught me that a patient\u2019s willingness to be vulnerable is earned through the smallest gestures: holding a door open, learning someone\u2019s language, greeting them like family. Every patient deserves to feel they belong, that their fears will be heard, and that they are more than their diagnosis.', mostMeaningful: true },
      { title: 'Dignity Hospice of Colorado', hours: 126, role: 'Volunteer', contact: 'Jennifer (Volunteer Coordinator) · (720) 222-3315', location: '400 E 84th Ave, Suite W-202, Thornton, CO 80229', ongoing: true, description: '' },
    ],
  },
  {
    id: 'volunteer-nonmedical',
    name: 'Community Service/Volunteer – Not Medical/Clinical',
    hours: 165,
    icon: <FaHandsHelping />,
    activities: [
      { title: 'Dental Assistant Volunteer', hours: 136, role: 'Dental Assistant Volunteer', contact: 'Wesley Stanton, DDS · (303) 768-8137', location: 'Open and Affordable Dental, 12501 Lincoln Ave, Englewood, CO 80112', startDate: '10/14/2023', endDate: '11/16/2023', description: '' },
      { title: 'A Precious Child', hours: 18, role: 'Sort / Help Customers', contact: 'Volunteer@APreciousChild.org · (303) 466-4272', location: '7051 W 118th Ave, Broomfield, CO 80020', startDate: '11/27/2023', endDate: '06/20/2024', description: '' },
      { title: 'Urban Wildlife Information Network (UWIN)', hours: 4, contact: 'Laurel Hartley, Ph.D., Associate Professor · laurel.hartley@ucdenver.edu', location: 'Dept. of Integrative Biology, CU Denver', startDate: '10/14/2023', endDate: '10/14/2023', description: '' },
      { title: 'Research Presentation Coordinator', hours: 4, role: 'Coordinator', location: 'Salazar Student Wellness Center, CU Denver', description: '27th Annual RaCAS', startDate: '04/26/2024', endDate: '04/26/2024' },
      { title: 'Food Bank of the Rockies', hours: 3, role: 'Sorter', contact: 'Volunteer Services · (720) 715-7729', location: '10700 E 45th Ave, Denver, CO 80239', startDate: '10/04/2023', endDate: '10/04/2023', description: '' },
    ],
  },
  {
    id: 'shadowing',
    name: 'Physician Shadowing/Clinical Observation',
    hours: 480,
    icon: <FaEye />,
    activities: [
      { title: 'Denver Health Lowry Family Health Center', hours: 260, role: 'Family Medicine', contact: 'Jessica M. Bull, MD, Medical Director · (303) 602-4545', location: '1001 Yosemite St, Denver, CO 80230', startDate: '06/12/2025', ongoing: true, description: '' },
      { title: 'SPARC of Colorado (Spine, Pain & Rehabilitation Center)', hours: 220, role: 'PM&R (Physical Medicine & Rehabilitation)', contact: 'Gin-Ming Hsu, MD · (303) 282-7772', location: '2480 S Downing St, Suite 210, Denver, CO 80210', startDate: '06/09/2025', ongoing: true, description: '' },
    ],
  },
  {
    id: 'research',
    name: 'Research/Lab',
    hours: 1448,
    icon: <FaFlask />,
    activities: [
      { title: 'Duerkop Lab — Dept. of Immunology & Microbiology', hours: 1448, role: 'Research Assistant Volunteer', contact: 'PI: Breck A. Duerkop, Ph.D. · breck.duerkop@cuanschutz.edu · Mentor: Shelby E. Andersen (Ph.D. Candidate) · shelby.andersen@cuanschutz.edu', location: 'CU Anschutz Medical Campus, 12800 E 19th Ave, Aurora, CO', startDate: '08/01/2024', ongoing: true, description: 'After watching my father endure four rounds of antibiotics to clear a single H. pylori infection, I joined the Duerkop Lab at CU Anschutz to find better ways to fight resistant bacteria. I study antiphage defense systems\u2014how bacteria resist bacteriophages, viruses being developed to treat antibiotic-resistant infections. Performing the majority of our benchwork, I contributed to developing and validating the Recombinase Associated Defense Search (RADS) pipeline, which discovers new defense systems across diverse species, confirming these defenses block phage infection. I co-authored a manuscript in revision and won best poster at the 28th Annual Research and Creative Activities Symposium.', meaningfulEssay: 'Sixteen times. That\u2019s how many times I failed to clone a piece of DNA into a plasmid before I finally got it right. Each failure chipped away at me\u2014was I the problem, or was the protocol? After my sixteenth failure, my mentor Shelby looked into my eyes and said, \u201CYou have what it takes to do this right.\u201D Her words didn\u2019t hand me the answer, but she gave me the resolve to find it. I went back to step one, retracing every detail of the cloning process, questioning each and every assumption I had made. I stopped mid-protocol: the ligase. The T4 DNA ligase, the enzyme responsible for joining DNA fragments, was being denatured because I hadn\u2019t been keeping it frozen until the moment of use. A small detail, invisible until I dug into every possible variable. On the seventeenth attempt, it worked. I saw the band on the gel exactly where it needed to be\u2014one clone closer to validating the defense systems that could shape the future of phage therapy. I carry that grit into every experiment now; when something fails, I don\u2019t blindly repeat it, I slow down and question why. The Duerkop Lab has taught me that the breakthroughs patients need begin with the persistence to try a seventeenth time.', mostMeaningful: true },
      { title: '28th Annual Research & Creative Activities Symposium (RaCAS)', hours: 0, role: 'Presenter', description: 'Won best poster for Natural & Physical Sciences', location: 'CU Denver', startDate: '04/25/2025', endDate: '04/25/2025' },
    ],
  },
  {
    id: 'teaching',
    name: 'Teaching/Tutoring/Teaching Assistant',
    hours: 2344,
    icon: <FaChalkboardTeacher />,
    activities: [
      { title: 'CU Denver Learning Resources Center (LRC)', hours: 2344, role: 'Peer Tutor, Supplemental Learning Leader, Head Boost Leader', contact: 'Neecee Matthews-Bradshaw (Director) · tutorialservices@ucdenver.edu', location: 'Learning Commons, 1191 Larimer St, Denver, CO 80204', startDate: '08/23/2024', ongoing: true, description: 'When I sat in General Chemistry 1 as a freshman, I studied relentlessly but couldn\u2019t grasp the concepts until a peer tutor made everything click. Determined to give back what was given to me, I joined the Learning Resources Center (LRC) as a Peer Tutor, Supplemental Learning Leader, and Head Boost Leader across 20 courses. Whether working one-on-one with a student who is stuck, leading group sessions on the hardest of lectures, or running workshops to build foundational knowledge before the semester even starts, my approach stays the same; I share the struggles I faced with each student because the same LRC that once helped me in General Chemistry 1 is now where I help others through theirs.', meaningfulEssay: 'I\u2019ll never forget \u201CEdnan.\u201D He sat across from me in the LRC, his Organic Chemistry 1 textbook open to a page full of Infrared (IR) spectroscopy peaks, looking overwhelmed. \u201CI can\u2019t do this,\u201D he said. \u201CI\u2019ll just drop the class and try next semester.\u201D But when I looked at Ednan, I didn\u2019t see someone who couldn\u2019t do it; I saw myself freshman year in General Chemistry 1, overwhelmed and certain I wouldn\u2019t pass. I pulled out the IR cheat sheet I\u2019d made and broke the concept down piece by piece. Two weeks later, Ednan came back. \u201CI got a B+ on my exam,\u201D he told me. I felt proud, not of myself but of him. The student who was ready to drop not only stayed but succeeded. Ednan was never incapable; he was overwhelmed, a first-generation student working to help his family pay bills while navigating the hardest courses in his major. At CU Denver, where many students carry that same weight, I\u2019ve learned that \u201CI can\u2019t do this\u201D really means \u201CI don\u2019t know where to start,\u201D and I try to be the person who helps them see it, just as a tutor once did for me.', mostMeaningful: true },
    ],
  },
  {
    id: 'employment-nonmedical',
    name: 'Paid Employment – Not Medical/Clinical',
    hours: 301,
    icon: <FaBriefcase />,
    activities: [
      { title: 'Kumon Math & Reading Center of Denver — Lowry', hours: 355, role: 'Math/Reading Tutor', contact: 'Celeste Kupperbusch (Certified Instructor) · celestekupperbusch@ikumon.com · (303) 968-1025', location: '100 Spruce St, Unit 102, Denver, CO 80230', startDate: '11/01/2023', endDate: '10/14/2024', description: '' },
      { title: 'Open and Affordable Dental Parker West', hours: 141, role: 'Dental Assistant', contact: 'Wesley Stanton, DDS · (303) 768-8137', location: '12501 Lincoln Ave, Englewood, CO 80112', startDate: '11/17/2023', endDate: '01/15/2024', description: '' },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership – Not Listed Elsewhere',
    hours: 510,
    icon: <FaUsers />,
    activities: [
      { title: 'Badminton Club', hours: 230, role: 'President / Founder', contact: 'Andrea Modica (Instructor, English Dept.) · andrea.modica@ucdenver.edu', location: 'Salazar Student Wellness Center, CU Denver', startDate: '02/24/2024', ongoing: true, description: '' },
      { title: 'Minority Association of Pre-Health Students (MAPS)', hours: 160, role: 'Member → President', contact: 'ucdhealthcareers@ucdenver.edu', location: 'CU Denver', startDate: '08/15/2025', ongoing: true, description: '' },
      { title: 'CU Denver Dental Association (CUDDA)', hours: 120, role: 'Member → Co-Treasurer', contact: 'Trishia Vasquez (Pre-Health Advisor) · trishia.vasquez@ucdenver.edu', location: 'CU Denver', startDate: '08/12/2023', ongoing: true, description: '' },
      { title: 'Monopoly Club', hours: 0, role: 'Co-President', location: 'CU Denver', description: 'No meetings yet' },
    ],
  },
  {
    id: 'artistic',
    name: 'Artistic Endeavors',
    hours: 0,
    icon: <FaMusic />,
    activities: [
      { title: 'Singing', hours: 0, startDate: '04/12/2010', ongoing: true, description: '' },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    hours: 0,
    icon: <FaBook />,
    activities: [
      { title: 'Reading', hours: 0, startDate: '04/12/2012', ongoing: true, description: '' },
      { title: 'Programming', hours: 0, startDate: '06/01/2011', ongoing: true, description: '' },
    ],
  },
];

const TOTAL_HOURS = INITIAL_CATEGORIES.reduce((sum, c) => sum + c.hours, 0);

// Activity count (for display): each entry = 1 AMCAS activity, Projects = 1
const ACTIVITY_COUNT = INITIAL_CATEGORIES
  .filter(c => c.id !== 'academics' && c.id !== 'personal-statement' && c.id !== 'projects' && c.id !== 'schools')
  .reduce((sum, c) => sum + c.activities.length, 0) + 1; // +1 for Projects

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatHours(h: number): string {
  return h.toLocaleString();
}

function dateRange(a: Activity): string {
  if (!a.startDate && !a.endDate) return '';
  if (a.ongoing) return `${a.startDate} — Ongoing`;
  if (a.startDate && a.endDate) return `${a.startDate} — ${a.endDate}`;
  return a.startDate || '';
}

function gradeStyle(grade: string): string {
  switch (grade) {
    case 'A': return 'bg-green-400/15 text-green-400';
    case 'A-': return 'bg-emerald-300/15 text-emerald-300';
    case 'B+': return 'bg-yellow-300/15 text-yellow-300';
    case 'B': return 'bg-amber-300/15 text-amber-300';
    case 'IP': return 'bg-yellow-300/15 text-yellow-300';
    default: return 'bg-[#3a3a37] text-[#7f7f73]';
  }
}

function gradeLabel(grade: string): string {
  return grade === 'IP' ? 'In Progress' : grade;
}


// ─── Password Form with GSAP entrance ────────────────────────────────────────

function PasswordForm({ onSubmit, password, setPassword, error, setError }: {
  onSubmit: (e: React.FormEvent) => void;
  password: string;
  setPassword: (v: string) => void;
  error: boolean;
  setError: (v: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    if (!formRef.current) return;
    const els = formRef.current.children;
    gsap.set(els, { opacity: 0, y: 30 });
    gsap.to(els, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
      ease: 'power3.out', delay: 0.3,
    });
  }, { scope: formRef });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex w-full max-w-sm flex-col items-center gap-6">
      <h1 className="font-fk-screamer text-3xl font-black uppercase text-[#fffffc]">
        Password Required
      </h1>
      <p className="font-robert-regular text-sm text-[#7f7f73] text-center">
        Enter the password to view the material.
      </p>
      <input
        type="text"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(false); }}
        placeholder="Enter password"
        className={`w-full rounded-lg bg-[#2a2a28] px-4 py-3 font-robert-regular text-sm text-[#fffffc] outline-none ring-1 transition-all duration-200 placeholder:text-[#5a5a55] ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-[#3a3a37] focus:ring-yellow-300/50'}`}
        autoFocus
      />
      <Button
        title="Unlock"
        containerClass="w-full !rounded-lg bg-yellow-300 flex-center gap-1"
      />
    </form>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RecommendationPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(false);
  const [recipient, setRecipient] = useState('');

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [starred, setStarred] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try { return new Set(JSON.parse(localStorage.getItem('rec-starred') || '[]')); } catch { return new Set(); }
    }
    return new Set();
  });
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [letterGuideOpen, setLetterGuideOpen] = useState(false);
  const qrContentRef = useRef<HTMLDivElement>(null);
  const letterContentRef = useRef<HTMLDivElement>(null);

  const togglePanel = useCallback((
    ref: React.RefObject<HTMLDivElement | null>,
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const el = ref.current;
    if (!el) return;
    if (isOpen) {
      // Collapse
      const cards = el.querySelectorAll('.panel-card');
      const tl = gsap.timeline();
      if (cards.length) {
        tl.to(cards, { y: -10, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in' });
      }
      tl.to(el, {
        height: 0, duration: 0.35, ease: 'power3.inOut',
        onComplete: () => { el.style.overflow = 'hidden'; gsap.set(el, { opacity: 0 }); },
      }, cards.length ? '-=0.1' : 0);
      setOpen(false);
    } else {
      // Expand
      el.style.overflow = 'hidden';
      el.style.height = '0px';
      el.style.display = 'block';
      gsap.set(el, { opacity: 1 });
      const cards = el.querySelectorAll('.panel-card');
      gsap.set(cards, { opacity: 0, y: 20 });
      const natural = el.scrollHeight;
      const tl = gsap.timeline({
        onComplete: () => { el.style.height = 'auto'; el.style.overflow = 'visible'; },
      });
      tl.to(el, { height: natural, duration: 0.5, ease: 'power3.out' });
      if (cards.length) {
        tl.to(cards, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' }, '-=0.3');
      }
      setOpen(true);
    }
  }, []);

  const toggleStar = useCallback((title: string) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      localStorage.setItem('rec-starred', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const collapseRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwordMap: Record<string, string> = {
      'ThankyouDrMaron!': 'maron',
      'ThankyouDrKim!': 'kim',
      'ThankyouDrBull!': 'bull',
      'ThankyouHadee!': 'hadee',
      'ThankyouShelby&Breck!': 'shelby-breck',
      '12345': 'general'
    };

    if (passwordMap[password]) {
      setError(false);
      setRecipient(passwordMap[password]);
      setUnlocked(true);
    } else {
      setError(true);
      setToast(true);
    }
  };

  // ── Collapse / Expand ────────────────────────────────────────────────────

  const toggleSection = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const el = collapseRefs.current.get(id);
      if (!el) return next;

      if (next.has(id)) {
        // ── Collapse ──
        const cards = el.querySelectorAll('.inner-card');
        const tl = gsap.timeline();
        if (cards.length) {
          tl.to(cards, {
            y: -10, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in',
          });
        }
        tl.to(el, {
          height: 0, duration: 0.35, ease: 'power3.inOut',
          onComplete: () => { el.style.overflow = 'hidden'; gsap.set(el, { opacity: 0 }); },
        }, cards.length ? '-=0.1' : 0);
        next.delete(id);
      } else {
        // ── Expand ──
        el.style.overflow = 'hidden';
        el.style.height = '0px';
        el.style.display = 'block';
        gsap.set(el, { opacity: 1 });

        // Hide inner cards before measuring
        const cards = el.querySelectorAll('.inner-card');
        gsap.set(cards, { opacity: 0, y: 20 });

        const natural = el.scrollHeight;
        const tl = gsap.timeline({
          onComplete: () => { el.style.height = 'auto'; el.style.overflow = 'visible'; },
        });

        // Smoothly expand height
        tl.to(el, {
          height: natural, duration: 0.5, ease: 'power3.out',
        });

        // Stagger inner cards in — start overlapping with height anim
        if (cards.length) {
          tl.to(cards, {
            y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out',
          }, '-=0.3');
        }

        next.add(id);
      }
      return next;
    });
  }, []);

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  const onDragStart = useCallback((id: string) => { setDraggedId(id); }, []);

  const onDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  }, []);

  const onDragLeave = useCallback(() => { setDragOverId(null); }, []);

  const onDrop = useCallback((targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null); setDragOverId(null); return;
    }
    setCategories((prev) => {
      const arr = [...prev];
      const fromIdx = arr.findIndex((c) => c.id === draggedId);
      const toIdx = arr.findIndex((c) => c.id === targetId);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
    setDraggedId(null); setDragOverId(null);
  }, [draggedId]);

  const onDragEnd = useCallback(() => { setDraggedId(null); setDragOverId(null); }, []);

  // ── GSAP scroll animations ──────────────────────────────────────────────

  useGSAP(() => {
    if (!unlocked || !contentRef.current) return;

    // Hero entrance — subtitle
    gsap.set('.hero-sub', { y: 20 });
    gsap.to('.hero-sub', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4,
    });

    // Hero entrance — highlights stagger
    gsap.set('.hero-highlight', { y: 30 });
    gsap.to('.hero-highlight', {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.6,
    });

    // Each section wrapper — scroll triggered fade up
    gsap.utils.toArray<HTMLElement>('.section-wrapper').forEach((el) => {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  }, { scope: contentRef, dependencies: [unlocked] });

  // ── Render: Academic section content ─────────────────────────────────────

  const renderAcademicContent = () => (
    <div className="px-4 pb-6 sm:px-6">
      {/* Quick stats row */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        <div className="inner-card flex flex-col items-center rounded-lg bg-[#2a2a28] px-3 py-4 ring-1 ring-[#3a3a37]">
          <span className="font-fk-screamer text-2xl font-black text-yellow-300">{ACADEMICS.cumGPA}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-[#7f7f73]">Cumulative GPA</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-[#2a2a28] px-3 py-4 ring-1 ring-[#3a3a37]">
          <span className="font-fk-screamer text-2xl font-black text-yellow-300">{AMCAS_GPAS.bcpm}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-[#7f7f73]">BCPM GPA</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-[#2a2a28] px-3 py-4 ring-1 ring-[#3a3a37]">
          <span className="font-fk-screamer text-2xl font-black text-[#fffffc]">{AMCAS_GPAS.ao}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-[#7f7f73]">AO GPA</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-[#2a2a28] px-3 py-4 ring-1 ring-[#3a3a37]">
          <span className="font-fk-screamer text-2xl font-black text-[#fffffc]">{ACADEMICS.totalCredits}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-[#7f7f73]">Total Credits</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-[#2a2a28] px-3 py-4 ring-1 ring-[#3a3a37]">
          <div className="flex items-center gap-1">
            <FaStar className="text-sm text-yellow-300" />
            <span className="font-fk-screamer text-2xl font-black text-[#fffffc]">{ACADEMICS.deansListCount}</span>
          </div>
          <span className="font-general text-[9px] uppercase tracking-wider text-[#7f7f73]">Dean&apos;s List</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-[#2a2a28] px-3 py-4 ring-1 ring-[#3a3a37]">
          <span className="font-fk-screamer text-2xl font-black text-[#fffffc]">{ACADEMICS.transferCredits}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-[#7f7f73]">Transfer Credits</span>
        </div>
      </div>

      {/* University info */}
      <div className="inner-card mb-6 flex flex-wrap items-center gap-2 font-robert-regular text-xs text-[#7f7f73]">
        <span className="rounded bg-[#2a2a28] px-2 py-1 text-[#b0b0a4]">{ACADEMICS.university}</span>
        <span className="rounded bg-[#2a2a28] px-2 py-1">{ACADEMICS.college}</span>
        <span className="rounded bg-[#2a2a28] px-2 py-1">Major: {ACADEMICS.major}</span>
        <span className="rounded bg-[#2a2a28] px-2 py-1">Minor: {ACADEMICS.minor}</span>
      </div>

      {/* AP & Transfer Credits */}
      <div className="inner-card mb-6 rounded-lg bg-[#262624] p-4 ring-1 ring-[#262624]">
        <h4 className="mb-3 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#8a8a85]">
          AP & Transfer Credits ({ACADEMICS.transferCredits} credits)
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-yellow-300/10 px-2 py-1 font-robert-regular text-[11px] text-yellow-300/70">
            CCA Transfer: {ACADEMICS.ccaCredits}cr
          </span>
          {AP_CREDITS.map((ap) => (
            <span key={ap.exam} className="rounded bg-[#2a2a28] px-2 py-1 font-robert-regular text-[11px] text-[#8a8a85]">
              {ap.exam} <span className="text-[#5a5a55]">→ {ap.equivalent}</span> <span className="text-yellow-300/70">{ap.credits}cr</span>
            </span>
          ))}
        </div>
      </div>

      {/* Semester cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SEMESTERS.map((sem) => {
          const semStarred = starred.has(sem.term);
          if (showStarredOnly && !semStarred) return null;
          return (
          <div
            key={sem.term}
            className={`inner-card rounded-lg p-4 ring-1 transition-all duration-200 ${
              sem.inProgress
                ? 'bg-yellow-300/[0.03] ring-yellow-300/20'
                : semStarred
                ? 'bg-yellow-300/[0.04] ring-yellow-300/20'
                : 'bg-[#262624] ring-[#3a3a37]'
            }`}
          >
            {/* Semester header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-fk-screamer text-sm font-black uppercase tracking-wide text-[#fffffc]">
                  {sem.term}
                </h4>
                {sem.inProgress && (
                  <span className="rounded-full bg-yellow-300/15 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                    In Progress
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {sem.deanslist && (
                  <span className="flex items-center gap-1 rounded-full bg-yellow-300/10 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                    <FaStar className="text-[8px]" /> Dean&apos;s List
                  </span>
                )}
                <span className="font-robert-regular text-[11px] text-[#5a5a55]">
                  {sem.credits}cr
                </span>
                {!sem.inProgress && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    sem.gpa === 4.0 ? 'bg-green-400/15 text-green-400' : 'bg-[#3a3a37] text-[#b0b0a4]'
                  }`}>
                    {sem.gpa.toFixed(3)}
                  </span>
                )}
                <button onClick={() => toggleStar(sem.term)} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                  {semStarred ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                </button>
              </div>
            </div>

            {/* Course rows */}
            <div className="flex flex-col gap-1.5">
              {sem.courses.map((course, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-[#232321] px-2 py-1.5">
                  <span className="w-[5.5rem] shrink-0 font-general text-[10px] tracking-wide text-[#5a5a55]">
                    {course.code}
                  </span>
                  <span className="min-w-0 flex-1 flex items-center gap-1.5 truncate font-robert-regular text-xs text-[#b0b0a4]">
                    <span className="truncate">{course.title}</span>
                    {course.honors && (
                      <span className="shrink-0 rounded bg-yellow-300/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-yellow-300">
                        Honors
                      </span>
                    )}
                  </span>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${gradeStyle(course.grade)}`}>
                    {gradeLabel(course.grade)}
                  </span>
                  <span className="w-6 shrink-0 text-right font-general text-[10px] text-[#5a5a55]">
                    {course.credits}
                  </span>
                </div>
              ))}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );

  // ── Render: Personal Statement section content ──────────────────────────

  const renderPersonalStatementContent = () => {
    const charCount = PERSONAL_STATEMENT.text.replace(/\n/g, '').length;
    const maxChars = PERSONAL_STATEMENT.maxChars;
    const hasText = charCount > 0;
    const psStarred = starred.has('personal-statement');
    return (
      <div className="px-4 pb-6 sm:px-6">
        <div className={`inner-card rounded-lg p-5 ring-1 transition-all duration-200 ${psStarred ? 'bg-yellow-300/[0.04] ring-yellow-300/20' : 'bg-[#262624] ring-[#3a3a37]'}`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-fk-screamer text-xs font-black uppercase tracking-wider text-[#8a8a85]">
                AMCAS Personal Statement
              </span>
              <button onClick={() => toggleStar('personal-statement')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                {psStarred ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
              </button>
            </div>
            <span className={`font-general text-[10px] tracking-wider ${
              charCount > maxChars ? 'text-red-400' : charCount > maxChars * 0.9 ? 'text-amber-300/50' : 'text-[#5a5a55]'
            }`}>
              {charCount.toLocaleString()}/{maxChars.toLocaleString()}
            </span>
          </div>
          {hasText ? (
            <p className="font-robert-regular text-sm leading-relaxed text-[#b0b0a4] whitespace-pre-wrap">
              {PERSONAL_STATEMENT.text}
            </p>
          ) : (
            <p className="font-robert-regular text-sm italic text-[#3a3a37]">
              Not written yet
            </p>
          )}
        </div>

      </div>
    );
  };

  // ── Render: Schools section content ──────────────────────────────────────

  const renderSchoolsContent = () => (
    <div className="px-4 pb-6 sm:px-6">
      {SCHOOL_LIST.map((tier) => (
        <div key={tier.label} className="mb-6 last:mb-0">
          {/* Tier sub-header */}
          <div className="inner-card mb-3 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tier.bgPill} ${tier.textPill}`}>
              {tier.label}
            </span>
            <span className="font-robert-regular text-xs text-[#5a5a55]">
              {tier.schools.length} {tier.schools.length === 1 ? 'school' : 'schools'}
            </span>
          </div>

          {/* School cards grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {tier.schools.map((school) => {
              const schoolStarred = starred.has(school.name);
              if (showStarredOnly && !schoolStarred) return null;
              return (
              <div
                key={school.name}
                className={`inner-card flex flex-col gap-2 rounded-lg p-3 ring-1 transition-all duration-200 ${schoolStarred ? 'bg-yellow-300/[0.04] ring-yellow-300/20' : 'bg-[#262624] ring-[#3a3a37]'}`}
              >
                <div className="flex items-center gap-2">
                  {school.logo && (
                    <img
                      src={`/img/school-icons/${school.logo}`}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded object-contain"
                    />
                  )}
                  <span className="min-w-0 flex-1 font-robert-medium text-xs text-[#fffffc] leading-tight">
                    {school.name}
                  </span>
                  {school.name === 'Harvard Medical School' && (
                    <span className="shrink-0 rounded-full bg-yellow-300/10 px-2 py-0.5 text-[9px] font-medium text-yellow-300 ring-1 ring-yellow-300/20">
                      Dream
                    </span>
                  )}
                  <button onClick={() => toggleStar(school.name)} className="group shrink-0 rounded-full p-1 transition-all hover:bg-yellow-300/10">
                    {schoolStarred ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                  </button>
                </div>
                <span className="font-robert-regular text-[11px] text-[#8a8a85]">
                  {school.location}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tier.bgPill} ${tier.textPill}`}>
                    {school.mcat} MCAT
                  </span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tier.bgPill} ${tier.textPill}`}>
                    {school.gpa.toFixed(2)} GPA
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Render: Projects section content ──────────────────────────────────────

  const renderProjectsContent = () => {
    const pc = (name: string, content: React.ReactNode) => {
      const s = starred.has(name);
      if (showStarredOnly && !s) return null;
      return (
        <div key={name} className={`relative rounded-md transition-all duration-200 ${s ? 'ring-2 ring-yellow-300/30' : ''}`}>
          <button
            onClick={() => toggleStar(name)}
            className="absolute top-3 right-3 z-20 group rounded-full bg-[#21211f]/50 backdrop-blur-sm p-2 transition-all hover:bg-yellow-300/20"
          >
            {s ? <FaStar className="text-sm text-yellow-300" /> : <FaRegStar className="text-sm text-[#5a5a55] group-hover:text-yellow-300/60" />}
          </button>
          {content}
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-5 px-4 pb-6 sm:px-6">
        {pc('Studyur', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              riveSrc="/rive/hero_section.riv"
              title={<img src="/img/studyur-logo-white.svg" alt="Studyur" className="h-28 md:h-36 w-auto pointer-events-none" style={{ marginTop: '-40px', marginBottom: '-40px', marginLeft: '-25px' }} />}
              description="A study platform for students to study harder, smarter, deeper, and faster — maximizing information gained in the shortest time using AI and a suite of tools."
              ribbon="Under Construction"
              link="https://studyur.com"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Clover', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              title={<img src="/img/clover-logo-white.svg" alt="Clover" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A proprietary 12-billion parameter AI model. Not available to the public — built on the belief that LLMs aren't the future, and other AI models will benefit humankind more."
              ribbon="Not Public"
              isComingSoon
            >
              <CloverAnimation />
            </BentoCard>
          </BentoTilt>
        ))}

        {pc('Zoov', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              title={<img src="/img/zoov-logo-white.svg" alt="Zoov" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A proprietary medical AI transcription platform to help healthcare providers spend more time with patients and less on paperwork. Discontinued after Doximity launched a free AI scribe."
              ribbon="Discontinued"
              isComingSoon
            >
              <ZoovAnimation />
            </BentoCard>
          </BentoTilt>
        ))}

        {pc('PreMeder', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/feature-4.mp4"
              videoClassName="!w-[90%] !h-[90%] !left-auto !right-4 !top-auto !bottom-4 !object-contain"
              title={<img src="/img/premeder-logo-white.svg" alt="PreMeder" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A pre-health web app for tracking applications, accessing resources, and preparing for every step of the admissions process."
              ribbon="Remodeling"
              link="https://premeder.com"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Trovex', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/trovex.mp4"
              videoClassName="!w-[90%] !h-[90%] !left-auto !right-4 !top-auto !bottom-4 !object-contain"
              title={<img src="/img/trovex-logo-white.svg" alt="Trovex" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A proprietary AI-powered search for your files, support chat, receptionist, and more. Intelligent retrieval across your entire workflow."
              ribbon="Under Development"
              link="https://trovex.io"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Pangroup', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/feature-5.mp4"
              videoClassName="!w-[90%] !h-[90%] !left-auto !right-4 !top-auto !bottom-4 !object-contain"
              title={<img src="/img/pangroup-logo.svg" alt="Pangroup" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A nonprofit helping high school students get into their dream college, discontinued due to scheduling conflicts among all founders."
              ribbon="Discontinued"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Synthr', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              title={<img src="/img/synthr-logo-white.svg" alt="Synthr" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A programming language purpose-built for ML pipelines. Tensor-native syntax, auto-differentiation, and GPU-first execution."
              ribbon="Complete"
              isComingSoon
            >
              <div className="size-full bg-black overflow-hidden font-mono text-xs sm:text-sm md:text-base leading-relaxed flex items-center justify-center px-6 py-20">
                <pre className="text-[#fffffc] max-w-3xl" dangerouslySetInnerHTML={{ __html: synthrCodeHTML }} />
              </div>
            </BentoCard>
          </BentoTilt>
        ))}

        {pc('Histia', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/histia.mp4"
              videoClassName="!left-auto !top-auto !right-6 !bottom-6 !w-[80%] !h-[80%] !object-contain"
              title={<img src="/img/histia-logo-white.svg" alt="Histia" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A proprietary Whole-Slide Imaging platform powered by AI. Automated labeling, annotation, and analysis of whole slides for faster, smarter pathology."
              ribbon="Complete"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Topographify', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/topographify.mp4"
              title={<img src="/img/topographify-logo-white.svg" alt="Topographify" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="Proprietary high-resolution terrain mapping and analysis. Real-time 3D topographic generation from satellite and LiDAR data."
              ribbon="Complete"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Aethon', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/aethon.mp4"
              videoClassName="!object-contain scale-[0.9] translate-x-[10%]"
              title={<img src="/img/aethon-logo-white.svg" alt="Aethon" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A proprietary AI model trained on biochemical processes and pathways, working to discover novel biochemical mechanisms across eukaryotes, prokaryotes, and archaea."
              ribbon="Complete"
              isComingSoon
            />
          </BentoTilt>
        ))}

        {pc('Rivex', (
          <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
            <BentoCard
              src="/videos/rivex.mp4"
              videoClassName="!object-contain scale-[1.1]"
              title={<img src="/img/rivex-logo-white.svg" alt="Rivex" className="h-12 md:h-16 w-auto pointer-events-none" />}
              description="A proprietary AI-powered visual inspection platform. Sensor and imaging models that detect issues in robotic and packing machines to prevent downtime before it happens."
              ribbon="Complete"
              isComingSoon
            />
          </BentoTilt>
        ))}
      </div>
    );
  };

  // ── Password screen ──────────────────────────────────────────────────────

  if (!unlocked) {
    return (
      <div className="relative min-h-screen w-screen bg-[#21211f]">
        <NavBar variant="light" />
        <div
          className={`fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded-lg bg-red-500/90 px-5 py-3 font-robert-regular text-sm text-[#fffffc] shadow-lg backdrop-blur-sm transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
        >
          Incorrect password. Please try again.
        </div>
        <div className="flex h-screen items-center justify-center px-6">
          <PasswordForm onSubmit={handleSubmit} password={password} setPassword={setPassword} error={error} setError={setError} />
        </div>
        <Footer />
      </div>
    );
  }

  // ── Unlocked content ─────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen w-screen flex-col bg-[#21211f]">
      <NavBar variant="light" />

      <div ref={contentRef} className="flex-1 px-4 pb-20 pt-32 sm:px-8 md:px-16 lg:px-24">
        {/* Hero */}
        <div className="mx-auto max-w-6xl">
          <AnimatedTitle
            title="Rec<b>o</b>mmendation <br /> Mat<b>e</b>rial"
            containerClass="!text-left"
          />
          <div className="hero-sub mt-6 max-w-3xl font-robert-regular text-sm leading-relaxed text-[#8a8a85] space-y-3" style={{ opacity: 0 }}>
            {recipient === 'maron' && (
              <p><strong className="text-[#b0b0a4]">Hi Dr. Maron</strong> — Your speeches about your own experiences towards education and being in the position you are now were really motivating and eye-opening. They single-handedly influenced the amount of effort I gave to school and the perseverance I had.</p>
            )}

            {recipient === 'kim' && (
              <p><strong className="text-[#b0b0a4]">Hi Dr. Kim</strong> — I really appreciate your understanding when I absolutely failed my first biochem test. On top of that, thank you for letting me into your research and being a part of something meaningful.</p>
            )}

            {recipient === 'bull' && (
              <p><strong className="text-[#b0b0a4]">Hi Dr. Bull</strong> — You have been an immensely fantastic mentor. I really appreciate you letting me shadow once a month, which most people aren't able to do. You confirmed that I wanted to become a physician and made me realize I would love to be a medical director myself. Seeing what you do in that role has really made me appreciate that kind of work.</p>
            )}

            {recipient === 'hadee' && (
              <p><strong className="text-[#b0b0a4]">Hi Hadee</strong> — Thank you for letting me in without any hesitation, for talking to me kindly, and being understanding about my schedule. You've been one of the best mentors I've ever had. Seeing you as a provider for so many and being really understanding of patients and their situations will stick with me. I've learned lessons from you that I'll pass on to others as I continue my journey as a physician.</p>
            )}

            {recipient === 'shelby-breck' && (
              <>
                <p><strong className="text-[#b0b0a4]">Hi Breck</strong> — Thank you for trying something new and letting me into your lab when you'd never had an undergrad before, and for trusting that I would be more benefit than not. I appreciate you meeting with me to talk about my research and being so understanding.</p>

                <p><strong className="text-[#b0b0a4]">Hi Shelby</strong> — Thank you for letting me onto your project and helping me so many times, even with the silliest questions. You were always there to support me through my research journey and I'm really grateful for all you've done for me. I really hope the best for you after graduation, after you get your PhD, and that you do something you really want to do.</p>
              </>
            )}
          </div>

          {/* Top highlights */}
          <div className="mt-8 flex flex-wrap items-end gap-8">
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-yellow-300">
                {ACADEMICS.cumGPA}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-[#7f7f73]">
                GPA
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-[#fffffc]">
                {formatHours(TOTAL_HOURS)}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-[#7f7f73]">
                Total Hours
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-yellow-300">
                {ACTIVITY_COUNT}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-[#7f7f73]">
                Activities
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-[#fffffc]">
                {SCHOOL_COUNT}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-[#7f7f73]">
                Schools
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-yellow-300">MCAT</span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-[#7f7f73]">
                {(() => {
                  const now = new Date();
                  const testDate = new Date('2026-05-22');
                  const scoreDate = new Date('2026-06-23');
                  const daysToTest = Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const daysToScore = Math.ceil((scoreDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  if (daysToTest > 0) return `May 22 · ${daysToTest}d away`;
                  if (daysToScore > 0) return `Score Jun 23 · ${daysToScore}d`;
                  return 'Score Available';
                })()}
              </span>
              <span className="mx-2 text-[#3a3a37]">|</span>
              <span className="font-fk-screamer text-5xl font-black text-red-400">LETTERS DUE</span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-red-400/60">
                {(() => {
                  const now = new Date();
                  const dueDate = new Date('2026-05-25');
                  const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  if (daysLeft > 0) return `May 25 · ${daysLeft}d left · Submit on Interfolio`;
                  if (daysLeft === 0) return 'Due Today · Submit on Interfolio';
                  return 'Past Due';
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Starred section */}
        <div className="section-wrapper mx-auto mt-16 max-w-6xl rounded-xl bg-[#232321] ring-1 ring-[#3a3a37]">
          {/* Collapsible header */}
          <button
            type="button"
            onClick={() => togglePanel(qrContentRef, qrOpen, setQrOpen)}
            className="flex w-full cursor-pointer items-center gap-3 p-5 sm:p-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow-300/30 focus-visible:rounded-xl"
          >
            <FaStar className="text-lg text-yellow-300" />
            <h3 className="font-fk-screamer text-lg font-black uppercase tracking-wide text-[#fffffc]">
              Quick Reference
            </h3>
            {starred.size > 0 && (
              <span className="rounded-full bg-yellow-300/15 px-2.5 py-0.5 font-robert-regular text-xs font-medium text-yellow-300">
                {starred.size}
              </span>
            )}
            <span className="ml-auto flex items-center gap-3">
              <span className="hidden font-robert-regular text-xs text-[#5a5a55] sm:inline">
                {starred.size === 0 ? 'Star items below to save them here' : `${starred.size} item${starred.size === 1 ? '' : 's'} starred`}
              </span>
              <FaChevronDown className={`text-sm text-[#5a5a55] transition-transform duration-300 ${qrOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {/* Collapsible body */}
          <div ref={qrContentRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="panel-card mb-4 max-w-xl font-robert-regular text-sm leading-relaxed text-[#7f7f73]">
                Star anything that stands out — activities, semesters, schools, projects, or my personal statement. Starred items appear here for quick reference as you write.
              </p>

          {/* Starred items rendered inline */}
          {starred.size > 0 ? (
            <div className="panel-card mt-6 space-y-6">
              {/* ── Starred Semesters ── */}
              {(() => {
                const items = SEMESTERS.filter(s => starred.has(s.term));
                if (!items.length) return null;
                return (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                      <FaGraduationCap className="text-sm text-yellow-300/60" /> Semesters
                    </h4>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {items.map((sem) => (
                        <div key={sem.term} className="rounded-lg bg-yellow-300/[0.04] p-4 ring-1 ring-yellow-300/20">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-fk-screamer text-sm font-black uppercase tracking-wide text-[#fffffc]">{sem.term}</h4>
                              {sem.inProgress && <span className="rounded-full bg-yellow-300/15 px-2 py-0.5 text-[10px] font-medium text-yellow-300">In Progress</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              {sem.deanslist && <span className="flex items-center gap-1 rounded-full bg-yellow-300/10 px-2 py-0.5 text-[10px] font-medium text-yellow-300"><FaStar className="text-[8px]" /> Dean&apos;s List</span>}
                              <span className="font-robert-regular text-[11px] text-[#5a5a55]">{sem.credits}cr</span>
                              {!sem.inProgress && <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sem.gpa === 4.0 ? 'bg-green-400/15 text-green-400' : 'bg-[#3a3a37] text-[#b0b0a4]'}`}>{sem.gpa.toFixed(3)}</span>}
                              <button onClick={() => toggleStar(sem.term)} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                                <FaStar className="text-xs text-yellow-300" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {sem.courses.map((course, i) => (
                              <div key={i} className="flex items-center gap-2 rounded bg-[#232321] px-2 py-1.5">
                                <span className="w-[5.5rem] shrink-0 font-general text-[10px] tracking-wide text-[#5a5a55]">{course.code}</span>
                                <span className="min-w-0 flex-1 flex items-center gap-1.5 truncate font-robert-regular text-xs text-[#b0b0a4]">
                                  <span className="truncate">{course.title}</span>
                                  {course.honors && <span className="shrink-0 rounded bg-yellow-300/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-yellow-300">Honors</span>}
                                </span>
                                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${gradeStyle(course.grade)}`}>{gradeLabel(course.grade)}</span>
                                <span className="w-6 shrink-0 text-right font-general text-[10px] text-[#5a5a55]">{course.credits}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Starred Personal Statement ── */}
              {starred.has('personal-statement') && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                    <FaPen className="text-sm text-yellow-300/60" /> Personal Statement
                  </h4>
                  <div className="rounded-lg bg-yellow-300/[0.04] p-5 ring-1 ring-yellow-300/20">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-fk-screamer text-xs font-black uppercase tracking-wider text-[#8a8a85]">AMCAS Personal Statement</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-general text-[10px] tracking-wider ${PERSONAL_STATEMENT.text.replace(/\n/g, '').length > PERSONAL_STATEMENT.maxChars ? 'text-red-400' : 'text-[#5a5a55]'}`}>
                          {PERSONAL_STATEMENT.text.replace(/\n/g, '').length.toLocaleString()}/{PERSONAL_STATEMENT.maxChars.toLocaleString()}
                        </span>
                        <button onClick={() => toggleStar('personal-statement')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                          <FaStar className="text-xs text-yellow-300" />
                        </button>
                      </div>
                    </div>
                    <p className="font-robert-regular text-sm leading-relaxed text-[#b0b0a4] whitespace-pre-wrap">{PERSONAL_STATEMENT.text}</p>
                  </div>
                </div>
              )}

              {/* ── Starred Schools ── */}
              {(() => {
                const items = SCHOOL_LIST.flatMap(t => t.schools.filter(s => starred.has(s.name)).map(s => ({ ...s, tier: t })));
                if (!items.length) return null;
                return (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                      <FaUniversity className="text-sm text-yellow-300/60" /> Schools
                    </h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {items.map((school) => (
                        <div key={school.name} className="flex flex-col gap-2 rounded-lg bg-yellow-300/[0.04] p-3 ring-1 ring-yellow-300/20">
                          <div className="flex items-center gap-2">
                            {school.logo && <img src={`/img/school-icons/${school.logo}`} alt="" className="h-6 w-6 shrink-0 rounded object-contain" />}
                            <span className="min-w-0 flex-1 font-robert-medium text-xs text-[#fffffc] leading-tight">{school.name}</span>
                            <button onClick={() => toggleStar(school.name)} className="group shrink-0 rounded-full p-1 transition-all hover:bg-yellow-300/10">
                              <FaStar className="text-xs text-yellow-300" />
                            </button>
                          </div>
                          <span className="font-robert-regular text-[11px] text-[#8a8a85]">{school.location}</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${school.tier.bgPill} ${school.tier.textPill}`}>{school.mcat} MCAT</span>
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${school.tier.bgPill} ${school.tier.textPill}`}>{school.gpa.toFixed(2)} GPA</span>
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${school.tier.bgPill} ${school.tier.textPill}`}>{school.tier.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Starred Projects ── */}
              {(() => {
                const items = PROJECT_NAMES.filter(p => starred.has(p));
                if (!items.length) return null;
                return (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                      <FaCode className="text-sm text-yellow-300/60" /> Projects
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((name) => {
                        const info = PROJECT_INFO[name];
                        if (!info) return null;
                        return (
                          <div key={name} className="flex flex-col gap-2 rounded-lg bg-yellow-300/[0.04] p-4 ring-1 ring-yellow-300/20">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-robert-medium text-sm text-[#fffffc]">{name}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-full bg-[#3a3a37] px-2 py-0.5 text-[9px] font-medium text-[#8a8a85]">{info.ribbon}</span>
                                <button onClick={() => toggleStar(name)} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                                  <FaStar className="text-xs text-yellow-300" />
                                </button>
                              </div>
                            </div>
                            <p className="font-robert-regular text-xs leading-relaxed text-[#8a8a85]">{info.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ── Starred Activities ── */}
              {(() => {
                const items = categories
                  .filter(c => !['academics', 'personal-statement', 'schools', 'projects'].includes(c.id))
                  .flatMap(c => c.activities.filter(a => starred.has(a.title)).map(a => ({ ...a, categoryName: c.name })));
                if (!items.length) return null;
                return (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                      <FaHeart className="text-sm text-yellow-300/60" /> Activities
                    </h4>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {items.map((activity) => (
                        <div key={activity.title} className="flex flex-col gap-3 rounded-lg bg-yellow-300/[0.04] p-5 ring-1 ring-yellow-300/20">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-robert-medium text-sm font-semibold text-[#fffffc]">{activity.title}</h3>
                              <span className="mt-0.5 inline-block font-robert-regular text-[10px] text-[#5a5a55]">{activity.categoryName}</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {activity.hours > 0 && (
                                <span className="flex items-center gap-1 rounded-full bg-yellow-300/15 px-2 py-0.5 text-[11px] font-medium text-yellow-300">
                                  <MdAccessTime className="text-xs" />{formatHours(activity.hours)}h
                                </span>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); toggleStar(activity.title); }} className="group rounded-full p-1.5 transition-all duration-200 hover:bg-yellow-300/10">
                                <FaStar className="text-sm text-yellow-300" />
                              </button>
                            </div>
                          </div>
                          {activity.role && (
                            <div className="flex items-center gap-1.5 text-[#8a8a85]">
                              <FaUserTie className="shrink-0 text-[10px]" /><span className="font-robert-regular text-xs">{activity.role}</span>
                            </div>
                          )}
                          {activity.contact && (
                            <div className="flex items-start gap-1.5 text-[#7f7f73]">
                              <FaUserMd className="mt-0.5 shrink-0 text-[10px]" /><span className="font-robert-regular text-xs">{activity.contact}</span>
                            </div>
                          )}
                          {activity.location && (
                            <div className="flex items-center gap-1.5 text-[#7f7f73]">
                              <FaMapMarkerAlt className="shrink-0 text-[10px]" /><span className="font-robert-regular text-xs">{activity.location}</span>
                            </div>
                          )}
                          {(() => {
                            const descCount = (activity.description || '').length;
                            return (
                              <div className="mt-1 rounded bg-[#232321] p-2.5">
                                {descCount > 0
                                  ? <p className="font-robert-regular text-xs leading-relaxed text-[#8a8a85]">{activity.description}</p>
                                  : <p className="font-robert-regular text-[11px] italic text-[#3a3a37]">No description yet</p>}
                                <div className="mt-1.5 flex items-center justify-end"><span className={`font-general text-[9px] tracking-wider ${descCount > 700 ? 'text-red-400' : 'text-[#3a3a37]'}`}>{descCount}/700</span></div>
                              </div>
                            );
                          })()}
                          {activity.mostMeaningful && (() => {
                            const essayCount = (activity.meaningfulEssay || '').length;
                            return (
                              <div className="mt-2 rounded bg-yellow-300/[0.03] p-2.5 ring-1 ring-yellow-300/10">
                                <span className="mb-1.5 inline-block rounded-full bg-yellow-300/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-yellow-300">Most Meaningful</span>
                                {essayCount > 0
                                  ? <p className="font-robert-regular text-xs leading-relaxed text-[#8a8a85]">{activity.meaningfulEssay}</p>
                                  : <p className="font-robert-regular text-[11px] italic text-[#3a3a37]">No most meaningful essay yet</p>}
                                <div className="mt-1.5 flex items-center justify-end"><span className={`font-general text-[9px] tracking-wider ${essayCount > 1325 ? 'text-red-400' : 'text-[#3a3a37]'}`}>{essayCount}/1325</span></div>
                              </div>
                            );
                          })()}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            {dateRange(activity) && (
                              <div className="flex items-center gap-1.5 text-[#5a5a55]">
                                <FaCalendarAlt className="text-[10px]" /><span className="font-robert-regular text-[11px]">{dateRange(activity)}</span>
                              </div>
                            )}
                            {activity.ongoing !== undefined && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${activity.ongoing ? 'bg-green-400/15 text-green-400' : 'bg-[#3a3a37] text-[#7f7f73]'}`}>
                                {activity.ongoing ? 'Ongoing' : 'Completed'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Starred Letter Requirement Items ── */}
              {starred.has('submission-details') && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                    <FaPen className="text-sm text-yellow-300/60" /> Submission Details
                  </h4>
                  <div className="rounded-lg bg-yellow-300/[0.04] p-4 ring-1 ring-yellow-300/20 font-robert-regular text-xs">
                    <div className="mb-3 rounded-lg bg-red-400/[0.06] px-3 py-2 ring-1 ring-red-400/20">
                      <p className="font-fk-screamer text-xs font-black uppercase tracking-wide text-red-400">Due: May 25, 2026{(() => { const d = Math.ceil((new Date('2026-05-25').getTime() - new Date().getTime()) / (1000*60*60*24)); return d > 0 ? ` · ${d}d left` : d === 0 ? ' · Today' : ' · Past Due'; })()}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-[#7f7f73]">
                      <p><span className="text-[#b0b0a4]">Submit via:</span> Interfolio</p>
                      <p><span className="text-[#b0b0a4]">Length:</span> 1.5–2 single-spaced pages</p>
                      <p><span className="text-[#b0b0a4]">Format:</span> Institutional letterhead</p>
                      <p><span className="text-[#b0b0a4]">Written for:</span> Navtej Singh</p>
                    </div>
                    <div className="mt-3 rounded bg-[#262624] px-3 py-2 ring-1 ring-[#262624]">
                      <p className="text-[11px] text-[#6a6a65]"><span className="text-[#8a8a85]">FERPA Waiver:</span> I have waived my right to view this letter of recommendation. Please do not send the letter to me — submit only through Interfolio.</p>
                    </div>
                  </div>
                </div>
              )}

              {starred.has('letter-format') && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                    <FaPen className="text-sm text-yellow-300/60" /> Letter Format
                  </h4>
                  <div className="rounded-lg bg-yellow-300/[0.04] p-5 ring-1 ring-yellow-300/20 font-robert-regular text-xs">
                    <div className="space-y-4 text-[#6a6a65]">
                      <div>
                        <p className="text-[#8a8a85]">[Your Institutional Letterhead]</p>
                        <p className="text-[#5a5a55]">[Date]</p>
                      </div>
                      <p className="text-[#8a8a85]">Dear Admissions Committee, <span className="text-[#5a5a55]">or</span> Dear Members of the Admissions Committee, <span className="text-[#5a5a55]">or</span> To Whom It May Concern,</p>
                      <p className="py-3 text-center text-[#5a5a55] italic">[All the awesome stuff you have to say about me]</p>
                    <p className="mt-3 text-[#5a5a55] italic text-[11px]">I would be incredibly grateful for the strongest, most detailed letter you can write. A specific, personal letter makes all the difference in this process — I&apos;ve worked very hard to get here and a thoughtful letter that speaks to who I am beyond my numbers would mean the world to me. Thank you so much for your time and support.</p>
                      <div>
                        <p className="text-[#8a8a85]">Sincerely, <span className="text-[#5a5a55]">or</span> Respectfully, <span className="text-[#5a5a55]">or</span> With highest regards, <span className="text-[#5a5a55]">or</span> Warmly, <span className="text-[#5a5a55]">or</span> Best,</p>
                        <p className="mt-2 text-[#5a5a55]">[Signature]</p>
                        <p className="text-[#5a5a55]">[Full Name], [Degree(s)]</p>
                        <p className="text-[#5a5a55]">[Title / Position]</p>
                        <p className="text-[#5a5a55]">[Department &amp; Institution]</p>
                        <p className="text-[#5a5a55]">[Email] · [Phone]</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {starred.has('committees-value') && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                    <FaPen className="text-sm text-yellow-300/60" /> What Admissions Committees Value
                  </h4>
                  <div className="rounded-lg bg-yellow-300/[0.04] p-4 ring-1 ring-yellow-300/20 font-robert-regular text-xs">
                    <p className="text-[11px] text-[#5a5a55] mb-3">Topics that tend to strengthen letters — feel free to write about whatever you feel best represents your experience with Navtej.</p>
                    <div className="flex flex-wrap gap-2">
                      {['Specific moments you witnessed','How they handled challenges','Growth over time','Intellectual curiosity','How they work with others','Maturity & self-awareness','Comparison to peers','Integrity & reliability'].map(topic => (
                        <span key={topic} className="rounded-full bg-yellow-300/10 px-3 py-1 text-[11px] text-[#7f7f73] ring-1 ring-yellow-300/20">{topic}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {starred.has('aamc-guidelines') && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                    <FaPen className="text-sm text-yellow-300/60" /> AAMC Guidelines
                  </h4>
                  <div className="rounded-lg bg-yellow-300/[0.04] p-4 ring-1 ring-yellow-300/20 font-robert-regular text-xs">
                    <ol className="list-decimal list-inside space-y-2 text-[#7f7f73]">
                      <li>Provide an <span className="text-[#b0b0a4]">accurate assessment</span> of suitability rather than advocate.</li>
                      <li>Explain your <span className="text-[#b0b0a4]">relationship</span> — how long, what capacity, direct or indirect.</li>
                      <li><span className="text-[#b0b0a4]">Quality over quantity</span> — focus on the applicant.</li>
                      <li>Only include grades/GPA/MCAT with <span className="text-[#b0b0a4]">context</span>.</li>
                      <li>Focus on <span className="text-[#b0b0a4]">behaviors observed directly</span>.</li>
                      <li>Ask permission for <span className="text-[#b0b0a4]">sensitive information</span>.</li>
                      <li>Include <span className="text-[#b0b0a4]">unique contributions</span> and growth.</li>
                      <li>Provide <span className="text-[#b0b0a4]">comparison context</span> if comparing.</li>
                    </ol>
                  </div>
                </div>
              )}

              {starred.has('aamc-competencies') && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-fk-screamer text-xs font-black uppercase tracking-wider text-[#7f7f73]">
                    <FaPen className="text-sm text-yellow-300/60" /> AAMC Core Competencies
                  </h4>
                  <div className="rounded-lg bg-yellow-300/[0.04] p-4 ring-1 ring-yellow-300/20 font-robert-regular text-xs">
                    <div className="space-y-3">
                      <div>
                        <p className="mb-1.5 font-fk-screamer text-[10px] font-black uppercase tracking-widest text-yellow-300/40">Thinking &amp; Reasoning</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Critical Thinking','Quantitative Reasoning','Scientific Inquiry','Written Communication'].map(c => (
                            <span key={c} className="rounded bg-yellow-300/10 px-2 py-0.5 text-[10px] text-[#7f7f73]">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1.5 font-fk-screamer text-[10px] font-black uppercase tracking-widest text-yellow-300/40">Science</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Living Systems','Human Behavior'].map(c => (
                            <span key={c} className="rounded bg-yellow-300/10 px-2 py-0.5 text-[10px] text-[#7f7f73]">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1.5 font-fk-screamer text-[10px] font-black uppercase tracking-widest text-yellow-300/40">Pre-Professional</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Service Orientation','Social Skills','Cultural Competence','Teamwork','Oral Communication','Ethical Responsibility','Reliability & Dependability','Resilience & Adaptability','Capacity for Improvement'].map(c => (
                            <span key={c} className="rounded bg-yellow-300/10 px-2 py-0.5 text-[10px] text-[#7f7f73]">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="panel-card mt-4 rounded-lg border border-dashed border-[#3a3a37] px-4 py-3">
              <p className="font-robert-regular text-xs text-[#5a5a55]">
                No items starred yet. Click the <FaRegStar className="inline text-[10px] text-[#5a5a55]" /> icon on any item below to save it here.
              </p>
            </div>
          )}
            </div>
          </div>
        </div>


        {/* Letter Requirements & Topics */}
        <div className="section-wrapper mx-auto mt-4 max-w-6xl rounded-xl bg-[#232321] ring-1 ring-[#3a3a37]">
          <button
            type="button"
            onClick={() => togglePanel(letterContentRef, letterGuideOpen, setLetterGuideOpen)}
            className="flex w-full cursor-pointer items-center gap-3 p-5 sm:p-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow-300/30 focus-visible:rounded-xl"
          >
            <FaPen className="text-lg text-yellow-300" />
            <h3 className="font-fk-screamer text-lg font-black uppercase tracking-wide text-[#fffffc]">
              Letter Requirements
            </h3>
            <span className="ml-auto">
              <FaChevronDown className={`text-sm text-[#5a5a55] transition-transform duration-300 ${letterGuideOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          <div ref={letterContentRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
            <div className="px-5 pb-6 pt-1 sm:px-6 font-robert-regular text-xs leading-relaxed">

              {/* Submission Requirements */}
              <div className="panel-card relative rounded-lg bg-[#262624] p-4 ring-1 ring-[#3a3a37]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-fk-screamer text-[11px] font-black uppercase tracking-widest text-yellow-300/60">Submission Details</h4>
                  <button onClick={() => toggleStar('submission-details')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                    {starred.has('submission-details') ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                  </button>
                </div>
                <div className="mb-3 rounded-lg bg-red-400/[0.06] px-3 py-2 ring-1 ring-red-400/20">
                  <p className="font-fk-screamer text-xs font-black uppercase tracking-wide text-red-400">Due: May 25, 2026{(() => { const d = Math.ceil((new Date('2026-05-25').getTime() - new Date().getTime()) / (1000*60*60*24)); return d > 0 ? ` · ${d}d left` : d === 0 ? ' · Today' : ' · Past Due'; })()}</p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-[#7f7f73]">
                  <p><span className="text-[#b0b0a4]">Submit via:</span> Interfolio</p>
                  <p><span className="text-[#b0b0a4]">Length:</span> 1.5–2 single-spaced pages</p>
                  <p><span className="text-[#b0b0a4]">Format:</span> Institutional letterhead</p>
                  <p><span className="text-[#b0b0a4]">Written for:</span> Navtej Singh</p>
                </div>
                <div className="mt-3 rounded bg-[#262624] px-3 py-2 ring-1 ring-[#262624]">
                  <p className="text-[11px] text-[#6a6a65]"><span className="text-[#8a8a85]">FERPA Waiver:</span> I have waived my right to view this letter of recommendation. Please do not send the letter to me — submit only through Interfolio.</p>
                </div>
              </div>

              {/* Letter Format Skeleton */}
              <div className="panel-card relative mt-3 rounded-lg bg-[#262624] p-5 ring-1 ring-[#3a3a37]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-fk-screamer text-[11px] font-black uppercase tracking-widest text-yellow-300/60">Letter Format</h4>
                  <button onClick={() => toggleStar('letter-format')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                    {starred.has('letter-format') ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                  </button>
                </div>
                <div className="space-y-4 text-[#6a6a65]">
                  <div>
                    <p className="text-[#8a8a85]">[Your Institutional Letterhead]</p>
                    <p className="text-[#5a5a55]">[Date]</p>
                  </div>
                  <div>
                    <p className="text-[#8a8a85]">Dear Admissions Committee, <span className="text-[#5a5a55]">or</span> Dear Members of the Admissions Committee, <span className="text-[#5a5a55]">or</span> To Whom It May Concern,</p>
                  </div>
                  <div className="py-3">
                    <p className="text-center text-[#5a5a55] italic">[All the awesome stuff you have to say about me]</p>
                    <p className="mt-3 text-[#5a5a55] italic text-[11px]">I would be incredibly grateful for the strongest, most detailed letter you can write. A specific, personal letter makes all the difference in this process — I&apos;ve worked very hard to get here and a thoughtful letter that speaks to who I am beyond my numbers would mean the world to me. Thank you so much for your time and support.</p>
                  </div>
                  <div>
                    <p className="text-[#8a8a85]">Sincerely, <span className="text-[#5a5a55]">or</span> Respectfully, <span className="text-[#5a5a55]">or</span> With highest regards, <span className="text-[#5a5a55]">or</span> Warmly, <span className="text-[#5a5a55]">or</span> Best,</p>
                    <p className="mt-2 text-[#5a5a55]">[Signature]</p>
                    <p className="text-[#5a5a55]">[Full Name], [Degree(s)]</p>
                    <p className="text-[#5a5a55]">[Title / Position]</p>
                    <p className="text-[#5a5a55]">[Department &amp; Institution]</p>
                    <p className="text-[#5a5a55]">[Email] · [Phone]</p>
                  </div>
                </div>
              </div>

              {/* Topics admissions committees value */}
              <div className="panel-card relative mt-3 rounded-lg bg-[#262624] p-4 ring-1 ring-[#3a3a37]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-fk-screamer text-[11px] font-black uppercase tracking-widest text-yellow-300/60">What Admissions Committees Value</h4>
                  <button onClick={() => toggleStar('committees-value')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                    {starred.has('committees-value') ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#5a5a55] mb-3">Topics that tend to strengthen letters — feel free to write about whatever you feel best represents your experience with Navtej.</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Specific moments you witnessed',
                    'How they handled challenges',
                    'Growth over time',
                    'Intellectual curiosity',
                    'How they work with others',
                    'Maturity & self-awareness',
                    'Comparison to peers',
                    'Integrity & reliability',
                  ].map(topic => (
                    <span key={topic} className="rounded-full bg-[#2a2a28] px-3 py-1 text-[11px] text-[#7f7f73] ring-1 ring-[#3a3a37]">{topic}</span>
                  ))}
                </div>
              </div>

              {/* AAMC Guidelines */}
              <div className="panel-card relative mt-3 rounded-lg bg-[#262624] p-4 ring-1 ring-[#3a3a37]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-fk-screamer text-[11px] font-black uppercase tracking-widest text-yellow-300/60">AAMC Guidelines</h4>
                  <button onClick={() => toggleStar('aamc-guidelines')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                    {starred.has('aamc-guidelines') ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#5a5a55] mb-3">From the AAMC &quot;Guidelines for Writing a Letter of Evaluation for a Medical School Applicant&quot;</p>
                <ol className="list-decimal list-inside space-y-2 text-[#7f7f73]">
                  <li>Provide an <span className="text-[#b0b0a4]">accurate assessment</span> of suitability for medical school rather than advocate for the applicant.</li>
                  <li>Briefly explain your <span className="text-[#b0b0a4]">relationship</span> — how long you&apos;ve known them, in what capacity, and whether your observations are direct or indirect.</li>
                  <li><span className="text-[#b0b0a4]">Quality over quantity</span> — focus on the applicant, not details of the lab, course, or institution.</li>
                  <li>Only include grades, GPA, or MCAT if you also provide <span className="text-[#b0b0a4]">context to interpret them</span>. These are already in the application.</li>
                  <li>Focus on <span className="text-[#b0b0a4]">behaviors you observed directly</span>. Describe the situation, the behavior, and any consequences.</li>
                  <li>Ask the applicant&apos;s permission before including <span className="text-[#b0b0a4]">private or sensitive information</span>.</li>
                  <li>Consider including <span className="text-[#b0b0a4]">unique contributions</span> — obstacles overcome, growth from challenges, or contributions to diversity.</li>
                  <li>If making <span className="text-[#b0b0a4]">comparisons</span>, provide context — the comparison group and your rationale.</li>
                </ol>
              </div>

              {/* AAMC Core Competencies */}
              <div className="panel-card relative mt-3 rounded-lg bg-[#262624] p-4 ring-1 ring-[#3a3a37]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-fk-screamer text-[11px] font-black uppercase tracking-widest text-yellow-300/60">AAMC Core Competencies</h4>
                  <button onClick={() => toggleStar('aamc-competencies')} className="group rounded-full p-1 transition-all hover:bg-yellow-300/10">
                    {starred.has('aamc-competencies') ? <FaStar className="text-xs text-yellow-300" /> : <FaRegStar className="text-xs text-[#5a5a55] group-hover:text-yellow-300/60" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#5a5a55] mb-4">Entry-level competencies admissions committees look for. You don&apos;t need to address all of these — just the ones you&apos;ve observed.</p>

                <div className="space-y-3">
                  <div>
                    <p className="mb-1.5 font-fk-screamer text-[10px] font-black uppercase tracking-widest text-[#5a5a55]">Thinking &amp; Reasoning</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Critical Thinking', 'Quantitative Reasoning', 'Scientific Inquiry', 'Written Communication'].map(c => (
                        <span key={c} className="rounded bg-[#2a2a28] px-2 py-0.5 text-[10px] text-[#6a6a65]">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 font-fk-screamer text-[10px] font-black uppercase tracking-widest text-[#5a5a55]">Science</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Living Systems', 'Human Behavior'].map(c => (
                        <span key={c} className="rounded bg-[#2a2a28] px-2 py-0.5 text-[10px] text-[#6a6a65]">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 font-fk-screamer text-[10px] font-black uppercase tracking-widest text-[#5a5a55]">Pre-Professional</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Service Orientation', 'Social Skills', 'Cultural Competence', 'Teamwork', 'Oral Communication', 'Ethical Responsibility', 'Reliability & Dependability', 'Resilience & Adaptability', 'Capacity for Improvement'].map(c => (
                        <span key={c} className="rounded bg-[#2a2a28] px-2 py-0.5 text-[10px] text-[#6a6a65]">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="sections-container mx-auto mt-4 flex max-w-6xl flex-col gap-4">
          {categories.map((cat) => {
            const isExpanded = expanded.has(cat.id);
            const isDragTarget = dragOverId === cat.id && draggedId !== cat.id;
            const isAcademics = cat.id === 'academics';
            const isPS = cat.id === 'personal-statement';
            const isSchools = cat.id === 'schools';
            const isProjects = cat.id === 'projects';
            const isSpecial = isAcademics || isPS || isProjects || isSchools;
            const hasStarredItems = isSpecial
              ? (isAcademics && SEMESTERS.some(s => starred.has(s.term)))
                || (isPS && starred.has('personal-statement'))
                || (isSchools && SCHOOL_LIST.some(t => t.schools.some(s => starred.has(s.name))))
                || (isProjects && PROJECT_NAMES.some(p => starred.has(p)))
              : cat.activities.some(a => starred.has(a.title));
            if (showStarredOnly && !hasStarredItems) return null;

            return (
              <div
                key={cat.id}
                ref={(el) => { if (el) sectionRefs.current.set(cat.id, el); }}
                className={`section-wrapper rounded-xl ring-1 transition-all duration-200 ${
                  isDragTarget
                    ? 'ring-yellow-300/60 bg-yellow-300/5'
                    : 'ring-[#3a3a37] bg-[#232321]'
                } ${draggedId === cat.id ? 'opacity-50' : ''}`}
                onDragOver={(e) => onDragOver(e, cat.id)}
                onDragLeave={onDragLeave}
                onDrop={() => onDrop(cat.id)}
              >
                {/* Section header */}
                <button
                  type="button"
                  className="section-header flex w-full cursor-pointer items-center gap-3 px-4 py-4 sm:px-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow-300/30 focus-visible:rounded-xl"
                  onClick={() => toggleSection(cat.id)}
                >
                  <span
                    draggable
                    onDragStart={(e) => { e.stopPropagation(); onDragStart(cat.id); }}
                    onDragEnd={onDragEnd}
                    className="cursor-grab text-[#5a5a55] hover:text-[#8a8a85] active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGripVertical className="text-sm" />
                  </span>

                  <span className="text-lg text-yellow-300">{cat.icon}</span>

                  <span className="font-fk-screamer text-lg font-black uppercase tracking-wide text-[#fffffc] sm:text-xl">
                    {cat.name}
                  </span>

                  {/* Badge */}
                  <span className="rounded-full bg-yellow-300/15 px-3 py-0.5 font-robert-regular text-xs font-medium text-yellow-300">
                    {isAcademics ? `${ACADEMICS.cumGPA} GPA` : isPS ? `${PERSONAL_STATEMENT.text.replace(/\n/g, '').length.toLocaleString()}/${PERSONAL_STATEMENT.maxChars.toLocaleString()}` : isSchools ? `${SCHOOL_COUNT} schools` : isProjects ? '11 projects' : `${formatHours(cat.hours)}h`}
                  </span>

                  <span className="hidden font-robert-regular text-xs text-[#5a5a55] sm:inline">
                    {isAcademics
                      ? `${SEMESTERS.length} semesters · ${ACADEMICS.totalCredits} credits`
                      : isPS
                      ? '5,300 char limit'
                      : isSchools
                      ? `${SCHOOL_LIST[0].schools.length} reach · ${SCHOOL_LIST[1].schools.length} target · ${SCHOOL_LIST[2].schools.length} baseline`
                      : isProjects
                      ? 'Software, AI, medical tech'
                      : `${cat.activities.length} ${cat.activities.length === 1 ? 'entry' : 'entries'}`}
                  </span>

                  <span className="ml-auto">
                    <FaChevronDown
                      className={`text-sm text-[#5a5a55] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {/* Collapsible content */}
                <div
                  ref={(el) => { if (el) collapseRefs.current.set(cat.id, el); }}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  {isAcademics ? renderAcademicContent() : isPS ? renderPersonalStatementContent() : isSchools ? renderSchoolsContent() : isProjects ? renderProjectsContent() : (
                    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-2">
                      {cat.activities.map((activity, idx) => {
                        const isStarred = starred.has(activity.title);
                        if (showStarredOnly && !isStarred) return null;
                        return (
                        <BentoTilt key={idx} className="inner-card h-full">
                          <div className={`flex h-full flex-col gap-3 rounded-lg p-5 ring-1 transition-all duration-200 ${
                            isStarred ? 'bg-yellow-300/[0.04] ring-yellow-300/20' : 'bg-[#2a2a28] ring-[#3a3a37]'
                          }`}>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-robert-medium text-sm font-semibold text-[#fffffc]">
                                {activity.title}
                              </h3>
                              <div className="flex shrink-0 items-center gap-1.5">
                                {activity.hours > 0 && (
                                  <span className="flex items-center gap-1 rounded-full bg-yellow-300/15 px-2 py-0.5 text-[11px] font-medium text-yellow-300">
                                    <MdAccessTime className="text-xs" />
                                    {formatHours(activity.hours)}h
                                  </span>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleStar(activity.title); }}
                                  className="group rounded-full p-1.5 transition-all duration-200 hover:bg-yellow-300/10"
                                >
                                  {isStarred
                                    ? <FaStar className="text-sm text-yellow-300 transition-transform duration-200 group-hover:scale-110" />
                                    : <FaRegStar className="text-sm text-[#5a5a55] transition-all duration-200 group-hover:text-yellow-300/60 group-hover:scale-110" />}
                                </button>
                              </div>
                            </div>

                            {activity.role && (
                              <div className="flex items-center gap-1.5 text-[#8a8a85]">
                                <FaUserTie className="shrink-0 text-[10px]" />
                                <span className="font-robert-regular text-xs">{activity.role}</span>
                              </div>
                            )}

                            {activity.contact && (
                              <div className="flex items-start gap-1.5 text-[#7f7f73]">
                                <FaUserMd className="mt-0.5 shrink-0 text-[10px]" />
                                <span className="font-robert-regular text-xs">{activity.contact}</span>
                              </div>
                            )}

                            {activity.location && (
                              <div className="flex items-center gap-1.5 text-[#7f7f73]">
                                <FaMapMarkerAlt className="shrink-0 text-[10px]" />
                                <span className="font-robert-regular text-xs">{activity.location}</span>
                              </div>
                            )}

                            {/* Description area with AAMC char count */}
                            {(() => {
                              const descCount = (activity.description || '').length;
                              return (
                                <div className="mt-1 rounded bg-[#232321] p-2.5">
                                  {descCount > 0 ? (
                                    <p className="font-robert-regular text-xs leading-relaxed text-[#8a8a85]">{activity.description}</p>
                                  ) : (
                                    <p className="font-robert-regular text-[11px] italic text-[#3a3a37]">No description yet</p>
                                  )}
                                  <div className="mt-1.5 flex items-center justify-end"><span className={`font-general text-[9px] tracking-wider ${descCount > 700 ? 'text-red-400' : 'text-[#3a3a37]'}`}>{descCount}/700</span></div>
                                </div>
                              );
                            })()}
                            {activity.mostMeaningful && (() => {
                              const essayCount = (activity.meaningfulEssay || '').length;
                              return (
                                <div className="mt-2 rounded bg-yellow-300/[0.03] p-2.5 ring-1 ring-yellow-300/10">
                                  <span className="mb-1.5 inline-block rounded-full bg-yellow-300/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-yellow-300">Most Meaningful</span>
                                  {essayCount > 0 ? (
                                    <p className="font-robert-regular text-xs leading-relaxed text-[#8a8a85]">{activity.meaningfulEssay}</p>
                                  ) : (
                                    <p className="font-robert-regular text-[11px] italic text-[#3a3a37]">No most meaningful essay yet</p>
                                  )}
                                  <div className="mt-1.5 flex items-center justify-end"><span className={`font-general text-[9px] tracking-wider ${essayCount > 1325 ? 'text-red-400' : 'text-[#3a3a37]'}`}>{essayCount}/1325</span></div>
                                </div>
                              );
                            })()}

                            <div className="mt-auto flex items-center justify-between pt-2">
                              {dateRange(activity) && (
                                <div className="flex items-center gap-1.5 text-[#5a5a55]">
                                  <FaCalendarAlt className="text-[10px]" />
                                  <span className="font-robert-regular text-[11px]">
                                    {dateRange(activity)}
                                  </span>
                                </div>
                              )}
                              {(activity.ongoing !== undefined) && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    activity.ongoing
                                      ? 'bg-green-400/15 text-green-400'
                                      : 'bg-[#3a3a37] text-[#7f7f73]'
                                  }`}
                                >
                                  {activity.ongoing ? 'Ongoing' : 'Completed'}
                                </span>
                              )}
                            </div>
                          </div>
                        </BentoTilt>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
