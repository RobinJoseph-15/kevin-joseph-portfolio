export const navigation = [
  ["home", "Home"],
  ["about", "About"],
  ["expertise", "Expertise"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;

export const skillGroups = [
  {
    title: "CAD & Design",
    code: "01 / MODEL",
    skills: [
      {
        name: "SolidWorks",
        detail:
          "Parametric modelling of mechanical parts and assemblies. From an initial form to a coordinated engineering model.",
        tag: "MECHANICAL MODELLING",
      },
      {
        name: "CATIA",
        detail:
          "Part design, surface modelling and mechanical assemblies. Supported by CATIA Professional Certification.",
        tag: "PART & SURFACE DESIGN",
      },
      {
        name: "AutoCAD",
        detail:
          "Precise plant layouts, single-line diagrams and construction drawings for solar PV installations.",
        tag: "TECHNICAL DRAFTING",
      },
      {
        name: "SketchUp",
        detail:
          "Three-dimensional site and installation models that communicate spatial relationships and design intent.",
        tag: "SPATIAL VISUALISATION",
      },
    ],
  },
  {
    title: "Engineering",
    code: "02 / VALIDATE",
    skills: [
      {
        name: "STAAD",
        detail:
          "Structural analysis to support the validation of solar mounting structures and industrial frameworks.",
        tag: "STRUCTURAL ANALYSIS",
      },
      {
        name: "PVsyst",
        detail:
          "PV system simulation to assess system behaviour and support energy-output optimisation.",
        tag: "SOLAR SIMULATION",
      },
    ],
  },
  {
    title: "Documentation",
    code: "03 / DELIVER",
    skills: [
      {
        name: "Single-Line Diagrams",
        detail:
          "Clear electrical system diagrams for coordinated solar design and permit documentation.",
        tag: "ELECTRICAL DOCUMENTATION",
      },
      {
        name: "BOM Preparation",
        detail:
          "Structured bills of materials to communicate the components required by a design.",
        tag: "MATERIAL COORDINATION",
      },
      {
        name: "Technical Reports",
        detail:
          "Technical documentation, feasibility inputs and engineering reports that make design decisions traceable.",
        tag: "ENGINEERING COMMUNICATION",
      },
      {
        name: "MS Office",
        detail:
          "Organised spreadsheets, reports and presentations for cross-functional engineering coordination.",
        tag: "PROJECT DOCUMENTATION",
      },
    ],
  },
];

export type ProjectId = "ground" | "rooftop" | "tracker" | "mobile" | "battery";
export interface Project {
  id: ProjectId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string[];
  image: string;
  kind: "concept";
  caseStudy?: { title: string; content: string; verifiedAt: string };
}
export const projects: Project[] = [
  {
    id: "ground",
    number: "01",
    title: "Ground mount solar",
    subtitle: "FROM OPEN GROUND TO CLEAN ENERGY.",
    description:
      "Ground-mounted PV systems combine site planning, mounting structures and electrical coordination.",
    focus: ["Array layout", "Structural coordination", "System documentation"],
    image: "ground",
    kind: "concept",
  },
  {
    id: "rooftop",
    number: "02",
    title: "Solar rooftop",
    subtitle: "A NEW PURPOSE FOR EVERY ROOFLINE.",
    description:
      "Rooftop photovoltaics balance usable roof area, mounting geometry and building integration.",
    focus: ["Roof layout", "Mounting integration", "Construction drawings"],
    image: "rooftop",
    kind: "concept",
  },
  {
    id: "tracker",
    number: "03",
    title: "Solar tracker",
    subtitle: "PRECISION THAT FOLLOWS THE SUN.",
    description:
      "Solar tracking assemblies connect PV modules, rotating shafts and supported drive mechanisms.",
    focus: ["Mechanical assembly", "Axis of rotation", "Module support"],
    image: "tracker",
    kind: "concept",
  },
  {
    id: "mobile",
    number: "04",
    title: "Mobile home solar",
    subtitle: "ENERGY THAT MOVES WITH YOU.",
    description:
      "Mobile home solar brings rooftop generation and energy storage into compact living spaces.",
    focus: ["Compact integration", "Module placement", "Storage arrangement"],
    image: "mobile",
    kind: "concept",
  },
  {
    id: "battery",
    number: "05",
    title: "Battery storage system",
    subtitle: "THE CONNECTION BETWEEN NOW AND NEXT.",
    description:
      "Battery storage systems bring together enclosure design, ventilation, electrical integration and service access.",
    focus: ["Enclosure design", "System integration", "Service access"],
    image: "battery",
    kind: "concept",
  },
];

export const experience = [
  {
    company: "Jayaam Group",
    role: "Senior Design Engineer",
    discipline: "Business & Development",
    date: "MAR 2025 — PRESENT",
    current: true,
    responsibilities: [
      "Leads 3D design and engineering development for solar and industrial projects.",
      "Prepares plant layouts, single-line diagrams and construction drawings for rooftop and ground-mounted PV systems.",
      "Performs structural analysis using STAAD and optimises system output through PVsyst simulations.",
      "Supports proposals, feasibility studies and technical documentation.",
    ],
  },
  {
    company: "Illumine Industries Pvt Ltd",
    role: "Engineer II — Systems Design",
    discipline: "Renewables",
    date: "SEP 2022 — FEB 2025",
    current: false,
    responsibilities: [
      "Developed permit-ready solar design packages for residential and commercial projects.",
      "Worked with building codes, NEC standards and utility guidelines.",
      "Prepared single-line diagrams, bills of materials and technical documentation.",
      "Coordinated with structural, electrical and project teams.",
    ],
  },
];
