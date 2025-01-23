import type { CampaignInfo, MedicalEvidence, TrustIndicator } from "./types/campaign";

export const CAMPAIGN_INFO: CampaignInfo = {
  title: "Depo-Provera Brain Tumor Lawsuit Claims",
  phone: "(800) 555-0123",
  description: "URGENT: If you or a loved one developed a meningioma after using Depo-Provera, you may be entitled to significant compensation. Recent studies show users face a 550% higher risk of brain tumors. Time is limited to file your claim.",
  mainHeadline: "WARNING: Depo-Provera Users At Risk",
  subHeadline: "New Study Links Birth Control Drug to Dangerous Brain Tumors",
  symptoms: [
    "Severe Headaches",
    "Vision Problems",
    "Memory Issues",
    "Neurological Impairments",
    "Dizziness and Balance Issues",
    "Hearing Loss",
    "Cognitive Difficulties"
  ],
  qualifications: [
    "Used Depo-Provera between 1992 and present",
    "Received multiple Depo-Provera injections",
    "Diagnosed with meningioma brain tumor",
    "No prior legal representation for this claim"
  ],
  keyFacts: [
    "Scientific evidence shows 550% increased risk of brain tumors",
    "Many victims required emergency brain surgery",
    "Manufacturer failed to warn about known risks",
    "Time-limited window to file your claim",
    "Free case evaluation available 24/7"
  ],
  timeline: "URGENT: Legal deadlines may limit your time to file. Don't wait - call now to protect your rights.",
  legalStats: [
    { number: "$500K+", label: "Average Settlement" },
    { number: "550%", label: "Increased Risk" },
    { number: "1000s", label: "Affected Users" },
    { number: "FREE", label: "Case Review" }
  ],
  settlementInfo: {
    averageAmount: "Estimated $150,000 to $500,000",
    range: "$50,000 to over $1,000,000",
    timeline: "12-24 months from filing to settlement",
    process: [
      "Free 5-minute case evaluation",
      "No upfront costs or fees",
      "Experienced legal team reviews your case",
      "We handle all paperwork and legal proceedings",
      "You receive your compensation"
    ]
  }
};

export const TRUST_BADGES: TrustIndicator[] = [
  { title: "24/7 Free Case Review", icon: "PhoneCall" },
  { title: "No Fee Unless You Win", icon: "Shield" },
  { title: "Maximum Compensation", icon: "DollarSign" },
  { title: "5-Star Legal Team", icon: "Star" }
];

export const REVIEWS = [
  {
    name: "Sarah M.",
    text: "After my brain tumor diagnosis, I was devastated. The legal team fought tirelessly for me and secured a settlement that covered all my medical expenses.",
    rating: 5
  },
  {
    name: "Jennifer R.",
    text: "I had no idea Depo-Provera could cause brain tumors. Thanks to their expert legal help, I received the compensation I deserved for my suffering.",
    rating: 5
  },
  {
    name: "Maria L.",
    text: "The process was simple and stress-free. They handled everything while I focused on my recovery. I'm grateful for their support and expertise.",
    rating: 5
  }
];

export const MEDICAL_EVIDENCE: MedicalEvidence = {
  studyTitle: "Association Between Medroxyprogesterone Acetate and Intracranial Meningioma Risk",
  studyDate: "2024",
  studyUrl: "https://www.example.com/depo-provera-study",
  keyFindings: [
    "550% higher risk of meningioma in long-term users",
    "Risk increases with each injection",
    "Brain tumors found in critical locations",
    "Many cases require invasive surgery"
  ]
};

export const DISCLAIMER = `
This is an advertisement for legal services. This website is not associated with Pfizer, Pharmacia & Upjohn, or any government agency. 
This website is not a lawyer referral service or prepaid legal services plan. Do not send any confidential information through this website.

Medical Study Citation: The risk statistics cited are based on the study "${MEDICAL_EVIDENCE.studyTitle}" (${MEDICAL_EVIDENCE.studyDate}). 
View the complete study at: ${MEDICAL_EVIDENCE.studyUrl}
`;