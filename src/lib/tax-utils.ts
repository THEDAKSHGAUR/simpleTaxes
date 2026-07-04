// Indian Tax Calculation Utilities
// Based on FY 2024-25 (AY 2025-26) tax slabs

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  healthAndEducationCess: number;
  totalTax: number;
  effectiveRate: number;
}

// New Regime Tax Slabs (FY 2025-26)
//0-4L:0%, 4-8L:5%, 8-12L:10%, 12-16L:15%, 16-20L:20%, 20-24L:25%, >24L:30%
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 5 },
  { min: 800000, max: 1200000, rate: 10 },
  { min: 1200000, max: 1600000, rate: 15 },
  { min: 1600000, max: 2000000, rate: 20 },
  { min: 2000000, max: null, rate: 30 },
  { min: 2400000, max: null, rate: 30 },
];

// Old Regime Tax Slabs (FY 2024-25)
export const OLD_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: null, rate: 30 },
];

export interface DeductionSection {
  section: string;
  name: string;
  maxLimit: number | null;
  description: string;
}
export const STANDARD_DEDUCTION = {
  new: 75000,
  old: 50000,
};
export const DEDUCTION_SECTIONS: DeductionSection[] = [
  {
    section: '80C',
    name: 'Section 80C',
    maxLimit: 150000,
    description: 'Investments in PPF, EPF, ELSS, Life Insurance Premium, Tuition Fees, etc.',
  },
  {
    section: '80CCC',
    name: 'Section 80CCC',
    maxLimit: 150000,
    description: 'Contribution to pension fund of LIC or other insurer',
  },
  {
    section: '80CCD(1)',
    name: 'Section 80CCD(1)',
    maxLimit: 100000,
    description: 'Contribution to NPS (within overall 80C limit)',
  },
  {
    section: '80CCD(1B)',
    name: 'Section 80CCD(1B)',
    maxLimit: 50000,
    description: 'Additional contribution to NPS (over and above 80C limit)',
  },
  {
    section: '80D',
    name: 'Section 80D',
    maxLimit: 75000,
    description: 'Health Insurance Premium (Self + Family + Parents)',
  },
  {
    section: '80DD',
    name: 'Section 80DD',
    maxLimit: 75000,
    description: 'Medical treatment for disabled dependent',
  },
  {
    section: '80DDB',
    name: 'Section 80DDB',
    maxLimit: 100000,
    description: 'Medical treatment for specified diseases',
  },
  {
    section: '80E',
    name: 'Section 80E',
    maxLimit: null,
    description: 'Interest on education loan (no limit, for 8 years)',
  },
  {
    section: '80EE',
    name: 'Section 80EE',
    maxLimit: 50000,
    description: 'Interest on home loan for first-time buyers',
  },
  {
    section: '80EEA',
    name: 'Section 80EEA',
    maxLimit: 150000,
    description: 'Additional interest on home loan for affordable housing',
  },
  {
    section: '80G',
    name: 'Section 80G',
    maxLimit: null,
    description: 'Donations to charitable institutions',
  },
  {
    section: '80TTA',
    name: 'Section 80TTA',
    maxLimit: 10000,
    description: 'Interest from savings bank account',
  },
  {
    section: '80TTB',
    name: 'Section 80TTB',
    maxLimit: 50000,
    description: 'Interest from deposits for senior citizens',
  },
  {
    section: '80U',
    name: 'Section 80U',
    maxLimit: 75000,
    description: 'Disability certificate holder',
  },
];

export interface HRAExemption {
  hraReceived: number;
  rentPaid: number;
  basicSalary: number;
  cityType: 'metro' | 'non-metro';
}

export function calculateHRAExemption(details: HRAExemption): number {
  const { hraReceived, rentPaid, basicSalary, cityType } = details;
  
  // Condition 1: Actual HRA received
  const exemption1 = hraReceived;
  
  // Condition 2: Rent paid minus 10% of basic salary
  const exemption2 = rentPaid - 0.1 * basicSalary;
  
  // Condition 3: 50% of basic salary for metro, 40% for non-metro
  const exemption3 = cityType === 'metro' ? 0.5 * basicSalary : 0.4 * basicSalary;
  
  return Math.min(exemption1, Math.max(0, exemption2), exemption3);
}

export function calculateTax(
  income: number,
  deductions: number,
  regime: 'new' | 'old' = 'new',
  isSalaried: boolean = true
): TaxResult {
  const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

  const standardDeduction = isSalaried ? STANDARD_DEDUCTION[regime] : 0;
  const otherDeductions = regime === 'old' ? deductions : 0;
  const totalDeductions = standardDeduction + otherDeductions;

  const taxableIncome = Math.max(0, income - totalDeductions);

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;
    const slabMax = slab.max || Infinity;
    const taxableInSlab = Math.min(remainingIncome, slabMax - slab.min);
    if (taxableInSlab > 0) {
      tax += (taxableInSlab * slab.rate) / 100;
      remainingIncome -= taxableInSlab;
    }
  }

  if (regime === 'new') {
    const REBATE_THRESHOLD = 1200000;
    if (taxableIncome <= REBATE_THRESHOLD) {
      tax = 0;
    } else {
      const excessIncome = taxableIncome - REBATE_THRESHOLD;
      if (tax > excessIncome) tax = excessIncome;
    }
  } else if (regime === 'old' && taxableIncome <= 500000) {
    tax = Math.max(0, tax - 12500);
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    grossIncome: income,
    totalDeductions,
    taxableIncome,
    taxBeforeCess: tax,
    healthAndEducationCess: cess,
    totalTax,
    effectiveRate,
  };
}

export function compareRegimes(income: number, deductions: number): {
  newRegime: TaxResult;
  oldRegime: TaxResult;
  recommended: 'new' | 'old';
  savings: number;
} {
  const newRegime = calculateTax(income, 0, 'new');
  const oldRegime = calculateTax(income, deductions, 'old');
  
  const recommended = newRegime.totalTax < oldRegime.totalTax ? 'new' : 'old';
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);
  
  return {
    newRegime,
    oldRegime,
    recommended,
    savings,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface CapitalGains {
  type: 'STCG' | 'LTCG' | 'STCG_debt' | 'LTCG_debt';
  amount: number;
}

export function calculateCapitalGainsTax(gains: CapitalGains[]): number {
  let totalTax = 0;
  
  for (const gain of gains) {
    switch (gain.type) {
      case 'STCG':
        // Equity STCG: 15% on gains above ₹1 lakh
        const stcgExempt = Math.min(100000, gain.amount);
        const stcgTaxable = gain.amount - stcgExempt;
        totalTax += stcgTaxable * 0.15;
        break;
      case 'LTCG':
        // Equity LTCG: 10% on gains above ₹1.25 lakh
        const ltcgExempt = Math.min(125000, gain.amount);
        const ltcgTaxable = gain.amount - ltcgExempt;
        totalTax += ltcgTaxable * 0.10;
        break;
      case 'STCG_debt':
        // Debt STCG: Taxed as per slab rates
        totalTax += gain.amount; // Will be added to income and taxed at slab rates
        break;
      case 'LTCG_debt':
        // Debt LTCG: 20% with indexation
        totalTax += gain.amount * 0.20;
        break;
    }
  }
  
  return totalTax;
}
