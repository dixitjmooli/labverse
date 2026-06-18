// ─── CBSE Syllabus (verified 2024-25 / 2025-26) ──────────────────────────────
// Source: cbseacademic.nic.in + rationalized NCERT textbooks
// Chapters listed in canonical NCERT order.
//
// This file is the SINGLE SOURCE OF TRUTH for the navigation tree:
//   Class → Subject → Chapter → Experiment
//
// Adding a new experiment does NOT require editing this file — only the
// experiment registry (`src/experiments/registry.ts`).

export type SubjectId = "science" | "maths" | "physics" | "chemistry" | "biology";

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  emoji: string;
  gradient: string; // tailwind gradient classes
}

export const SUBJECTS: SubjectMeta[] = [
  { id: "science",    name: "Science",    emoji: "🔬", gradient: "from-emerald-400 to-teal-500" },
  { id: "maths",      name: "Mathematics", emoji: "📐", gradient: "from-blue-400 to-indigo-500" },
  { id: "physics",    name: "Physics",    emoji: "🧲", gradient: "from-violet-400 to-purple-500" },
  { id: "chemistry",  name: "Chemistry",  emoji: "⚗️", gradient: "from-amber-400 to-orange-500" },
  { id: "biology",    name: "Biology",    emoji: "🧬", gradient: "from-rose-400 to-pink-500" },
];

export const CLASS_META = [
  { id: "9",  label: "Class 9",  emoji: "9️⃣", gradient: "from-sky-400 to-cyan-500",    subjects: ["science", "maths"] as SubjectId[] },
  { id: "10", label: "Class 10", emoji: "🔟", gradient: "from-cyan-400 to-blue-500",    subjects: ["science", "maths"] as SubjectId[] },
  { id: "11", label: "Class 11", emoji: "1️⃣1️⃣", gradient: "from-indigo-400 to-violet-500", subjects: ["physics", "chemistry", "maths", "biology"] as SubjectId[] },
  { id: "12", label: "Class 12", emoji: "1️⃣2️⃣", gradient: "from-violet-400 to-fuchsia-500", subjects: ["physics", "chemistry", "maths", "biology"] as SubjectId[] },
];

// ─── Chapter list per (class, subject) ───────────────────────────────────────
// Slug = URL-safe version of the chapter name; used in routes & registry keys.

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ChapterMeta {
  slug: string;
  name: string;
}

const RAW_SYLLABUS: Record<string, Partial<Record<SubjectId, string[]>>> = {
  "9": {
    science: [
      "Matter in Our Surroundings",
      "Is Matter Around Us Pure",
      "Atoms and Molecules",
      "Structure of the Atom",
      "The Fundamental Unit of Life",
      "Tissues",
      "Motion",
      "Force and Laws of Motion",
      "Gravitation",
      "Work and Energy",
      "Sound",
      "Improvement in Food Resources",
    ],
    maths: [
      "Number Systems",
      "Polynomials",
      "Coordinate Geometry",
      "Linear Equations in Two Variables",
      "Introduction to Euclid's Geometry",
      "Lines and Angles",
      "Triangles",
      "Quadrilaterals",
      "Circles",
      "Heron's Formula",
      "Surface Areas and Volumes",
      "Statistics",
    ],
  },
  "10": {
    science: [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Carbon and its Compounds",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce?",
      "Heredity",
      "Light – Reflection and Refraction",
      "The Human Eye and the Colourful World",
      "Electricity",
      "Magnetic Effects of Electric Current",
      "Our Environment",
    ],
    maths: [
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations",
      "Arithmetic Progressions",
      "Triangles",
      "Coordinate Geometry",
      "Introduction to Trigonometry",
      "Some Applications of Trigonometry",
      "Circles",
      "Areas Related to Circles",
      "Surface Areas and Volumes",
      "Statistics",
      "Probability",
    ],
  },
  "11": {
    physics: [
      "Units and Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work, Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves",
    ],
    chemistry: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements and Periodicity in Properties",
      "Chemical Bonding and Molecular Structure",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry – Some Basic Principles and Techniques",
      "Hydrocarbons",
    ],
    maths: [
      "Sets",
      "Relations and Functions",
      "Trigonometric Functions",
      "Complex Numbers and Quadratic Equations",
      "Linear Inequalities",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequences and Series",
      "Straight Lines",
      "Conic Sections",
      "Introduction to Three Dimensional Geometry",
      "Limits and Derivatives",
      "Statistics",
      "Probability",
    ],
    biology: [
      "The Living World",
      "Biological Classification",
      "Plant Kingdom",
      "Animal Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Structural Organisation in Animals",
      "Cell: The Unit of Life",
      "Biomolecules",
      "Cell Cycle and Cell Division",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development",
      "Digestion and Absorption",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and their Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration",
    ],
  },
  "12": {
    physics: [
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics: Materials, Devices and Simple Circuits",
    ],
    chemistry: [
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "The d- and f-Block Elements",
      "Coordination Compounds",
      "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
    ],
    maths: [
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives",
      "Integrals",
      "Application of Integrals",
      "Differential Equations",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Linear Programming",
      "Probability",
    ],
    biology: [
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Reproductive Health",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Evolution",
      "Human Health and Disease",
      "Microbes in Human Welfare",
      "Biotechnology: Principles and Processes",
      "Biotechnology and Its Applications",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation",
    ],
  },
};

// Final structured syllabus with slugs
export const SYLLABUS: Record<string, Record<SubjectId, ChapterMeta[]>> = Object.fromEntries(
  Object.entries(RAW_SYLLABUS).map(([cls, subjMap]) => [
    cls,
    Object.fromEntries(
      Object.entries(subjMap).map(([subj, chapters]) => [
        subj,
        (chapters as string[]).map((name) => ({ slug: slugify(name), name })),
      ])
    ) as Record<SubjectId, ChapterMeta[]>,
  ])
) as Record<string, Record<SubjectId, ChapterMeta[]>>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getClassMeta(classId: string) {
  return CLASS_META.find((c) => c.id === classId);
}

export function getSubjectMeta(subjectId: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.id === subjectId);
}

export function getChapters(classId: string, subjectId: string): ChapterMeta[] {
  return SYLLABUS[classId]?.[subjectId as SubjectId] ?? [];
}

export function getChapterMeta(classId: string, subjectId: string, chapterSlug: string): ChapterMeta | undefined {
  return getChapters(classId, subjectId).find((c) => c.slug === chapterSlug);
}
