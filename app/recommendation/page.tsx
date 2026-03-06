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
  FaStar, FaCode, FaChalkboardTeacher, FaMusic, FaBook,
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

// ─── Personal Statement ──────────────────────────────────────────────────────

const PERSONAL_STATEMENT = {
  maxChars: 5300,
  text: `"Sit still - this always works!" I sat still as my father urged, breathing in the intense scent of mustard oil while he gently rubbed it across my chest. Within days, my cough would fade. My father's confidence was absolute: "Traditional remedies, beta. Passed down for generations." In our home, this remedy was our trusted cure whenever illness arose, that is... until the day my Nanaji (Grandfather) was diagnosed with leukemia.

Eight months later, the phone rang at 11AM. I already knew. The mustard oil sat unused on his nightstand in Amritsar, 8,000 miles away. No home remedy could reach through phone lines. The day after his funeral, I stared at my father's medicine cabinet, staring at our amber bottle of tiwana mustard oil. I unscrewed the cap, and it was that familiar intense scent, but now it smelled different. Not like comfort. Like limitations. Like all the questions, my father couldn't answer when I'd asked, "Why couldn't the doctors fix it?" In that moment, I understood: I didn't want to be limited to home remedies. I wanted to be the person with answers when home remedies weren't enough.

[DRAFT IN PROGRESS - Currently developing the narrative about exploring medicine, volunteer experiences, and path to physician...]`,
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
      { title: 'Mountain Peak Primary Care LLC', hours: 910, role: 'Medical Assistant (Volunteer)', contact: 'Hadee Ahmadi, FNP · (720) 710-4933', location: '9450 E Mississippi Ave, Unit B, Denver, CO 80247', startDate: '07/10/2024', ongoing: true, description: '', mostMeaningful: true },
      { title: 'Dignity Hospice of Colorado', hours: 80, role: 'Volunteer', contact: 'Jennifer (Volunteer Coordinator) · (720) 222-3315', location: '400 E 84th Ave, Suite W-202, Thornton, CO 80229', ongoing: true, description: '' },
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
      { title: 'Duerkop Lab — Dept. of Immunology & Microbiology', hours: 1448, role: 'Research Assistant Volunteer', contact: 'PI: Breck A. Duerkop, Ph.D. · breck.duerkop@cuanschutz.edu · Mentor: Shelby E. Andersen (Ph.D. Candidate) · shelby.andersen@cuanschutz.edu', location: 'CU Anschutz Medical Campus, 12800 E 19th Ave, Aurora, CO', startDate: '08/01/2024', ongoing: true, description: '', mostMeaningful: true },
      { title: '28th Annual Research & Creative Activities Symposium (RaCAS)', hours: 0, role: 'Presenter', description: 'Won best poster for Natural & Physical Sciences', location: 'CU Denver', startDate: '04/25/2025', endDate: '04/25/2025' },
    ],
  },
  {
    id: 'teaching',
    name: 'Teaching/Tutoring/Teaching Assistant',
    hours: 2344,
    icon: <FaChalkboardTeacher />,
    activities: [
      { title: 'CU Denver Learning Resources Center — Peer Tutoring', hours: 1156, role: 'Tutor', contact: 'Neecee Matthews-Bradshaw (Director) · tutorialservices@ucdenver.edu', location: 'Learning Commons, 1191 Larimer St, Denver, CO 80204', startDate: '08/23/2024', ongoing: true, description: '' },
      { title: 'CU Denver Learning Resources Center — Supplemental Learning', hours: 818, role: 'SL Leader', contact: 'Neecee Matthews-Bradshaw (Director) · tutorialservices@ucdenver.edu', location: 'Learning Commons, 1191 Larimer St, Denver, CO 80204', startDate: '08/23/2024', ongoing: true, description: '' },
      { title: 'CU Denver Learning Resources Center — Boost', hours: 370, role: 'Boost Program', contact: 'Neecee Matthews-Bradshaw (Director) · tutorialservices@ucdenver.edu', location: 'Learning Commons, 1191 Larimer St, Denver, CO 80204', startDate: '12/16/2024', ongoing: true, description: '' },
    ],
  },
  {
    id: 'employment-nonmedical',
    name: 'Paid Employment – Not Medical/Clinical',
    hours: 301,
    icon: <FaBriefcase />,
    activities: [
      { title: 'Kumon Math & Reading Center of Denver — Lowry', hours: 160, role: 'Math/Reading Tutor', contact: 'Celeste Kupperbusch (Certified Instructor) · celestekupperbusch@ikumon.com · (303) 968-1025', location: '100 Spruce St, Unit 102, Denver, CO 80230', startDate: '11/01/2023', endDate: 'Done', description: '' },
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
      { title: 'Programming', hours: 0, startDate: '06/01/2011', ongoing: true, description: '', mostMeaningful: true },
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
    default: return 'bg-white/10 text-white/40';
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
      <h1 className="font-fk-screamer text-3xl font-black uppercase text-white">
        Password Required
      </h1>
      <p className="font-robert-regular text-sm text-white/40 text-center">
        Enter the password to view the material.
      </p>
      <input
        type="text"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(false); }}
        placeholder="Enter password"
        className={`w-full rounded-lg bg-white/5 px-4 py-3 font-robert-regular text-sm text-white outline-none ring-1 transition-all duration-200 placeholder:text-white/20 ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-white/10 focus:ring-yellow-300/50'}`}
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
      'ThankyouShelby&Breck!': 'shelby-breck'
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
        <div className="inner-card flex flex-col items-center rounded-lg bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <span className="font-fk-screamer text-2xl font-black text-yellow-300">{ACADEMICS.cumGPA}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-white/40">Cumulative GPA</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <span className="font-fk-screamer text-2xl font-black text-yellow-300">{AMCAS_GPAS.bcpm}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-white/40">BCPM GPA</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <span className="font-fk-screamer text-2xl font-black text-white">{AMCAS_GPAS.ao}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-white/40">AO GPA</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <span className="font-fk-screamer text-2xl font-black text-white">{ACADEMICS.totalCredits}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-white/40">Total Credits</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <div className="flex items-center gap-1">
            <FaStar className="text-sm text-yellow-300" />
            <span className="font-fk-screamer text-2xl font-black text-white">{ACADEMICS.deansListCount}</span>
          </div>
          <span className="font-general text-[9px] uppercase tracking-wider text-white/40">Dean&apos;s List</span>
        </div>
        <div className="inner-card flex flex-col items-center rounded-lg bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <span className="font-fk-screamer text-2xl font-black text-white">{ACADEMICS.transferCredits}</span>
          <span className="font-general text-[9px] uppercase tracking-wider text-white/40">Transfer Credits</span>
        </div>
      </div>

      {/* University info */}
      <div className="inner-card mb-6 flex flex-wrap items-center gap-2 font-robert-regular text-xs text-white/40">
        <span className="rounded bg-white/5 px-2 py-1 text-white/60">{ACADEMICS.university}</span>
        <span className="rounded bg-white/5 px-2 py-1">{ACADEMICS.college}</span>
        <span className="rounded bg-white/5 px-2 py-1">Major: {ACADEMICS.major}</span>
        <span className="rounded bg-white/5 px-2 py-1">Minor: {ACADEMICS.minor}</span>
      </div>

      {/* AP & Transfer Credits */}
      <div className="inner-card mb-6 rounded-lg bg-white/[0.03] p-4 ring-1 ring-white/5">
        <h4 className="mb-3 font-fk-screamer text-xs font-black uppercase tracking-wider text-white/50">
          AP & Transfer Credits ({ACADEMICS.transferCredits} credits)
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-yellow-300/10 px-2 py-1 font-robert-regular text-[11px] text-yellow-300/70">
            CCA Transfer: {ACADEMICS.ccaCredits}cr
          </span>
          {AP_CREDITS.map((ap) => (
            <span key={ap.exam} className="rounded bg-white/5 px-2 py-1 font-robert-regular text-[11px] text-white/50">
              {ap.exam} <span className="text-white/25">→ {ap.equivalent}</span> <span className="text-yellow-300/70">{ap.credits}cr</span>
            </span>
          ))}
        </div>
      </div>

      {/* Semester cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SEMESTERS.map((sem) => (
          <div
            key={sem.term}
            className={`inner-card rounded-lg p-4 ring-1 ${
              sem.inProgress
                ? 'bg-yellow-300/[0.03] ring-yellow-300/20'
                : 'bg-white/[0.03] ring-white/8'
            }`}
          >
            {/* Semester header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-fk-screamer text-sm font-black uppercase tracking-wide text-white">
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
                <span className="font-robert-regular text-[11px] text-white/30">
                  {sem.credits}cr
                </span>
                {!sem.inProgress && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    sem.gpa === 4.0 ? 'bg-green-400/15 text-green-400' : 'bg-white/10 text-white/60'
                  }`}>
                    {sem.gpa.toFixed(3)}
                  </span>
                )}
              </div>
            </div>

            {/* Course rows */}
            <div className="flex flex-col gap-1.5">
              {sem.courses.map((course, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-white/[0.02] px-2 py-1.5">
                  <span className="w-[5.5rem] shrink-0 font-general text-[10px] tracking-wide text-white/30">
                    {course.code}
                  </span>
                  <span className="min-w-0 flex-1 flex items-center gap-1.5 truncate font-robert-regular text-xs text-white/60">
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
                  <span className="w-6 shrink-0 text-right font-general text-[10px] text-white/20">
                    {course.credits}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Render: Personal Statement section content ──────────────────────────

  const renderPersonalStatementContent = () => {
    const charCount = PERSONAL_STATEMENT.text.length;
    const maxChars = PERSONAL_STATEMENT.maxChars;
    const hasText = charCount > 0;
    return (
      <div className="px-4 pb-6 sm:px-6">
        <div className="inner-card rounded-lg bg-white/[0.03] p-5 ring-1 ring-white/10">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-fk-screamer text-xs font-black uppercase tracking-wider text-white/50">
              AMCAS Personal Statement
            </span>
            <span className={`font-general text-[10px] tracking-wider ${
              charCount > maxChars ? 'text-red-400' : charCount > maxChars * 0.9 ? 'text-amber-300/50' : 'text-white/20'
            }`}>
              {charCount.toLocaleString()}/{maxChars.toLocaleString()}
            </span>
          </div>
          {hasText ? (
            <p className="font-robert-regular text-sm leading-relaxed text-white/60 whitespace-pre-wrap">
              {PERSONAL_STATEMENT.text}
            </p>
          ) : (
            <p className="font-robert-regular text-sm italic text-white/15">
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
            <span className="font-robert-regular text-xs text-white/30">
              {tier.schools.length} {tier.schools.length === 1 ? 'school' : 'schools'}
            </span>
          </div>

          {/* School cards grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {tier.schools.map((school) => (
              <div
                key={school.name}
                className="inner-card flex flex-col gap-2 rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/10"
              >
                <div className="flex items-center gap-2">
                  {school.logo && (
                    <img
                      src={`/img/school-icons/${school.logo}`}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded object-contain"
                    />
                  )}
                  <span className="font-robert-medium text-xs text-white leading-tight">
                    {school.name}
                  </span>
                  {school.name === 'Harvard Medical School' && (
                    <span className="shrink-0 rounded-full bg-yellow-300/10 px-2 py-0.5 text-[9px] font-medium text-yellow-300 ring-1 ring-yellow-300/20">
                      Dream
                    </span>
                  )}
                </div>
                <span className="font-robert-regular text-[11px] text-white/50">
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Render: Projects section content ──────────────────────────────────────

  const renderProjectsContent = () => (
    <div className="flex flex-col gap-5 px-4 pb-6 sm:px-6">
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

      <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
        <BentoCard
          title={<img src="/img/synthr-logo-white.svg" alt="Synthr" className="h-12 md:h-16 w-auto pointer-events-none" />}
          description="A programming language purpose-built for ML pipelines. Tensor-native syntax, auto-differentiation, and GPU-first execution."
          ribbon="Complete"
          isComingSoon
        >
          <div className="size-full bg-black overflow-hidden font-mono text-xs sm:text-sm md:text-base leading-relaxed flex items-center justify-center px-6 py-20">
            <pre className="text-white/90 max-w-3xl" dangerouslySetInnerHTML={{ __html: synthrCodeHTML }} />
          </div>
        </BentoCard>
      </BentoTilt>

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

      <BentoTilt className="inner-card border-hsla relative h-72 w-full overflow-hidden rounded-md sm:h-80 md:h-96 bg-black">
        <BentoCard
          src="/videos/topographify.mp4"
          title={<img src="/img/topographify-logo-white.svg" alt="Topographify" className="h-12 md:h-16 w-auto pointer-events-none" />}
          description="Proprietary high-resolution terrain mapping and analysis. Real-time 3D topographic generation from satellite and LiDAR data."
          ribbon="Complete"
          isComingSoon
        />
      </BentoTilt>

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
    </div>
  );

  // ── Password screen ──────────────────────────────────────────────────────

  if (!unlocked) {
    return (
      <div className="relative min-h-screen w-screen bg-black">
        <NavBar />
        <div
          className={`fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded-lg bg-red-500/90 px-5 py-3 font-robert-regular text-sm text-white shadow-lg backdrop-blur-sm transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
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
    <div className="flex min-h-screen w-screen flex-col bg-black">
      <NavBar />

      <div ref={contentRef} className="flex-1 px-4 pb-20 pt-32 sm:px-8 md:px-16 lg:px-24">
        {/* Hero */}
        <div className="mx-auto max-w-6xl">
          <AnimatedTitle
            title="Rec<b>o</b>mmendation <br /> Mat<b>e</b>rial"
            containerClass="!text-left"
          />
          <div className="hero-sub mt-6 max-w-3xl font-robert-regular text-sm leading-relaxed text-white/50 space-y-3" style={{ opacity: 0 }}>
            {recipient === 'maron' && (
              <p><strong className="text-white/70">Hi Dr. Maron</strong> — Your speeches about your own experiences towards education and being in the position you are now were really motivating and eye-opening. They single-handedly influenced the amount of effort I gave to school and the perseverance I had.</p>
            )}

            {recipient === 'kim' && (
              <p><strong className="text-white/70">Hi Dr. Kim</strong> — I really appreciate your understanding when I absolutely failed my first biochem test. On top of that, thank you for letting me into your research and being a part of something meaningful.</p>
            )}

            {recipient === 'bull' && (
              <p><strong className="text-white/70">Hi Dr. Bull</strong> — You have been an immensely fantastic mentor. I really appreciate you letting me shadow once a month, which most people aren't able to do. You confirmed that I wanted to become a physician and made me realize I would love to be a medical director myself. Seeing what you do in that role has really made me appreciate that kind of work.</p>
            )}

            {recipient === 'hadee' && (
              <p><strong className="text-white/70">Hi Hadee</strong> — Thank you for letting me in without any hesitation, for talking to me kindly, and being understanding about my schedule. You've been one of the best mentors I've ever had. Seeing you as a provider for so many and being really understanding of patients and their situations will stick with me. I've learned lessons from you that I'll pass on to others as I continue my journey as a physician.</p>
            )}

            {recipient === 'shelby-breck' && (
              <>
                <p><strong className="text-white/70">Hi Breck</strong> — Thank you for trying something new and letting me into your lab when you'd never had an undergrad before, and for trusting that I would be more benefit than not. I appreciate you meeting with me to talk about my research and being so understanding.</p>

                <p><strong className="text-white/70">Hi Shelby</strong> — Thank you for letting me onto your project and helping me so many times, even with the silliest questions. You were always there to support me through my research journey and I'm really grateful for all you've done for me. I really hope the best for you after graduation, after you get your PhD, and that you do something you really want to do.</p>
              </>
            )}
          </div>

          {/* Top highlights */}
          <div className="mt-8 flex flex-wrap items-end gap-8">
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-yellow-300">
                {ACADEMICS.cumGPA}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-white/40">
                GPA
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-white">
                {formatHours(TOTAL_HOURS)}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-white/40">
                Total Hours
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-yellow-300">
                {ACTIVITY_COUNT}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-white/40">
                Activities
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-white">
                {SCHOOL_COUNT}
              </span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-white/40">
                Schools
              </span>
            </div>
            <div className="hero-highlight flex items-baseline gap-3" style={{ opacity: 0 }}>
              <span className="font-fk-screamer text-5xl font-black text-yellow-300">MCAT</span>
              <span className="font-robert-regular text-sm uppercase tracking-widest text-white/40">
                {(() => {
                  const now = new Date();
                  const testDate = new Date('2026-04-24');
                  const scoreDate = new Date('2026-05-27');
                  const daysToTest = Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const daysToScore = Math.ceil((scoreDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  if (daysToTest > 0) return `Apr 24 · ${daysToTest}d away`;
                  if (daysToScore > 0) return `Score May 27 · ${daysToScore}d`;
                  return 'Score Available';
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="sections-container mx-auto mt-16 flex max-w-6xl flex-col gap-4">
          {categories.map((cat) => {
            const isExpanded = expanded.has(cat.id);
            const isDragTarget = dragOverId === cat.id && draggedId !== cat.id;
            const isAcademics = cat.id === 'academics';
            const isPS = cat.id === 'personal-statement';
            const isSchools = cat.id === 'schools';
            const isProjects = cat.id === 'projects';
            const isSpecial = isAcademics || isPS || isProjects || isSchools;

            return (
              <div
                key={cat.id}
                ref={(el) => { if (el) sectionRefs.current.set(cat.id, el); }}
                className={`section-wrapper rounded-xl ring-1 transition-all duration-200 ${
                  isDragTarget
                    ? 'ring-yellow-300/60 bg-yellow-300/5'
                    : 'ring-white/10 bg-white/[0.02]'
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
                    className="cursor-grab text-white/20 hover:text-white/50 active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGripVertical className="text-sm" />
                  </span>

                  <span className="text-lg text-yellow-300">{cat.icon}</span>

                  <span className="font-fk-screamer text-lg font-black uppercase tracking-wide text-white sm:text-xl">
                    {cat.name}
                  </span>

                  {/* Badge */}
                  <span className="rounded-full bg-yellow-300/15 px-3 py-0.5 font-robert-regular text-xs font-medium text-yellow-300">
                    {isAcademics ? `${ACADEMICS.cumGPA} GPA` : isPS ? `${PERSONAL_STATEMENT.text.length.toLocaleString()}/${PERSONAL_STATEMENT.maxChars.toLocaleString()}` : isSchools ? `${SCHOOL_COUNT} schools` : isProjects ? '11 projects' : `${formatHours(cat.hours)}h`}
                  </span>

                  <span className="hidden font-robert-regular text-xs text-white/30 sm:inline">
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
                      className={`text-sm text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
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
                    <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
                      {cat.activities.map((activity, idx) => (
                        <BentoTilt key={idx} className="inner-card h-full">
                          <div className="flex h-full flex-col gap-3 rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-robert-medium text-sm font-semibold text-white">
                                {activity.title}
                              </h3>
                              {activity.hours > 0 && (
                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-300/15 px-2 py-0.5 text-[11px] font-medium text-yellow-300">
                                  <MdAccessTime className="text-xs" />
                                  {formatHours(activity.hours)}h
                                </span>
                              )}
                            </div>

                            {activity.role && (
                              <div className="flex items-center gap-1.5 text-white/50">
                                <FaUserTie className="shrink-0 text-[10px]" />
                                <span className="font-robert-regular text-xs">{activity.role}</span>
                              </div>
                            )}

                            {activity.contact && (
                              <div className="flex items-start gap-1.5 text-white/40">
                                <FaUserMd className="mt-0.5 shrink-0 text-[10px]" />
                                <span className="font-robert-regular text-xs">{activity.contact}</span>
                              </div>
                            )}

                            {activity.location && (
                              <div className="flex items-center gap-1.5 text-white/40">
                                <FaMapMarkerAlt className="shrink-0 text-[10px]" />
                                <span className="font-robert-regular text-xs">{activity.location}</span>
                              </div>
                            )}

                            {/* Description area with AAMC char count */}
                            {(() => {
                              const maxChars = activity.mostMeaningful ? 1325 : 700;
                              const charCount = (activity.description || '').length;
                              const hasDesc = charCount > 0;
                              return (
                                <div className="mt-1 rounded bg-white/[0.02] p-2.5">
                                  {activity.mostMeaningful && (
                                    <span className="mb-1.5 inline-block rounded-full bg-yellow-300/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-yellow-300">
                                      Most Meaningful
                                    </span>
                                  )}
                                  {hasDesc ? (
                                    <p className="font-robert-regular text-xs leading-relaxed text-white/50">
                                      {activity.description}
                                    </p>
                                  ) : (
                                    <p className="font-robert-regular text-[11px] italic text-white/15">
                                      No description yet
                                    </p>
                                  )}
                                  <div className="mt-1.5 flex items-center justify-end gap-1">
                                    <span className={`font-general text-[9px] tracking-wider ${
                                      charCount > maxChars ? 'text-red-400' : charCount > maxChars * 0.9 ? 'text-amber-300/50' : 'text-white/15'
                                    }`}>
                                      {charCount}/{maxChars}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}

                            <div className="mt-auto flex items-center justify-between pt-2">
                              {dateRange(activity) && (
                                <div className="flex items-center gap-1.5 text-white/30">
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
                                      : 'bg-white/10 text-white/40'
                                  }`}
                                >
                                  {activity.ongoing ? 'Ongoing' : 'Completed'}
                                </span>
                              )}
                            </div>
                          </div>
                        </BentoTilt>
                      ))}
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
