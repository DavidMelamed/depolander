export interface CampaignInfo {
  title: string;
  phone: string;
  description: string;
  mainHeadline: string;
  subHeadline: string;
  symptoms: string[];
  qualifications: string[];
  keyFacts: string[];
  timeline: string;
  legalStats: {
    number: string;
    label: string;
  }[];
  settlementInfo: {
    averageAmount?: string;
    range?: string;
    timeline?: string;
    process: string[];
  };
}

export interface MedicalEvidence {
  studyTitle: string;
  studyDate: string;
  studyUrl: string;
  keyFindings: string[];
}

export interface TrustIndicator {
  title: string;
  icon: string;
}

export interface DisclaimerInfo {
  legalDisclaimer: string;
  medicalDisclaimer: string;
  studyCitation: string;
}
