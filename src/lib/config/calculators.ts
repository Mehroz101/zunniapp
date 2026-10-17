export type CalculatorCategory = 'financial' | 'specialized';

export interface CalculatorField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'slider';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface CalculatorFormulaStep {
  step: number;
  title: string;
  formula: string;
  description: string;
}

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculationResult {
  primaryValue: string;
  primaryLabel: string;
  primarySubtext: string;
  summary: { label: string; value: string }[];
  breakdown: { label: string; percentage: number; color?: string; amount?: string }[];
}

export interface CalculatorDefinition {
  slug: string;
  title: string;
  tagline: string;
  category: CalculatorCategory;
  categoryLabel: string;
  description: string;
  icon: string;
  badge: string;
  tags: string[];
  status: 'ready';
  primaryUnit: string;
  fields: CalculatorField[];
  formulaSteps: CalculatorFormulaStep[];
  usageGuide: { step: number; title: string; text: string }[];
  faqs: CalculatorFaq[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
}

export const CALCULATORS_REGISTRY: Record<string, CalculatorDefinition> = {
  // ── AUTO LOAN TRADE-IN EQUITY CALCULATOR ──
  'auto-loan-trade-in-equity-calculator': {
    slug: 'auto-loan-trade-in-equity-calculator',
    title: 'Auto Loan Trade–In Equity Calculator',
    tagline: 'Determines auto loan trade-in equity from relevant inputs and returns a dedicated result for borrowing and repayment planning.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Determines auto loan trade-in equity from relevant inputs and returns a dedicated result for borrowing and repayment planning.',
    icon: 'Car',
    badge: 'Trade-In Equity Engine',
    tags: ['auto loan', 'trade-in', 'car equity', 'negative equity', 'underwater loan', 'sales tax credit', 'car payment'],
    status: 'ready',
    primaryUnit: '$',
    fields: [
      { id: 'tradeValue', label: 'Dealer Trade–In Market Value ($) *', type: 'number', defaultValue: 15000, min: 0, max: 500000, step: 500, unit: '$' },
      { id: 'loanPayoff', label: 'Current Auto Loan Payoff Balance ($) *', type: 'number', defaultValue: 11000, min: 0, max: 500000, step: 500, unit: '$' },
      { id: 'newPrice', label: 'New Vehicle Purchase Price ($) *', type: 'number', defaultValue: 32000, min: 500, max: 1000000, step: 500, unit: '$' },
      { id: 'taxRate', label: 'State Sales Tax Rate (%) *', type: 'number', defaultValue: 6, min: 0, max: 20, step: 0.1, unit: '%' },
      { id: 'downPayment', label: 'Additional Cash Down Payment ($) *', type: 'number', defaultValue: 1000, min: 0, max: 500000, step: 100, unit: '$' },
    ],
    formulaSteps: [
      { step: 1, title: 'Net Trade-In Equity (E_net)', formula: 'E_net = V_trade - B_loan', description: 'Difference between dealer trade-in market value and current loan payoff balance. Positive reduces loan; negative rolls debt.' },
      { step: 2, title: 'Taxable Base Price (P_taxable)', formula: 'P_taxable = max(0, P_new - V_trade)', description: 'In most states, sales tax is assessed solely on difference between new vehicle purchase price and trade value.' },
      { step: 3, title: 'Net Sales Tax Liability (T_net)', formula: 'T_net = P_taxable * (Tax_rate / 100)', description: 'Actual state sales tax owed after applying dealer trade-in tax credit.' },
      { step: 4, title: 'Tax Dollars Saved via Credit (T_saved)', formula: 'T_saved = min(P_new, V_trade) * (Tax_rate / 100)', description: 'Direct sales tax dollars saved compared to purchasing without a trade-in credit.' },
      { step: 5, title: 'Final Net Financed Principal (P_financed)', formula: 'P_financed = (P_new + T_net) - E_net - D_cash', description: 'Total loan principal required to finance the purchase after factoring net equity, taxes, and down payment.' },
    ],
    usageGuide: [
      { step: 1, title: 'Enter Dealer Trade-In Market Value', text: 'Obtain current wholesale trade appraisal or fair market trade value quote.' },
      { step: 2, title: 'Input Exact Auto Loan Payoff', text: 'Obtain official 10-day payoff balance from current auto lender.' },
      { step: 3, title: 'Specify New Vehicle MSRP / Price', text: 'Input negotiated out-the-door vehicle price before local government taxes.' },
      { step: 4, title: 'Apply Sales Tax & Cash Down', text: 'Set state tax rate and cash down payment to view exact financed principal.' },
    ],
    faqs: [
      { question: 'What is positive vs negative auto trade-in equity?', answer: 'Positive equity occurs when your car is worth more than the remaining balance on your auto loan (Trade Value > Loan Balance). Negative equity (being "underwater" or "upside-down") occurs when you owe more than the dealer trade appraisal. Negative equity is rolled into the new loan, increasing monthly payments.' },
      { question: 'How does a trade-in save money on state sales tax?', answer: 'Most US states provide a trade-in sales tax credit, where sales tax is only levied on the difference between the new car purchase price and your trade-in allowance (P_new - V_trade). For example, at a 6% tax rate, a $15,000 trade-in saves $900 in state sales taxes.' },
      { question: 'Can I trade in a financed vehicle with negative equity?', answer: 'Yes. Lenders allow negative equity to be rolled over into the new loan up to certain Loan-to-Value (LTV) limits (typically 120%-140%). However, rolling negative equity increases borrowing costs, total interest, and leaves you immediately underwater on the new vehicle.' },
      { question: 'Is dealer trade-in better than a private party sale?', answer: 'Private party sales usually command 10% to 20% higher purchase prices, but require advertising, safety inspections, title transfers, and dealing with buyers. A dealer trade-in offers instant convenience, eliminates lien payoff paperwork, and provides instant sales tax credits that often offset the lower trade value.' },
    ],
    calculate: (inputs) => {
      const vTrade = Number(inputs.tradeValue ?? 15000);
      const bLoan = Number(inputs.loanPayoff ?? 11000);
      const pNew = Number(inputs.newPrice ?? 32000);
      const taxRate = Number(inputs.taxRate ?? 6);
      const dCash = Number(inputs.downPayment ?? 1000);

      const eNet = vTrade - bLoan;
      const pTaxable = Math.max(0, pNew - vTrade);
      const tNet = pTaxable * (taxRate / 100);
      const tSaved = Math.min(pNew, vTrade) * (taxRate / 100);
      const pFinanced = (pNew + tNet) - eNet - dCash;

      const formattedFinanced = `$${Math.max(0, pFinanced).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const formattedEquity = eNet >= 0
        ? `+$${eNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Positive Equity)`
        : `-$${Math.abs(eNet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Underwater Rollover)`;

      return {
        primaryValue: formattedFinanced,
        primaryLabel: 'Final Net Amount to Finance',
        primarySubtext: eNet >= 0
          ? `Includes $${eNet.toLocaleString('en-US', { minimumFractionDigits: 2 })} positive equity applied`
          : `Includes $${Math.abs(eNet).toLocaleString('en-US', { minimumFractionDigits: 2 })} negative equity rolled over`,
        summary: [
          { label: 'Net Trade-In Equity', value: formattedEquity },
          { label: 'Sales Tax Saved', value: `$${tSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Saved` },
          { label: 'Net Sales Tax Owed', value: `$${tNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
          { label: 'Taxable Base Price', value: `$${pTaxable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
          { label: 'Additional Cash Down Payment', value: `-$${dCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        ],
        breakdown: [
          { label: 'New Vehicle Base', percentage: pFinanced > 0 ? Math.min(100, Math.round((pNew / pFinanced) * 100)) : 100, amount: `$${pNew.toLocaleString()}` },
          { label: 'Net Sales Tax', percentage: pFinanced > 0 ? Math.round((tNet / pFinanced) * 100) : 0, amount: `$${tNet.toLocaleString()}` },
          { label: 'Net Equity Effect', percentage: pFinanced > 0 ? Math.round((Math.abs(eNet) / pFinanced) * 100) : 0, amount: formattedEquity },
        ],
      };
    },
  },

  // ── 1. LOAN CALCULATOR ──
  'loan-calculator': {
    slug: 'loan-calculator',
    title: 'Loan & EMI Amortization Calculator',
    tagline: 'Calculate monthly loan payments (EMI), interest totals, and amortization schedules.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Instant, precise loan calculator providing exact monthly payments, total accrued interest, and total cost of borrowing across fixed-rate terms.',
    icon: 'DollarSign',
    badge: 'Amortization Engine',
    tags: ['loan', 'emi', 'mortgage', 'interest', 'amortization', 'finance', 'debt'],
    status: 'ready',
    primaryUnit: '$',
    fields: [
      { id: 'principal', label: 'Loan Amount', type: 'number', defaultValue: 250000, min: 1000, max: 10000000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'slider', defaultValue: 6.5, min: 0.1, max: 30, step: 0.1, unit: '%' },
      { id: 'years', label: 'Loan Term (Years)', type: 'select', defaultValue: '30', options: [
        { label: '5 Years', value: '5' },
        { label: '10 Years', value: '10' },
        { label: '15 Years', value: '15' },
        { label: '20 Years', value: '20' },
        { label: '25 Years', value: '25' },
        { label: '30 Years', value: '30' },
      ]},
    ],
    formulaSteps: [
      { step: 1, title: 'Periodic Interest Rate', formula: 'r = AnnualRate / 12 / 100', description: 'Convert nominal annual rate to monthly decimal rate.' },
      { step: 2, title: 'Total Number of Periods', formula: 'n = TermYears * 12', description: 'Determine total monthly installment cycles.' },
      { step: 3, title: 'Fixed Monthly Payment (EMI)', formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]', description: 'Calculate constant monthly payment that fully amortizes the principal.' },
    ],
    usageGuide: [
      { step: 1, title: 'Enter Principal Amount', text: 'Specify the total initial borrowing amount excluding down payments.' },
      { step: 2, title: 'Calibrate Interest Rate', text: 'Input the fixed APR offered by your lender or financial institution.' },
      { step: 3, title: 'Select Term Horizon', text: 'Choose your desired payback period to observe immediate monthly cash impact.' },
    ],
    faqs: [
      { question: 'What does EMI stand for?', answer: 'EMI stands for Equated Monthly Installment. It represents the fixed payment made by a borrower to a lender at a specified date each month.' },
      { question: 'How is total interest calculated?', answer: 'Total interest equals the cumulative payments over the entire loan horizon minus the original principal borrowed.' },
      { question: 'Can I pay off the loan early to reduce interest?', answer: 'Yes, additional principal payments reduce the remaining balance, thereby diminishing future compound interest charges.' },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const annualRate = Number(inputs.rate) || 0;
      const years = Number(inputs.years) || 30;
      const r = annualRate / 12 / 100;
      const n = years * 12;

      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPayment = emi * n;
      const totalInterest = Math.max(0, totalPayment - p);
      const principalPct = totalPayment > 0 ? Math.round((p / totalPayment) * 100) : 50;
      const interestPct = 100 - principalPct;

      return {
        primaryValue: `$${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        primaryLabel: 'Monthly Payment (EMI)',
        primarySubtext: `Based on ${years} years at ${annualRate}% APR`,
        summary: [
          { label: 'Principal Borrowed', value: `$${p.toLocaleString()}` },
          { label: 'Total Interest Payable', value: `$${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
          { label: 'Total Repayment Cost', value: `$${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
          { label: 'Payment Cycles', value: `${n} Monthly Payments` },
        ],
        breakdown: [
          { label: 'Principal', percentage: principalPct, amount: `$${p.toLocaleString()}`, color: 'bg-emerald-500' },
          { label: 'Total Interest', percentage: interestPct, amount: `$${Math.round(totalInterest).toLocaleString()}`, color: 'bg-amber-500' },
        ],
      };
    },
  },

  // ── 2. INVESTMENT CALCULATOR ──
  'investment-calculator': {
    slug: 'investment-calculator',
    title: 'Investment Compound Interest & ROI Calculator',
    tagline: 'Forecast portfolio growth, compound interest yields, and future valuations.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Model future investment portfolios with periodic contributions, compound interest cycles, and inflation considerations.',
    icon: 'TrendingUp',
    badge: 'Wealth Engine',
    tags: ['investment', 'compound-interest', 'roi', 'portfolio', 'cagr', 'stocks', 'wealth'],
    status: 'ready',
    primaryUnit: '$',
    fields: [
      { id: 'initialDeposit', label: 'Starting Capital', type: 'number', defaultValue: 10000, min: 0, max: 10000000, step: 500, unit: '$' },
      { id: 'monthlyContribution', label: 'Monthly Deposit', type: 'number', defaultValue: 500, min: 0, max: 100000, step: 50, unit: '$' },
      { id: 'returnRate', label: 'Expected Annual Return (%)', type: 'slider', defaultValue: 8.0, min: 1, max: 30, step: 0.5, unit: '%' },
      { id: 'years', label: 'Investment Horizon (Years)', type: 'slider', defaultValue: 20, min: 1, max: 50, step: 1, unit: 'Years' },
    ],
    formulaSteps: [
      { step: 1, title: 'Compound Interest on Initial Principal', formula: 'FV_initial = P * (1 + r/n)^(n*t)', description: 'Calculate appreciation on lump-sum principal.' },
      { step: 2, title: 'Future Value of Annuity Stream', formula: 'FV_annuity = PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]', description: 'Accumulate periodic recurring deposits.' },
      { step: 3, title: 'Total Portfolio Valuation', formula: 'Total = FV_initial + FV_annuity', description: 'Sum combined compound assets at terminal date.' },
    ],
    usageGuide: [
      { step: 1, title: 'Set Starting Balance', text: 'Enter current portfolio valuation or seed deposit.' },
      { step: 2, title: 'Define Monthly Savings Rate', text: 'Determine ongoing contributions added at the end of each period.' },
      { step: 3, title: 'Select Annualized Return Target', text: 'S&P 500 historically averages ~7-10% long-term annualized returns.' },
    ],
    faqs: [
      { question: 'What is Compound Interest?', answer: 'Compound interest is the interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods.' },
      { question: 'Does this account for capital gains taxes?', answer: 'This calculation reflects pre-tax gross asset accumulation unless held within tax-advantaged vehicles (e.g. 401k/IRA).' },
      { question: 'How does time horizon impact compounding?', answer: 'Compounding accelerates exponentially over time; returns in year 20 often exceed the total contributions of the first decade.' },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.initialDeposit) || 0;
      const pmt = Number(inputs.monthlyContribution) || 0;
      const r = (Number(inputs.returnRate) || 0) / 100;
      const t = Number(inputs.years) || 10;
      const n = 12;

      const fvInitial = p * Math.pow(1 + r / n, n * t);
      const fvAnnuity = r > 0 ? pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) : pmt * n * t;
      const totalFV = fvInitial + fvAnnuity;
      const totalContributed = p + pmt * n * t;
      const totalInterest = Math.max(0, totalFV - totalContributed);

      const contribPct = totalFV > 0 ? Math.round((totalContributed / totalFV) * 100) : 50;
      const interestPct = 100 - contribPct;

      return {
        primaryValue: `$${Math.round(totalFV).toLocaleString()}`,
        primaryLabel: 'Future Portfolio Value',
        primarySubtext: `Growth over ${t} years at ${Math.round(r * 100)}% return`,
        summary: [
          { label: 'Total Invested Capital', value: `$${Math.round(totalContributed).toLocaleString()}` },
          { label: 'Total Compound Growth', value: `$${Math.round(totalInterest).toLocaleString()}` },
          { label: 'Initial Deposit', value: `$${p.toLocaleString()}` },
          { label: 'Periodic Contributions', value: `$${Math.round(pmt * n * t).toLocaleString()}` },
        ],
        breakdown: [
          { label: 'Total Contributions', percentage: contribPct, amount: `$${Math.round(totalContributed).toLocaleString()}`, color: 'bg-indigo-500' },
          { label: 'Compound Returns', percentage: interestPct, amount: `$${Math.round(totalInterest).toLocaleString()}`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 3. TAX CALCULATOR ──
  'tax-calculator': {
    slug: 'tax-calculator',
    title: 'Income Tax & Net Paycheck Calculator',
    tagline: 'Estimate federal tax liabilities, deductions, and take-home net salary.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Calculate effective tax rates, marginal bracket exposure, and net disposable income after standard deductions.',
    icon: 'Receipt',
    badge: 'Tax Diagnostics',
    tags: ['tax', 'income-tax', 'salary', 'take-home', 'net-pay', 'deductions', 'w2'],
    status: 'ready',
    primaryUnit: '$',
    fields: [
      { id: 'grossIncome', label: 'Gross Annual Salary ($)', type: 'number', defaultValue: 95000, min: 0, max: 2000000, step: 1000, unit: '$' },
      { id: 'filingStatus', label: 'Filing Status', type: 'select', defaultValue: 'single', options: [
        { label: 'Single', value: 'single' },
        { label: 'Married Filing Jointly', value: 'married' },
        { label: 'Head of Household', value: 'hoh' },
      ]},
      { id: 'deductions', label: 'Additional Pre-Tax Deductions (401k, HSA)', type: 'number', defaultValue: 6000, min: 0, max: 50000, step: 500, unit: '$' },
    ],
    formulaSteps: [
      { step: 1, title: 'Adjusted Gross Income (AGI)', formula: 'AGI = Gross - PreTaxDeductions', description: 'Deduct qualifying pre-tax retirement and health savings.' },
      { step: 2, title: 'Apply Standard Deduction', formula: 'TaxableIncome = max(0, AGI - StandardDeduction)', description: 'Offset $14,600 (Single) or $29,200 (Married) standard exemption.' },
      { step: 3, title: 'Progressive Tax Brackets', formula: 'Tax = sum(BracketIncome * Rate)', description: 'Calculate liability across tiered progressive tax brackets.' },
    ],
    usageGuide: [
      { step: 1, title: 'Input Annual Gross Income', text: 'Include base salary, expected bonuses, and gross freelance earnings.' },
      { step: 2, title: 'Set Tax Filing Category', text: 'Select legal IRS filing classification.' },
      { step: 3, title: 'Add Pre-Tax Deductions', text: 'Incorporate elective contributions to 401(k), HSA, or FSA accounts.' },
    ],
    faqs: [
      { question: 'What is the difference between marginal and effective tax rate?', answer: 'Marginal rate is the tax rate applied to your highest dollar of income. Effective rate is the actual percentage of total income paid in taxes.' },
      { question: 'Does this include state taxes?', answer: 'This baseline model computes federal progressive income taxes and FICA (Social Security & Medicare).' },
      { question: 'How do 401(k) contributions lower taxes?', answer: 'Traditional 401(k) contributions reduce taxable gross income dollar-for-dollar in the current tax year.' },
    ],
    calculate: (inputs) => {
      const gross = Number(inputs.grossIncome) || 0;
      const status = inputs.filingStatus || 'single';
      const extraDeductions = Number(inputs.deductions) || 0;

      const stdDeduction = status === 'married' ? 29200 : status === 'hoh' ? 21900 : 14600;
      const taxable = Math.max(0, gross - extraDeductions - stdDeduction);

      // Progressive tax estimate
      let federalTax = 0;
      if (taxable > 0) {
        if (taxable <= 11600) federalTax += taxable * 0.10;
        else if (taxable <= 47150) federalTax += 1160 + (taxable - 11600) * 0.12;
        else if (taxable <= 100525) federalTax += 5426 + (taxable - 47150) * 0.22;
        else if (taxable <= 191950) federalTax += 17168.5 + (taxable - 100525) * 0.24;
        else federalTax += 39110.5 + (taxable - 191950) * 0.32;
      }

      // FICA taxes (7.65%)
      const fica = gross * 0.0765;
      const totalTax = federalTax + fica;
      const netPay = Math.max(0, gross - totalTax - extraDeductions);
      const effectiveRate = gross > 0 ? ((totalTax / gross) * 100).toFixed(1) : '0';

      const netPct = gross > 0 ? Math.round((netPay / gross) * 100) : 70;
      const taxPct = 100 - netPct;

      return {
        primaryValue: `$${Math.round(netPay).toLocaleString()}`,
        primaryLabel: 'Estimated Net Take-Home Pay',
        primarySubtext: `Effective Tax Rate: ${effectiveRate}% (${Math.round(netPay / 12).toLocaleString()}/mo)`,
        summary: [
          { label: 'Gross Annual Salary', value: `$${gross.toLocaleString()}` },
          { label: 'Federal Income Tax', value: `$${Math.round(federalTax).toLocaleString()}` },
          { label: 'FICA Payroll Taxes', value: `$${Math.round(fica).toLocaleString()}` },
          { label: 'Monthly Net Pay', value: `$${Math.round(netPay / 12).toLocaleString()}` },
        ],
        breakdown: [
          { label: 'Take-Home Net', percentage: netPct, amount: `$${Math.round(netPay).toLocaleString()}`, color: 'bg-emerald-500' },
          { label: 'Taxes & Deductions', percentage: taxPct, amount: `$${Math.round(totalTax + extraDeductions).toLocaleString()}`, color: 'bg-rose-500' },
        ],
      };
    },
  },

  // ── 4. MARKETING CALCULATOR ──
  'marketing-calculator': {
    slug: 'marketing-calculator',
    title: 'Marketing ROI, CAC & ROAS Calculator',
    tagline: 'Measure Customer Acquisition Cost (CAC), ROAS, and Lifetime Value ratios.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Optimize growth marketing budgets by analyzing payback periods, ad return ratios, customer acquisition costs, and net campaign margins.',
    icon: 'Target',
    badge: 'Growth Metrics',
    tags: ['marketing', 'cac', 'roas', 'ltv', 'ad-spend', 'growth', 'conversion'],
    status: 'ready',
    primaryUnit: '$',
    fields: [
      { id: 'adSpend', label: 'Total Ad Spend ($)', type: 'number', defaultValue: 15000, min: 100, max: 10000000, step: 500, unit: '$' },
      { id: 'conversions', label: 'Customers Acquired', type: 'number', defaultValue: 250, min: 1, max: 100000, step: 10 },
      { id: 'ltv', label: 'Average Customer LTV ($)', type: 'number', defaultValue: 450, min: 1, max: 50000, step: 25, unit: '$' },
      { id: 'revenueGenerated', label: 'Total Revenue Generated ($)', type: 'number', defaultValue: 48000, min: 100, max: 50000000, step: 1000, unit: '$' },
    ],
    formulaSteps: [
      { step: 1, title: 'Customer Acquisition Cost (CAC)', formula: 'CAC = AdSpend / CustomersAcquired', description: 'Average expenditure required to onboard a paying customer.' },
      { step: 2, title: 'Return On Ad Spend (ROAS)', formula: 'ROAS = Revenue / AdSpend', description: 'Gross revenue generated per single advertising dollar invested.' },
      { step: 3, title: 'LTV to CAC Efficiency Ratio', formula: 'Ratio = CustomerLTV / CAC', description: 'Healthy venture-backed SaaS benchmarks target an LTV:CAC of >= 3.0.' },
    ],
    usageGuide: [
      { step: 1, title: 'Input Campaign Ad Spend', text: 'Include total media costs across Google, Meta, or influencer campaigns.' },
      { step: 2, title: 'Add Customers and Revenue', text: 'Enter verified paying customer conversions and attributed top-line revenue.' },
      { step: 3, title: 'Benchmark LTV:CAC Ratio', text: 'Determine whether scaling ad spend is sustainable.' },
    ],
    faqs: [
      { question: 'What is a good ROAS?', answer: 'A ROAS of 3.0x to 4.0x ($3-$4 revenue per $1 spend) is typically considered sustainable across eCommerce and digital products.' },
      { question: 'What does an LTV:CAC below 3.0 mean?', answer: 'An LTV:CAC under 3.0 indicates low customer profitability or high acquisition burn, suggesting a need for conversion rate or retention improvements.' },
      { question: 'Should organic costs be included in CAC?', answer: 'Blended CAC includes all marketing salaries and organic tools, while Paid CAC strictly measures ad media spend.' },
    ],
    calculate: (inputs) => {
      const spend = Number(inputs.adSpend) || 0;
      const customers = Number(inputs.conversions) || 1;
      const ltv = Number(inputs.ltv) || 0;
      const revenue = Number(inputs.revenueGenerated) || 0;

      const cac = customers > 0 ? spend / customers : 0;
      const roas = spend > 0 ? revenue / spend : 0;
      const ltvCacRatio = cac > 0 ? (ltv / cac).toFixed(2) : '0';
      const netProfit = revenue - spend;
      const marginPct = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

      return {
        primaryValue: `${roas.toFixed(2)}x`,
        primaryLabel: 'Return on Ad Spend (ROAS)',
        primarySubtext: `CAC: $${cac.toFixed(2)} | LTV:CAC: ${ltvCacRatio}x`,
        summary: [
          { label: 'Customer Acquisition Cost (CAC)', value: `$${cac.toFixed(2)}` },
          { label: 'LTV to CAC Ratio', value: `${ltvCacRatio}:1` },
          { label: 'Net Campaign Profit', value: `$${netProfit.toLocaleString()}` },
          { label: 'Profit Margin', value: `${marginPct}%` },
        ],
        breakdown: [
          { label: 'Net Profit Margin', percentage: Math.max(0, Math.min(100, marginPct)), amount: `$${netProfit.toLocaleString()}`, color: 'bg-emerald-500' },
          { label: 'Ad Spend Allocation', percentage: Math.max(0, 100 - marginPct), amount: `$${spend.toLocaleString()}`, color: 'bg-amber-500' },
        ],
      };
    },
  },

  // ── 5. PERSONAL FINANCE CALCULATOR ──
  'personal-finance-calculator': {
    slug: 'personal-finance-calculator',
    title: '50/30/20 Budget & Emergency Fund Calculator',
    tagline: 'Balance living expenses, discretionary wants, savings targets, and emergency runways.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Implement Elizabeth Warren\'s 50/30/20 balanced budget framework and compute target cash reserves for 3 to 12 months of living expenses.',
    icon: 'PiggyBank',
    badge: 'Budget Framework',
    tags: ['budget', 'savings', 'emergency-fund', '50-30-20', 'personal-finance', 'money'],
    status: 'ready',
    primaryUnit: '$',
    fields: [
      { id: 'monthlyIncome', label: 'Monthly Net Income ($)', type: 'number', defaultValue: 6500, min: 500, max: 200000, step: 100, unit: '$' },
      { id: 'emergencyMonths', label: 'Emergency Fund Runway Target', type: 'select', defaultValue: '6', options: [
        { label: '3 Months (Lean)', value: '3' },
        { label: '6 Months (Standard)', value: '6' },
        { label: '9 Months (Cautious)', value: '9' },
        { label: '12 Months (Conservative)', value: '12' },
      ]},
    ],
    formulaSteps: [
      { step: 1, title: 'Essential Needs (50%)', formula: 'Needs = MonthlyNet * 0.50', description: 'Rent/mortgage, utilities, groceries, healthcare, minimum debt.' },
      { step: 2, title: 'Discretionary Wants (30%)', formula: 'Wants = MonthlyNet * 0.30', description: 'Dining out, entertainment, subscriptions, travel, personal leisure.' },
      { step: 3, title: 'Savings & Investments (20%)', formula: 'Savings = MonthlyNet * 0.20', description: 'Emergency buffer, index funds, retirement, accelerated debt payoff.' },
    ],
    usageGuide: [
      { step: 1, title: 'Enter Net Monthly Income', text: 'Input take-home pay after taxes and mandatory employer deductions.' },
      { step: 2, title: 'Review 50/30/20 Splits', text: 'Examine recommended allocations for essentials versus lifestyle.' },
      { step: 3, title: 'Build Emergency Buffer', text: 'Aim to hold 3-6 months of essential needs in high-yield savings.' },
    ],
    faqs: [
      { question: 'What qualifies as an essential need?', answer: 'Needs are non-negotiable living costs required for survival and livelihood: housing, utilities, basic groceries, transport, and insurance.' },
      { question: 'What if my needs exceed 50%?', answer: 'In high-cost-of-living areas, temporary 60/20/20 splits can be adopted while working to decrease recurring overhead.' },
      { question: 'Where should emergency savings be parked?', answer: 'In an FDIC-insured High-Yield Savings Account (HYSA) or money market fund offering liquidity and capital preservation.' },
    ],
    calculate: (inputs) => {
      const inc = Number(inputs.monthlyIncome) || 0;
      const runwayMonths = Number(inputs.emergencyMonths) || 6;

      const needs = inc * 0.50;
      const wants = inc * 0.30;
      const savings = inc * 0.20;
      const emergencyTarget = needs * runwayMonths;

      return {
        primaryValue: `$${Math.round(savings).toLocaleString()}/mo`,
        primaryLabel: 'Recommended Monthly Savings (20%)',
        primarySubtext: `Target Emergency Reserve: $${Math.round(emergencyTarget).toLocaleString()} (${runwayMonths} Months Needs)`,
        summary: [
          { label: 'Needs Allocation (50%)', value: `$${Math.round(needs).toLocaleString()}/mo` },
          { label: 'Wants Allocation (30%)', value: `$${Math.round(wants).toLocaleString()}/mo` },
          { label: 'Emergency Fund Goal', value: `$${Math.round(emergencyTarget).toLocaleString()}` },
          { label: 'Annual Savings Capacity', value: `$${Math.round(savings * 12).toLocaleString()}` },
        ],
        breakdown: [
          { label: '50% Needs', percentage: 50, amount: `$${Math.round(needs).toLocaleString()}`, color: 'bg-[#FF8A00]' },
          { label: '30% Wants', percentage: 30, amount: `$${Math.round(wants).toLocaleString()}`, color: 'bg-purple-500' },
          { label: '20% Savings', percentage: 20, amount: `$${Math.round(savings).toLocaleString()}`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 6. BUSINESS CALCULATOR ──
  'business-calculator': {
    slug: 'business-calculator',
    title: 'Business Break-Even & Profit Margin Calculator',
    tagline: 'Calculate break-even unit volumes, contribution margins, and operating profitability.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Determine exact sales volume required to cover fixed overhead, evaluate contribution margins per unit, and project monthly commercial profitability.',
    icon: 'Briefcase',
    badge: 'Commercial Modeling',
    tags: ['business', 'break-even', 'profit-margin', 'fixed-cost', 'revenue', 'startup'],
    status: 'ready',
    primaryUnit: 'Units',
    fields: [
      { id: 'fixedCosts', label: 'Monthly Fixed Costs (Rent, Salaries, Software)', type: 'number', defaultValue: 18000, min: 100, max: 5000000, step: 500, unit: '$' },
      { id: 'unitPrice', label: 'Selling Price Per Unit ($)', type: 'number', defaultValue: 85, min: 1, max: 100000, step: 5, unit: '$' },
      { id: 'variableCost', label: 'Variable Cost Per Unit ($)', type: 'number', defaultValue: 35, min: 0, max: 100000, step: 5, unit: '$' },
      { id: 'estimatedSales', label: 'Expected Monthly Units Sold', type: 'number', defaultValue: 600, min: 1, max: 500000, step: 25 },
    ],
    formulaSteps: [
      { step: 1, title: 'Contribution Margin', formula: 'CM = UnitPrice - VariableCost', description: 'Gross cash generated per unit toward covering fixed overhead.' },
      { step: 2, title: 'Break-Even Volume', formula: 'Units = FixedCosts / CM', description: 'Quantity of units sold where net profit equals exactly zero.' },
      { step: 3, title: 'Operating Profitability', formula: 'Profit = (SalesUnits * CM) - FixedCosts', description: 'Net earnings before interest and taxes.' },
    ],
    usageGuide: [
      { step: 1, title: 'Aggregate Fixed Overhead', text: 'Sum all non-negotiable monthly expenses independent of sales volume.' },
      { step: 2, title: 'Enter Unit Unit Economics', text: 'Specify retail price and direct cost of goods sold (COGS).' },
      { step: 3, title: 'Forecast Monthly Profit', text: 'Adjust expected units sold to test profitability scenarios.' },
    ],
    faqs: [
      { question: 'What is contribution margin ratio?', answer: 'The contribution margin ratio is (Price - Variable Cost) / Price. It represents the percentage of each sales dollar that contributes to paying fixed overhead.' },
      { question: 'What happens when fixed costs rise?', answer: 'An increase in fixed costs directly raises the number of units you must sell to break even.' },
      { question: 'How can a business lower its break-even point?', answer: 'By either raising selling prices, reducing unit variable manufacturing costs, or renegotiating fixed overhead expenses.' },
    ],
    calculate: (inputs) => {
      const fixed = Number(inputs.fixedCosts) || 0;
      const price = Number(inputs.unitPrice) || 1;
      const variable = Number(inputs.variableCost) || 0;
      const units = Number(inputs.estimatedSales) || 0;

      const cm = price - variable;
      const breakEvenUnits = cm > 0 ? Math.ceil(fixed / cm) : 0;
      const breakEvenRevenue = breakEvenUnits * price;
      const totalRevenue = units * price;
      const netProfit = units * cm - fixed;
      const cmRatio = price > 0 ? Math.round((cm / price) * 100) : 0;

      return {
        primaryValue: `${breakEvenUnits.toLocaleString()} Units`,
        primaryLabel: 'Monthly Break-Even Volume',
        primarySubtext: `Break-Even Sales: $${breakEvenRevenue.toLocaleString()} | Margin: ${cmRatio}%`,
        summary: [
          { label: 'Contribution Margin per Unit', value: `$${cm.toFixed(2)}` },
          { label: 'Projected Net Profit', value: `$${netProfit.toLocaleString()}` },
          { label: 'Total Projected Revenue', value: `$${totalRevenue.toLocaleString()}` },
          { label: 'Contribution Margin Ratio', value: `${cmRatio}%` },
        ],
        breakdown: [
          { label: 'Fixed Costs Covered', percentage: Math.min(100, Math.round((fixed / (totalRevenue || 1)) * 100)), amount: `$${fixed.toLocaleString()}`, color: 'bg-rose-500' },
          { label: 'Net Profit Margin', percentage: Math.max(0, Math.round((netProfit / (totalRevenue || 1)) * 100)), amount: `$${Math.max(0, netProfit).toLocaleString()}`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 7. REAL ESTATE CALCULATOR ──
  'real-estate-calculator': {
    slug: 'real-estate-calculator',
    title: 'Real Estate Cap Rate & Rental Yield Calculator',
    tagline: 'Evaluate property capitalization rates, cash flow, and gross rental yields.',
    category: 'financial',
    categoryLabel: 'Financial Calculators',
    description: 'Analyze residential or commercial real estate acquisitions with Cap Rate, Net Operating Income (NOI), Cash-on-Cash Return, and monthly cash flow.',
    icon: 'Home',
    badge: 'Property Analytics',
    tags: ['real-estate', 'cap-rate', 'rental-yield', 'property', 'mortgage', 'cash-flow', 'investing'],
    status: 'ready',
    primaryUnit: '%',
    fields: [
      { id: 'purchasePrice', label: 'Property Purchase Price ($)', type: 'number', defaultValue: 420000, min: 20000, max: 20000000, step: 5000, unit: '$' },
      { id: 'monthlyRent', label: 'Monthly Gross Rental Income ($)', type: 'number', defaultValue: 3200, min: 100, max: 100000, step: 50, unit: '$' },
      { id: 'annualExpenses', label: 'Annual Operating Expenses (Taxes, HOA, Maintenance)', type: 'number', defaultValue: 8400, min: 0, max: 500000, step: 200, unit: '$' },
      { id: 'monthlyMortgage', label: 'Monthly Mortgage Payment (P&I) ($)', type: 'number', defaultValue: 1950, min: 0, max: 50000, step: 50, unit: '$' },
    ],
    formulaSteps: [
      { step: 1, title: 'Net Operating Income (NOI)', formula: 'NOI = (MonthlyRent * 12) - OperatingExpenses', description: 'Annual property revenue after subtracting operational overhead.' },
      { step: 2, title: 'Capitalization Rate (Cap Rate)', formula: 'CapRate = (NOI / PurchasePrice) * 100', description: 'Unleveraged rate of return expected on a real estate investment property.' },
      { step: 3, title: 'Monthly Net Cash Flow', formula: 'CashFlow = MonthlyRent - (Expenses/12) - Mortgage', description: 'Actual monthly discretionary cash deposited into bank account.' },
    ],
    usageGuide: [
      { step: 1, title: 'Input Asset Valuation', text: 'Enter acquisition cost including initial closing fees.' },
      { step: 2, title: 'Account for Operating Costs', text: 'Factor in property tax, landlord insurance, HOA, and 5-10% maintenance reserves.' },
      { step: 3, title: 'Verify Net Cash Flow', text: 'Ensure rental income adequately covers debt service and yields positive cash flow.' },
    ],
    faqs: [
      { question: 'What is a good Cap Rate?', answer: 'Generally, cap rates between 4% and 10% are standard depending on property location, tenant stability, and market risk.' },
      { question: 'Does Cap Rate include mortgage debt?', answer: 'No, Cap Rate assesses the asset independently of financing structure. To measure leverage, use Cash-on-Cash Return.' },
      { question: 'What is Gross Rental Yield?', answer: 'Gross Yield = (Annual Rent / Purchase Price) * 100, measuring gross top-line return prior to operating deductions.' },
    ],
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice) || 1;
      const rent = Number(inputs.monthlyRent) || 0;
      const expenses = Number(inputs.annualExpenses) || 0;
      const mortgage = Number(inputs.monthlyMortgage) || 0;

      const annualRent = rent * 12;
      const noi = Math.max(0, annualRent - expenses);
      const capRate = price > 0 ? ((noi / price) * 100).toFixed(2) : '0';
      const grossYield = price > 0 ? (((rent * 12) / price) * 100).toFixed(2) : '0';
      const monthlyExpenses = expenses / 12;
      const monthlyNetCashFlow = rent - monthlyExpenses - mortgage;

      return {
        primaryValue: `${capRate}%`,
        primaryLabel: 'Property Cap Rate',
        primarySubtext: `Monthly Cash Flow: $${Math.round(monthlyNetCashFlow).toLocaleString()}/mo`,
        summary: [
          { label: 'Net Operating Income (NOI)', value: `$${Math.round(noi).toLocaleString()}/yr` },
          { label: 'Gross Rental Yield', value: `${grossYield}%` },
          { label: 'Monthly Net Cash Flow', value: `$${Math.round(monthlyNetCashFlow).toLocaleString()}` },
          { label: 'Annual Operating Expenses', value: `$${Math.round(expenses).toLocaleString()}` },
        ],
        breakdown: [
          { label: 'Mortgage Debt Service', percentage: rent > 0 ? Math.min(100, Math.round((mortgage / rent) * 100)) : 50, amount: `$${mortgage.toLocaleString()}/mo`, color: 'bg-indigo-500' },
          { label: 'Operating Expenses', percentage: rent > 0 ? Math.min(100, Math.round((monthlyExpenses / rent) * 100)) : 25, amount: `$${Math.round(monthlyExpenses).toLocaleString()}/mo`, color: 'bg-amber-500' },
          { label: 'Net Discretionary Cash Flow', percentage: rent > 0 ? Math.max(0, Math.round((monthlyNetCashFlow / rent) * 100)) : 25, amount: `$${Math.round(monthlyNetCashFlow).toLocaleString()}/mo`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 8. CONSTRUCTION CALCULATOR ──
  'construction-calculator': {
    slug: 'construction-calculator',
    title: 'Construction & Concrete Volume Estimator',
    tagline: 'Calculate cubic yards of concrete, bag estimates, and square footage.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Estimate required concrete volume in cubic yards and pre-mixed bags for slabs, footings, patios, and foundations with waste tolerance.',
    icon: 'Hammer',
    badge: 'Jobsite Estimator',
    tags: ['construction', 'concrete', 'volume', 'drywall', 'framing', 'lumber', 'masonry'],
    status: 'ready',
    primaryUnit: 'yd³',
    fields: [
      { id: 'length', label: 'Slab Length (Feet)', type: 'number', defaultValue: 24, min: 1, max: 1000, step: 1, unit: 'ft' },
      { id: 'width', label: 'Slab Width (Feet)', type: 'number', defaultValue: 16, min: 1, max: 1000, step: 1, unit: 'ft' },
      { id: 'thickness', label: 'Slab Thickness (Inches)', type: 'select', defaultValue: '4', options: [
        { label: '4 Inches (Standard Patio/Walkway)', value: '4' },
        { label: '5 Inches (Light Driveway)', value: '5' },
        { label: '6 Inches (Heavy Vehicle Driveway)', value: '6' },
        { label: '8 Inches (Commercial Footing)', value: '8' },
        { label: '12 Inches (Deep Foundation)', value: '12' },
      ]},
      { id: 'waste', label: 'Waste Buffer Tolerance (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1, unit: '%' },
    ],
    formulaSteps: [
      { step: 1, title: 'Surface Area Calculation', formula: 'Area = Length * Width', description: 'Compute horizontal square footage.' },
      { step: 2, title: 'Cubic Feet Volume', formula: 'CuFt = Area * (Thickness / 12)', description: 'Convert thickness from inches to feet and multiply.' },
      { step: 3, title: 'Cubic Yards Conversion', formula: 'CuYds = (CuFt / 27) * (1 + WastePct/100)', description: 'Standard concrete is delivered in cubic yards (27 cu ft = 1 cu yd).' },
    ],
    usageGuide: [
      { step: 1, title: 'Measure Dimensions in Feet', text: 'Use a laser measure or tape for outer slab boundaries.' },
      { step: 2, title: 'Choose Slab Depth', text: '4 inches is standard for residential sidewalks; 6 inches for driveways.' },
      { step: 3, title: 'Include 10% Spillage Buffer', text: 'Prevents shortages caused by subgrade unevenness or form spreading.' },
    ],
    faqs: [
      { question: 'How many 80lb bags are in a cubic yard?', answer: 'One cubic yard of concrete requires approximately 45 bags of 80lb pre-mix (or 60 bags of 60lb pre-mix).' },
      { question: 'When should I order ready-mix truck delivery?', answer: 'Jobs requiring more than 1 to 2 cubic yards are generally much more cost-effective and structurally consistent using ready-mix truck dispatch.' },
      { question: 'Why is a waste buffer required?', answer: 'Subgrade settling, uneven excavation, and spillage typically consume 5-10% extra volume.' },
    ],
    calculate: (inputs) => {
      const len = Number(inputs.length) || 0;
      const wid = Number(inputs.width) || 0;
      const thickInches = Number(inputs.thickness) || 4;
      const wastePct = Number(inputs.waste) || 10;

      const sqFt = len * wid;
      const cuFt = sqFt * (thickInches / 12);
      const rawYards = cuFt / 27;
      const totalYards = rawYards * (1 + wastePct / 100);
      const bags80 = Math.ceil(totalYards * 45);
      const bags60 = Math.ceil(totalYards * 60);

      return {
        primaryValue: `${totalYards.toFixed(2)} yd³`,
        primaryLabel: 'Required Concrete Volume',
        primarySubtext: `Includes ${wastePct}% waste buffer (${sqFt} sq ft surface)`,
        summary: [
          { label: 'Total Surface Area', value: `${sqFt} sq ft` },
          { label: '80lb Pre-Mix Bags', value: `${bags80} bags` },
          { label: '60lb Pre-Mix Bags', value: `${bags60} bags` },
          { label: 'Net Volume (Without Buffer)', value: `${rawYards.toFixed(2)} yd³` },
        ],
        breakdown: [
          { label: 'Base Concrete Volume', percentage: Math.round((100 / (100 + wastePct)) * 100), amount: `${rawYards.toFixed(2)} yd³`, color: 'bg-slate-500' },
          { label: 'Waste Buffer', percentage: Math.round((wastePct / (100 + wastePct)) * 100), amount: `${(totalYards - rawYards).toFixed(2)} yd³`, color: 'bg-amber-500' },
        ],
      };
    },
  },

  // ── 9. HEALTH CALCULATOR ──
  'health-calculator': {
    slug: 'health-calculator',
    title: 'BMR, TDEE & Daily Caloric Deficit Calculator',
    tagline: 'Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Scientifically calibrate metabolic energy requirements using the Mifflin-St Jeor formula for weight loss, maintenance, and lean muscle mass gain.',
    icon: 'Activity',
    badge: 'Metabolic Science',
    tags: ['health', 'bmr', 'tdee', 'calories', 'nutrition', 'weight-loss', 'macros'],
    status: 'ready',
    primaryUnit: 'kcal',
    fields: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ]},
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 28, min: 14, max: 100, step: 1 },
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 78, min: 30, max: 300, step: 0.5, unit: 'kg' },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 178, min: 100, max: 240, step: 1, unit: 'cm' },
      { id: 'activity', label: 'Activity Level', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Sedentary (Office desk work, little exercise)', value: 'sedentary' },
        { label: 'Light (Exercise 1-3 days/week)', value: 'light' },
        { label: 'Moderate (Exercise 3-5 days/week)', value: 'moderate' },
        { label: 'Very Active (Heavy training 6-7 days/week)', value: 'active' },
      ]},
    ],
    formulaSteps: [
      { step: 1, title: 'Mifflin-St Jeor BMR (Male)', formula: 'BMR = (10 * W) + (6.25 * H) - (5 * A) + 5', description: 'Compute baseline caloric burn at complete rest.' },
      { step: 2, title: 'Mifflin-St Jeor BMR (Female)', formula: 'BMR = (10 * W) + (6.25 * H) - (5 * A) - 161', description: 'Adjusted baseline for female metabolic tissue.' },
      { step: 3, title: 'TDEE Multiplier', formula: 'TDEE = BMR * ActivityFactor', description: 'Scales from 1.2 (sedentary) to 1.725 (very active).' },
    ],
    usageGuide: [
      { step: 1, title: 'Input Biometrics', text: 'Enter accurate height, weight, and chronological age.' },
      { step: 2, title: 'Select Physical Activity Factor', text: 'Be conservative with activity estimates to prevent over-calculating maintenance.' },
      { step: 3, title: 'Choose Target Goal', text: 'Subtract 500 kcal for a safe 1 lb/week fat loss deficit.' },
    ],
    faqs: [
      { question: 'What is BMR?', answer: 'Basal Metabolic Rate is the number of calories your body burns at rest to maintain vital functions like breathing, blood circulation, and cell repair.' },
      { question: 'What is TDEE?', answer: 'Total Daily Energy Expenditure is the total number of calories burned in a 24-hour day including physical movement and thermic effect of food.' },
      { question: 'How big should a weight loss deficit be?', answer: 'A 300 to 500 kcal daily deficit promotes steady, sustainable fat loss while preserving lean skeletal muscle.' },
    ],
    calculate: (inputs) => {
      const sex = inputs.gender || 'male';
      const age = Number(inputs.age) || 25;
      const w = Number(inputs.weightKg) || 70;
      const h = Number(inputs.heightCm) || 175;
      const act = inputs.activity || 'moderate';

      let bmr = (10 * w) + (6.25 * h) - (5 * age);
      bmr = sex === 'male' ? bmr + 5 : bmr - 161;

      const actMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
      };

      const mult = actMultipliers[act] || 1.55;
      const tdee = Math.round(bmr * mult);
      const fatLossCalories = Math.max(1200, tdee - 500);
      const leanBulkCalories = tdee + 300;

      return {
        primaryValue: `${tdee} kcal`,
        primaryLabel: 'Daily Maintenance Calories (TDEE)',
        primarySubtext: `Basal Metabolic Rate (BMR): ${Math.round(bmr)} kcal/day`,
        summary: [
          { label: 'Weight Loss Target (-500 kcal)', value: `${fatLossCalories} kcal/day` },
          { label: 'Lean Bulking Target (+300 kcal)', value: `${leanBulkCalories} kcal/day` },
          { label: 'Base BMR Resting Burn', value: `${Math.round(bmr)} kcal` },
          { label: 'Exercise & Activity Burn', value: `${Math.round(tdee - bmr)} kcal` },
        ],
        breakdown: [
          { label: 'Basal Metabolism', percentage: Math.round((bmr / tdee) * 100), amount: `${Math.round(bmr)} kcal`, color: 'bg-indigo-500' },
          { label: 'Activity & Movement', percentage: 100 - Math.round((bmr / tdee) * 100), amount: `${Math.round(tdee - bmr)} kcal`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 10. FITNESS CALCULATOR ──
  'fitness-calculator': {
    slug: 'fitness-calculator',
    title: 'One-Rep Max (1RM) & Strength Zones Calculator',
    tagline: 'Calculate estimated 1RM, percentage training loads, and hypertrophy thresholds.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Accurately forecast maximal single repetition strength using the Brzycki & Epley formulas, with barbell load breakdowns from 50% to 95%.',
    icon: 'Dumbbell',
    badge: 'Strength Diagnostics',
    tags: ['fitness', '1rm', 'strength', 'one-rep-max', 'powerlifting', 'workout', 'training'],
    status: 'ready',
    primaryUnit: 'lbs',
    fields: [
      { id: 'weightLifted', label: 'Weight Lifted', type: 'number', defaultValue: 225, min: 20, max: 1500, step: 5, unit: 'lbs' },
      { id: 'reps', label: 'Repetitions Completed (1-10)', type: 'slider', defaultValue: 5, min: 1, max: 10, step: 1, unit: 'Reps' },
      { id: 'formula', label: 'Calculation Formula', type: 'select', defaultValue: 'brzycki', options: [
        { label: 'Brzycki Formula (Standard Powerlifting)', value: 'brzycki' },
        { label: 'Epley Formula (Strength Athletics)', value: 'epley' },
      ]},
    ],
    formulaSteps: [
      { step: 1, title: 'Brzycki 1RM Equation', formula: '1RM = Weight / [1.0278 - (0.0278 * Reps)]', description: 'Accurate model for rep ranges between 1 and 10.' },
      { step: 2, title: 'Epley 1RM Equation', formula: '1RM = Weight * (1 + Reps / 30)', description: 'Alternative formula commonly adopted in collegiate athletic training.' },
      { step: 3, title: 'Target Training Percentages', formula: 'Load = 1RM * DesiredIntensity', description: 'Derive working weights for strength (85-90%) or hypertrophy (70-80%).' },
    ],
    usageGuide: [
      { step: 1, title: 'Perform a Submaximal Set', text: 'Warm up thoroughly and record clean reps completed to technical fatigue.' },
      { step: 2, title: 'Keep Reps Under 10', text: '1RM accuracy decreases with sets exceeding 10 repetitions.' },
      { step: 3, title: 'Apply Percentage Waves', text: 'Use 75-80% for 8-10 rep hypertrophy blocks and 85-90% for peaking cycles.' },
    ],
    faqs: [
      { question: 'Why calculate 1RM instead of testing true max?', answer: 'Estimating 1RM protects joints and the central nervous system from catastrophic injury risks associated with true maximal loads.' },
      { question: 'Which formula is more accurate?', answer: 'Brzycki is widely praised for compound barbell lifts (bench press, squat, deadlift) in the 3-8 rep range.' },
      { question: 'Can I use this for dumbbells?', answer: 'Yes, but stability requirements for dumbbells typically reduce maximum output by 10-15% compared to barbells.' },
    ],
    calculate: (inputs) => {
      const w = Number(inputs.weightLifted) || 100;
      const r = Number(inputs.reps) || 1;
      const formula = inputs.formula || 'brzycki';

      let oneRm = w;
      if (r > 1) {
        if (formula === 'epley') {
          oneRm = w * (1 + r / 30);
        } else {
          oneRm = w / (1.0278 - 0.0278 * r);
        }
      }

      const p90 = Math.round(oneRm * 0.90);
      const p80 = Math.round(oneRm * 0.80);
      const p70 = Math.round(oneRm * 0.70);

      return {
        primaryValue: `${Math.round(oneRm)} lbs`,
        primaryLabel: 'Estimated One-Rep Max (1RM)',
        primarySubtext: `Calculated from ${w} lbs x ${r} reps`,
        summary: [
          { label: '90% Strength Peaking', value: `${p90} lbs (3-4 reps)` },
          { label: '80% Hypertrophy Work', value: `${p80} lbs (7-8 reps)` },
          { label: '70% Volume Endurance', value: `${p70} lbs (10-12 reps)` },
          { label: 'Baseline Performed Set', value: `${w} lbs x ${r} reps` },
        ],
        breakdown: [
          { label: 'Max Effort (90-100%)', percentage: 90, amount: `${p90} lbs`, color: 'bg-rose-500' },
          { label: 'Hypertrophy (75-85%)', percentage: 80, amount: `${p80} lbs`, color: 'bg-amber-500' },
          { label: 'Speed & Volume (60-70%)', percentage: 70, amount: `${p70} lbs`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 11. EDUCATIONAL CALCULATOR ──
  'educational-calculator': {
    slug: 'educational-calculator',
    title: 'GPA & Target Exam Grade Calculator',
    tagline: 'Calculate weighted cumulative GPA and target exam scores required for final course grades.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Calculate cumulative grade point averages (GPA) and determine exactly what score you need on your final exam to pass or secure an A.',
    icon: 'GraduationCap',
    badge: 'Academic Metrics',
    tags: ['education', 'gpa', 'grades', 'exam', 'college', 'student', 'cgpa'],
    status: 'ready',
    primaryUnit: 'GPA',
    fields: [
      { id: 'currentGrade', label: 'Current Class Grade (%)', type: 'number', defaultValue: 86.5, min: 0, max: 100, step: 0.5, unit: '%' },
      { id: 'targetGrade', label: 'Desired Final Course Grade (%)', type: 'number', defaultValue: 90.0, min: 50, max: 100, step: 0.5, unit: '%' },
      { id: 'finalExamWeight', label: 'Final Exam Weight (%)', type: 'slider', defaultValue: 30, min: 5, max: 80, step: 1, unit: '%' },
    ],
    formulaSteps: [
      { step: 1, title: 'Current Grade Weight', formula: 'CurrentWeight = 100 - FinalWeight', description: 'Percentage of the semester coursework completed to date.' },
      { step: 2, title: 'Target Grade Equation', formula: 'Target = (Current * CurrentWeight + FinalScore * FinalWeight) / 100', description: 'Composite course grade weighted average.' },
      { step: 3, title: 'Required Final Exam Score', formula: 'RequiredScore = [Target - Current * (1 - FinalWeight/100)] / (FinalWeight / 100)', description: 'Solve for the minimum score needed on the final exam.' },
    ],
    usageGuide: [
      { step: 1, title: 'Check Current Syllabus Grade', text: 'Input current weighted course percentage in your student portal.' },
      { step: 2, title: 'Set Desired Grade Target', text: 'Enter threshold (e.g. 90% for an A, 80% for a B, 70% for a C).' },
      { step: 3, title: 'Identify Final Weight', text: 'Locate final exam percentage in course syllabus.' },
    ],
    faqs: [
      { question: 'What if the required score exceeds 100%?', answer: 'If the required score exceeds 100%, securing that letter grade without extra credit is mathematically impossible based on current course weight.' },
      { question: 'How is weighted GPA calculated?', answer: 'Multiply the grade points for each course (e.g. A=4.0, B=3.0) by credit hours, sum them, and divide by total credit hours attempted.' },
      { question: 'Does rounding help final grades?', answer: 'Most university faculty round 89.5% to 90%, but always verify departmental grading policies.' },
    ],
    calculate: (inputs) => {
      const current = Number(inputs.currentGrade) || 85;
      const target = Number(inputs.targetGrade) || 90;
      const weight = Number(inputs.finalExamWeight) || 30;

      const currentWeight = (100 - weight) / 100;
      const finalWeight = weight / 100;
      const needed = (target - (current * currentWeight)) / finalWeight;

      const possible = needed <= 100;

      return {
        primaryValue: `${needed.toFixed(1)}%`,
        primaryLabel: 'Required Final Exam Score',
        primarySubtext: possible ? `Achievable to secure a ${target}% final grade` : `Requires > 100% (Extra credit needed)`,
        summary: [
          { label: 'Current Standing', value: `${current}% (${Math.round(currentWeight * 100)}% of grade)` },
          { label: 'Target Final Grade', value: `${target}%` },
          { label: 'Exam Syllabus Weight', value: `${weight}% of total course` },
          { label: 'Feasibility Status', value: possible ? 'Mathematically Feasible' : 'Requires Extra Credit' },
        ],
        breakdown: [
          { label: 'Completed Coursework', percentage: Math.round(currentWeight * 100), amount: `${current}% current`, color: 'bg-indigo-500' },
          { label: 'Final Exam Weight', percentage: weight, amount: `${needed.toFixed(1)}% target`, color: possible ? 'bg-emerald-500' : 'bg-rose-500' },
        ],
      };
    },
  },

  // ── 12. GEOMETRY CALCULATOR ──
  'geometry-calculator': {
    slug: 'geometry-calculator',
    title: 'Geometry 2D/3D Area & Volume Calculator',
    tagline: 'Calculate area, perimeter, surface area, and volume across geometric shapes.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Universal geometry solver for spheres, cylinders, cones, rectangles, and cuboids with high-precision mathematical constants.',
    icon: 'Box',
    badge: 'Geometric Engine',
    tags: ['geometry', 'area', 'volume', 'surface-area', 'shapes', 'math', 'circle'],
    status: 'ready',
    primaryUnit: 'Units²',
    fields: [
      { id: 'shape', label: 'Select Shape', type: 'select', defaultValue: 'cylinder', options: [
        { label: 'Cylinder (3D)', value: 'cylinder' },
        { label: 'Sphere (3D)', value: 'sphere' },
        { label: 'Rectangular Prism / Box (3D)', value: 'box' },
        { label: 'Circle (2D)', value: 'circle' },
      ]},
      { id: 'dimensionA', label: 'Primary Dimension (Radius or Length)', type: 'number', defaultValue: 5, min: 0.1, max: 10000, step: 0.5 },
      { id: 'dimensionB', label: 'Secondary Dimension (Height or Width)', type: 'number', defaultValue: 12, min: 0.1, max: 10000, step: 0.5 },
    ],
    formulaSteps: [
      { step: 1, title: 'Cylinder Volume', formula: 'V = π * r² * h', description: 'Base circular area multiplied by vertical height.' },
      { step: 2, title: 'Cylinder Total Surface Area', formula: 'A = 2πrh + 2πr²', description: 'Lateral rectangular wrap area plus top and bottom circle caps.' },
      { step: 3, title: 'Sphere Volume', formula: 'V = (4/3) * π * r³', description: 'Volume of an equilateral three-dimensional spherical boundary.' },
    ],
    usageGuide: [
      { step: 1, title: 'Select Geometric Figure', text: 'Choose between 2D planar profiles or 3D volumetric solids.' },
      { step: 2, title: 'Input Linear Dimensions', text: 'Ensure all inputs share the same unit system (inches, cm, or meters).' },
      { step: 3, title: 'Review Spatial Output', text: 'Receive instantaneous surface area and interior volume metrics.' },
    ],
    faqs: [
      { question: 'What value of Pi (π) is utilized?', answer: 'The engine leverages Javascript\'s native 64-bit floating point Math.PI (3.141592653589793).' },
      { question: 'Can I calculate fluid volume with this?', answer: 'Yes! Convert cubic centimeters (cm³) directly to milliliters (1 cm³ = 1 mL) or cubic meters to liters (1 m³ = 1,000 L).' },
      { question: 'How do you find the lateral surface area of a cylinder?', answer: 'Lateral Area = 2 * π * r * h, excluding the top and bottom circles.' },
    ],
    calculate: (inputs) => {
      const shape = inputs.shape || 'cylinder';
      const a = Number(inputs.dimensionA) || 1;
      const b = Number(inputs.dimensionB) || 1;

      let volume = 0;
      let surfaceArea = 0;
      let label = 'Volume';

      if (shape === 'cylinder') {
        volume = Math.PI * Math.pow(a, 2) * b;
        surfaceArea = (2 * Math.PI * a * b) + (2 * Math.PI * Math.pow(a, 2));
      } else if (shape === 'sphere') {
        volume = (4 / 3) * Math.PI * Math.pow(a, 3);
        surfaceArea = 4 * Math.PI * Math.pow(a, 2);
      } else if (shape === 'box') {
        volume = a * b * a; // assume depth = a
        surfaceArea = 2 * (a * b + a * a + b * a);
      } else {
        // circle
        label = 'Area';
        volume = Math.PI * Math.pow(a, 2);
        surfaceArea = 2 * Math.PI * a; // circumference
      }

      return {
        primaryValue: `${volume.toFixed(2)} units³`,
        primaryLabel: `Total Computed ${label}`,
        primarySubtext: `Surface Area: ${surfaceArea.toFixed(2)} units²`,
        summary: [
          { label: 'Primary Dimension', value: `${a} units` },
          { label: 'Secondary Dimension', value: `${b} units` },
          { label: 'Surface Area / Perimeter', value: `${surfaceArea.toFixed(2)} units²` },
          { label: 'Volumetric Metric', value: `${volume.toFixed(2)} units³` },
        ],
        breakdown: [
          { label: 'Volumetric Capacity', percentage: 65, amount: `${volume.toFixed(1)} u³`, color: 'bg-[#FF8A00]' },
          { label: 'Surface Area Enclosure', percentage: 35, amount: `${surfaceArea.toFixed(1)} u²`, color: 'bg-indigo-500' },
        ],
      };
    },
  },

  // ── 13. MATHEMATICS CALCULATOR ──
  'mathematics-calculator': {
    slug: 'mathematics-calculator',
    title: 'Scientific Mathematics & Percentage Calculator',
    tagline: 'Compute percentages, ratios, factorials, fractions, and scientific mathematical functions.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Solve percentage increases, discounts, ratios, factorials, and foundational mathematical operations with instant step-by-step clarity.',
    icon: 'Percent',
    badge: 'Mathematical Core',
    tags: ['math', 'mathematics', 'percentage', 'ratio', 'fraction', 'calculator', 'algebra'],
    status: 'ready',
    primaryUnit: 'Value',
    fields: [
      { id: 'operation', label: 'Select Operation', type: 'select', defaultValue: 'pct_of', options: [
        { label: 'What is X% of Y?', value: 'pct_of' },
        { label: 'X is what % of Y?', value: 'x_is_pct' },
        { label: 'Percentage Increase / Decrease from X to Y', value: 'pct_change' },
        { label: 'Factorial of X (X!)', value: 'factorial' },
      ]},
      { id: 'valX', label: 'Value X', type: 'number', defaultValue: 15, min: 0, max: 1000000, step: 0.1 },
      { id: 'valY', label: 'Value Y', type: 'number', defaultValue: 250, min: 0.0001, max: 1000000, step: 0.1 },
    ],
    formulaSteps: [
      { step: 1, title: 'Percentage of a Value', formula: 'Result = (X / 100) * Y', description: 'Multiply fraction of 100 by base operand.' },
      { step: 2, title: 'Percentage Change', formula: 'Change% = [(Y - X) / X] * 100', description: 'Ratio of difference over original starting baseline.' },
      { step: 3, title: 'Factorial Product', formula: 'X! = X * (X-1) * ... * 1', description: 'Iterative permutation product of positive integers.' },
    ],
    usageGuide: [
      { step: 1, title: 'Select Mathematical Operator', text: 'Choose your desired percentage or scientific transformation.' },
      { step: 2, title: 'Input Variables X and Y', text: 'Enter numeric parameters.' },
      { step: 3, title: 'Inspect Computed Metrics', text: 'Verify instantaneous numerical resolution and reciprocal values.' },
    ],
    faqs: [
      { question: 'How is percentage increase calculated?', answer: 'Subtract the old value from the new value, divide by the old value, and multiply by 100.' },
      { question: 'What is the factorial of 0?', answer: 'By mathematical convention, 0! equals exactly 1.' },
      { question: 'How do you calculate a discount?', answer: 'Discounted Price = Original Price - (Original Price * Discount% / 100).' },
    ],
    calculate: (inputs) => {
      const op = inputs.operation || 'pct_of';
      const x = Number(inputs.valX) || 0;
      const y = Number(inputs.valY) || 1;

      let res = 0;
      let label = 'Result';
      let subtext = '';

      if (op === 'pct_of') {
        res = (x / 100) * y;
        label = `${x}% of ${y}`;
        subtext = `${x}% multiplied by ${y}`;
      } else if (op === 'x_is_pct') {
        res = (x / y) * 100;
        label = `${x} is ${res.toFixed(2)}% of ${y}`;
        subtext = `Proportion of ${x} over ${y}`;
      } else if (op === 'pct_change') {
        res = ((y - x) / (x || 1)) * 100;
        label = `${res >= 0 ? '+' : ''}${res.toFixed(2)}% Change`;
        subtext = res >= 0 ? `Increase from ${x} to ${y}` : `Decrease from ${x} to ${y}`;
      } else {
        // factorial of x
        const n = Math.min(20, Math.max(0, Math.round(x)));
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        res = f;
        label = `${n}! Factorial`;
        subtext = `Permutations of ${n} items`;
      }

      return {
        primaryValue: typeof res === 'number' ? res.toLocaleString(undefined, { maximumFractionDigits: 3 }) : String(res),
        primaryLabel: label,
        primarySubtext: subtext,
        summary: [
          { label: 'Operand X', value: `${x}` },
          { label: 'Operand Y', value: `${y}` },
          { label: 'Reciprocal (1/X)', value: x !== 0 ? (1 / x).toFixed(4) : 'Undefined' },
          { label: 'Difference (Y - X)', value: `${(y - x).toFixed(2)}` },
        ],
        breakdown: [
          { label: 'Calculated Value', percentage: 70, amount: `${res.toFixed(1)}`, color: 'bg-emerald-500' },
          { label: 'Base Component', percentage: 30, amount: `${x}`, color: 'bg-indigo-500' },
        ],
      };
    },
  },

  // ── 14. STATISTICS CALCULATOR ──
  'statistics-calculator': {
    slug: 'statistics-calculator',
    title: 'Statistics Mean, Variance & Standard Deviation Calculator',
    tagline: 'Calculate sample mean, median, mode, variance, and standard deviation from dataset lists.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Statistically analyze numeric distributions with sample mean, population standard deviation (σ), variance, range, and median.',
    icon: 'BarChart2',
    badge: 'Statistical Engine',
    tags: ['statistics', 'standard-deviation', 'mean', 'median', 'mode', 'variance', 'data'],
    status: 'ready',
    primaryUnit: 'σ',
    fields: [
      { id: 'dataset', label: 'Dataset Numbers (Comma or Space separated)', type: 'number', defaultValue: '12, 18, 22, 25, 29, 34, 38, 42, 50', description: 'Enter raw sample dataset values.' },
    ],
    formulaSteps: [
      { step: 1, title: 'Sample Mean (Arithmetic Average)', formula: 'μ = (Σ x_i) / n', description: 'Sum of all observation elements divided by sample size.' },
      { step: 2, title: 'Sample Variance', formula: 's² = Σ (x_i - μ)² / (n - 1)', description: 'Average squared deviation around the sample mean.' },
      { step: 3, title: 'Standard Deviation', formula: 's = √s²', description: 'Square root of variance measuring dispersion.' },
    ],
    usageGuide: [
      { step: 1, title: 'Paste Numeric Sample', text: 'Enter data points separated by commas (e.g. 10, 20, 30, 40).' },
      { step: 2, title: 'Inspect Distribution Center', text: 'Compare mean versus median to evaluate skewness.' },
      { step: 3, title: 'Review Dispersion Range', text: 'Check standard deviation to measure volatility and spread.' },
    ],
    faqs: [
      { question: 'What does standard deviation measure?', answer: 'Standard deviation quantifies the amount of variation or dispersion of a set of values from its mean.' },
      { question: 'When is median preferred over mean?', answer: 'Median is preferred when dealing with skewed distributions or datasets containing extreme outliers (such as income or housing prices).' },
      { question: 'Why divide by (n - 1) for sample variance?', answer: 'Bessel\'s correction (n - 1) removes bias when estimating population variance from a finite sample.' },
    ],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '10, 20, 30, 40, 50');
      const nums = raw.split(/[\s,]+/).map(Number).filter((v) => !isNaN(v));

      if (nums.length === 0) {
        return {
          primaryValue: '0',
          primaryLabel: 'Standard Deviation (s)',
          primarySubtext: 'No valid numbers provided',
          summary: [{ label: 'Count (n)', value: '0' }],
          breakdown: [],
        };
      }

      const n = nums.length;
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / n;

      const sorted = [...nums].sort((a, b) => a - b);
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
      const min = sorted[0];
      const max = sorted[n - 1];
      const range = max - min;

      const variance = n > 1 ? nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1) : 0;
      const stdDev = Math.sqrt(variance);

      return {
        primaryValue: `±${stdDev.toFixed(2)}`,
        primaryLabel: 'Sample Standard Deviation (s)',
        primarySubtext: `Mean: ${mean.toFixed(2)} across ${n} samples`,
        summary: [
          { label: 'Sample Mean (Average)', value: `${mean.toFixed(2)}` },
          { label: 'Sample Median', value: `${median}` },
          { label: 'Sample Variance (s²)', value: `${variance.toFixed(2)}` },
          { label: 'Dataset Range (Max - Min)', value: `${min} to ${max} (${range})` },
        ],
        breakdown: [
          { label: 'Mean Value', percentage: 50, amount: `${mean.toFixed(1)}`, color: 'bg-indigo-500' },
          { label: 'Standard Deviation Spread', percentage: Math.min(50, Math.round((stdDev / (mean || 1)) * 50)), amount: `±${stdDev.toFixed(1)}`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 15. PHYSICS CALCULATOR ──
  'physics-calculator': {
    slug: 'physics-calculator',
    title: 'Classical Kinematics & Kinetic Energy Calculator',
    tagline: 'Calculate velocity, displacement, acceleration, force, and kinetic energy.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Solve Newtonian kinematics equations ($v = v_0 + at$, $d = v_0t + 1/2at^2$) and compute relativistic kinetic energy ($KE = 1/2mv^2$).',
    icon: 'Atom',
    badge: 'Physics Engine',
    tags: ['physics', 'kinematics', 'velocity', 'acceleration', 'force', 'energy', 'science'],
    status: 'ready',
    primaryUnit: 'm/s',
    fields: [
      { id: 'v0', label: 'Initial Velocity (v₀)', type: 'number', defaultValue: 0, min: 0, max: 100000, step: 1, unit: 'm/s' },
      { id: 'acceleration', label: 'Acceleration (a)', type: 'number', defaultValue: 9.81, min: -1000, max: 1000, step: 0.1, unit: 'm/s²' },
      { id: 'time', label: 'Time Elapsed (t)', type: 'number', defaultValue: 5, min: 0.1, max: 1000, step: 0.5, unit: 's' },
      { id: 'mass', label: 'Object Mass (m)', type: 'number', defaultValue: 75, min: 0.1, max: 100000, step: 1, unit: 'kg' },
    ],
    formulaSteps: [
      { step: 1, title: 'Final Velocity Equation', formula: 'v = v₀ + at', description: 'Terminal speed under constant linear acceleration.' },
      { step: 2, title: 'Displacement / Distance Traveled', formula: 'd = v₀t + (1/2)at²', description: 'Net linear distance moved over elapsed time duration.' },
      { step: 3, title: 'Kinetic Energy (KE)', formula: 'KE = (1/2) * m * v²', description: 'Mechanical energy possessed by the mass due to its motion (Joules).' },
    ],
    usageGuide: [
      { step: 1, title: 'Set Initial Conditions', text: 'Enter starting velocity in meters per second (0 for resting state).' },
      { step: 2, title: 'Input Acceleration Vector', text: 'Standard Earth gravity acceleration is 9.81 m/s².' },
      { step: 3, title: 'Evaluate Energy Dynamics', text: 'Observe work and kinetic energy generated in Joules.' },
    ],
    faqs: [
      { question: 'What are the SI units of Kinetic Energy?', answer: 'Joules (J), defined as kilograms times meters squared per second squared (kg·m²/s²).' },
      { question: 'What is Newton\'s Second Law of Motion?', answer: 'Force = Mass * Acceleration (F = ma), measured in Newtons (N).' },
      { question: 'Does mass affect final falling speed in a vacuum?', answer: 'No! In a true vacuum without air resistance, all objects accelerate at g = 9.81 m/s² regardless of mass.' },
    ],
    calculate: (inputs) => {
      const v0 = Number(inputs.v0) || 0;
      const a = Number(inputs.acceleration) || 0;
      const t = Number(inputs.time) || 1;
      const m = Number(inputs.mass) || 1;

      const v = v0 + (a * t);
      const d = (v0 * t) + (0.5 * a * Math.pow(t, 2));
      const force = m * a;
      const ke = 0.5 * m * Math.pow(v, 2);

      return {
        primaryValue: `${v.toFixed(2)} m/s`,
        primaryLabel: 'Final Velocity (v)',
        primarySubtext: `Displacement: ${d.toFixed(2)} meters in ${t}s`,
        summary: [
          { label: 'Linear Distance Traveled', value: `${d.toFixed(2)} m` },
          { label: 'Kinetic Energy Generated', value: `${Math.round(ke).toLocaleString()} Joules` },
          { label: 'Net Force Applied (F = ma)', value: `${force.toFixed(2)} N` },
          { label: 'Terminal Speed in km/h', value: `${(v * 3.6).toFixed(2)} km/h` },
        ],
        breakdown: [
          { label: 'Initial Velocity Component', percentage: Math.min(100, Math.round((v0 / (v || 1)) * 100)), amount: `${v0} m/s`, color: 'bg-[#FF8A00]' },
          { label: 'Acceleration Contribution', percentage: Math.max(0, 100 - Math.min(100, Math.round((v0 / (v || 1)) * 100))), amount: `${(a * t).toFixed(1)} m/s`, color: 'bg-amber-500' },
        ],
      };
    },
  },

  // ── 16. ELECTRONICS CALCULATOR ──
  'electronics-calculator': {
    slug: 'electronics-calculator',
    title: 'Electronics Voltage Divider & Ohm’s Law Calculator',
    tagline: 'Calculate resistor voltage dividers, current draw, and power dissipation.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Design resistive voltage divider circuits, calculate precise output voltage ($V_{out}$), circuit current ($I$), and thermal power dissipation in Watts.',
    icon: 'Zap',
    badge: 'Hardware Circuitry',
    tags: ['electronics', 'voltage-divider', 'ohms-law', 'resistor', 'circuit', 'hardware', 'pcb'],
    status: 'ready',
    primaryUnit: 'V',
    fields: [
      { id: 'vin', label: 'Input Voltage (V_in)', type: 'number', defaultValue: 12, min: 0.1, max: 1000, step: 0.5, unit: 'V' },
      { id: 'r1', label: 'Resistor R1 (Ohms)', type: 'number', defaultValue: 10000, min: 1, max: 10000000, step: 100, unit: 'Ω' },
      { id: 'r2', label: 'Resistor R2 (Ohms)', type: 'number', defaultValue: 4700, min: 1, max: 10000000, step: 100, unit: 'Ω' },
    ],
    formulaSteps: [
      { step: 1, title: 'Voltage Divider Equation', formula: 'V_out = V_in * [R2 / (R1 + R2)]', description: 'Fractional voltage drop across resistor R2.' },
      { step: 2, title: 'Circuit Loop Current (Ohm\'s Law)', formula: 'I = V_in / (R1 + R2)', description: 'Total quiescent current flowing through the series divider.' },
      { step: 3, title: 'Power Dissipation', formula: 'P = I² * R', description: 'Verify thermal load stays within resistor wattage ratings (e.g. 1/4W).' },
    ],
    usageGuide: [
      { step: 1, title: 'Supply Input Rail Voltage', text: 'Common logic levels include 3.3V, 5V, 12V, and 24V.' },
      { step: 2, title: 'Select Standard E24/E96 Resistors', text: 'Higher resistance values reduce idle battery drain.' },
      { step: 3, title: 'Check Power Dissipation', text: 'Ensure heat dissipation does not exceed component wattage ratings.' },
    ],
    faqs: [
      { question: 'What is Ohm\'s Law?', answer: 'Ohm\'s Law states that Voltage = Current * Resistance (V = I * R), foundational to electrical circuit analysis.' },
      { question: 'Can I use a voltage divider to power a motor?', answer: 'No! Voltage dividers are intended for reference signals (ADCs, logic level shifting). Heavy load currents cause significant voltage drops.' },
      { question: 'How do I choose R1 and R2 values?', answer: 'Choose values large enough to minimize quiescent current draw, but small enough that input impedance of the receiving circuit doesn\'t distort the signal.' },
    ],
    calculate: (inputs) => {
      const vin = Number(inputs.vin) || 5;
      const r1 = Number(inputs.r1) || 1000;
      const r2 = Number(inputs.r2) || 1000;

      const totalR = r1 + r2;
      const vout = vin * (r2 / totalR);
      const current = vin / totalR; // Amps
      const pR1 = Math.pow(current, 2) * r1; // Watts
      const pR2 = Math.pow(current, 2) * r2; // Watts

      return {
        primaryValue: `${vout.toFixed(2)} V`,
        primaryLabel: 'Output Voltage (V_out)',
        primarySubtext: `Divider Ratio: ${(vout / vin).toFixed(3)} | Current: ${(current * 1000).toFixed(2)} mA`,
        summary: [
          { label: 'Total Series Resistance', value: `${(totalR / 1000).toFixed(2)} kΩ` },
          { label: 'Quiescent Loop Current', value: `${(current * 1000).toFixed(3)} mA` },
          { label: 'R1 Power Dissipation', value: `${(pR1 * 1000).toFixed(1)} mW` },
          { label: 'R2 Power Dissipation', value: `${(pR2 * 1000).toFixed(1)} mW` },
        ],
        breakdown: [
          { label: 'Voltage Drop Across R1', percentage: Math.round(((vin - vout) / vin) * 100), amount: `${(vin - vout).toFixed(2)} V`, color: 'bg-amber-500' },
          { label: 'Output Voltage across R2', percentage: Math.round((vout / vin) * 100), amount: `${vout.toFixed(2)} V`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 17. CHEMISTRY CALCULATOR ──
  'chemistry-calculator': {
    slug: 'chemistry-calculator',
    title: 'Chemistry Solution Dilution (M1V1 = M2V2) Calculator',
    tagline: 'Calculate molar concentrations, stock solution aliquots, and solvent dilution volumes.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Accurately prepare chemical laboratory solutions with the universal dilution equation ($M_1V_1 = M_2V_2$), determining required stock volume and solvent additions.',
    icon: 'FlaskConical',
    badge: 'Laboratory Science',
    tags: ['chemistry', 'dilution', 'molarity', 'solutions', 'concentration', 'laboratory', 'science'],
    status: 'ready',
    primaryUnit: 'mL',
    fields: [
      { id: 'm1', label: 'Initial Stock Concentration (M1)', type: 'number', defaultValue: 5.0, min: 0.001, max: 100, step: 0.1, unit: 'M (mol/L)' },
      { id: 'm2', label: 'Desired Final Concentration (M2)', type: 'number', defaultValue: 0.5, min: 0.001, max: 100, step: 0.05, unit: 'M (mol/L)' },
      { id: 'v2', label: 'Desired Final Total Volume (V2)', type: 'number', defaultValue: 500, min: 1, max: 50000, step: 10, unit: 'mL' },
    ],
    formulaSteps: [
      { step: 1, title: 'Conservation of Solute Mass', formula: 'M₁ * V₁ = M₂ * V₂', description: 'The absolute moles of solute remain constant throughout the dilution.' },
      { step: 2, title: 'Solve for Stock Aliquot (V1)', formula: 'V₁ = (M₂ * V₂) / M₁', description: 'Volume of concentrated stock solution required.' },
      { step: 3, title: 'Required Solvent Addition', formula: 'V_solvent = V₂ - V₁', description: 'Volume of distilled water or buffer to add to stock aliquot.' },
    ],
    usageGuide: [
      { step: 1, title: 'Specify Stock Molarity (M1)', text: 'Enter starting bottle concentration from chemical supplier label.' },
      { step: 2, title: 'Enter Target Working Strength (M2)', text: 'Target must be less than stock concentration.' },
      { step: 3, title: 'Add Solvent to Mark', text: 'Pipette stock volume V1 into volumetric flask and bring to line with solvent.' },
    ],
    faqs: [
      { question: 'Can M1 be less than M2?', answer: 'No! Dilution can only decrease concentration. To increase concentration, evaporation or addition of dry solute is required.' },
      { question: 'What units can be used for V1 and V2?', answer: 'Any volume unit (mL, L, μL) as long as both V1 and V2 share the identical unit scale.' },
      { question: 'What is Molarity?', answer: 'Molarity (M) is the concentration of a solution expressed as moles of solute per liter of total solution (mol/L).' },
    ],
    calculate: (inputs) => {
      const m1 = Number(inputs.m1) || 1;
      const m2 = Number(inputs.m2) || 0.1;
      const v2 = Number(inputs.v2) || 100;

      if (m2 > m1) {
        return {
          primaryValue: 'Error',
          primaryLabel: 'Invalid Dilution',
          primarySubtext: 'Target concentration (M2) cannot exceed stock (M1)',
          summary: [{ label: 'Error', value: 'M2 > M1' }],
          breakdown: [],
        };
      }

      const v1 = (m2 * v2) / m1;
      const solvent = v2 - v1;
      const dilutionFactor = m1 / m2;

      return {
        primaryValue: `${v1.toFixed(2)} mL`,
        primaryLabel: 'Required Stock Solution (V1)',
        primarySubtext: `Add ${solvent.toFixed(2)} mL of solvent to reach ${v2} mL total`,
        summary: [
          { label: 'Stock Aliquot (V1)', value: `${v1.toFixed(2)} mL` },
          { label: 'Solvent to Add (H₂O)', value: `${solvent.toFixed(2)} mL` },
          { label: 'Total Solution Volume (V2)', value: `${v2} mL` },
          { label: 'Dilution Factor', value: `${dilutionFactor.toFixed(1)}x` },
        ],
        breakdown: [
          { label: 'Stock Solution (V1)', percentage: Math.round((v1 / v2) * 100), amount: `${v1.toFixed(1)} mL`, color: 'bg-indigo-500' },
          { label: 'Solvent (Diluent)', percentage: 100 - Math.round((v1 / v2) * 100), amount: `${solvent.toFixed(1)} mL`, color: 'bg-[#FF8A00]' },
        ],
      };
    },
  },

  // ── 18. AUTOMOTIVE CALCULATOR ──
  'automotive-calculator': {
    slug: 'automotive-calculator',
    title: 'Automotive Fuel Economy & Trip Cost Calculator',
    tagline: 'Calculate vehicle fuel economy (MPG vs. L/100km), trip fuel expenses, and cost per mile.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Compute exact vehicle fuel efficiency metrics, bidirectional US MPG to Metric L/100km conversions, and total road trip travel expenditures.',
    icon: 'Car',
    badge: 'Vehicle Telemetry',
    tags: ['automotive', 'fuel-economy', 'mpg', 'liters-per-100km', 'trip-cost', 'gas', 'vehicle'],
    status: 'ready',
    primaryUnit: 'MPG',
    fields: [
      { id: 'distance', label: 'Trip Distance (Miles)', type: 'number', defaultValue: 350, min: 1, max: 20000, step: 10, unit: 'Miles' },
      { id: 'fuelUsed', label: 'Fuel Consumed (Gallons)', type: 'number', defaultValue: 12.5, min: 0.1, max: 2000, step: 0.5, unit: 'Gallons' },
      { id: 'pricePerGallon', label: 'Fuel Price Per Gallon ($)', type: 'number', defaultValue: 3.65, min: 0.5, max: 20, step: 0.05, unit: '$' },
    ],
    formulaSteps: [
      { step: 1, title: 'Miles Per Gallon (MPG)', formula: 'MPG = DistanceMiles / FuelGallons', description: 'Average miles traveled per gallon of fuel consumed.' },
      { step: 2, title: 'Metric Conversion (L/100km)', formula: 'L/100km = 235.215 / MPG', description: 'International standard for automotive fuel consumption.' },
      { step: 3, title: 'Trip Fuel Expenditure', formula: 'Cost = FuelGallons * PricePerGallon', description: 'Direct financial fuel cost for the specified journey.' },
    ],
    usageGuide: [
      { step: 1, title: 'Record Odometer Distance', text: 'Enter miles driven between full tank fill-ups.' },
      { step: 2, title: 'Enter Pump Gallons', text: 'Input exact volume pumped at the gas station.' },
      { step: 3, title: 'Examine Cost Per Mile', text: 'Determine true operating expense for personal budgeting or business reimbursement.' },
    ],
    faqs: [
      { question: 'How is L/100km converted to MPG?', answer: 'Divide 235.215 by the L/100km value to obtain US MPG (or divide 235.215 by MPG to obtain L/100km).' },
      { question: 'What does a lower L/100km figure mean?', answer: 'Unlike MPG where higher is better, in L/100km a lower number indicates higher fuel efficiency (fewer liters needed per 100km).' },
      { question: 'What causes real-world MPG to drop?', answer: 'Aggressive acceleration, under-inflated tires, roof racks, cold weather, and prolonged engine idling.' },
    ],
    calculate: (inputs) => {
      const dist = Number(inputs.distance) || 100;
      const fuel = Number(inputs.fuelUsed) || 5;
      const price = Number(inputs.pricePerGallon) || 3.5;

      const mpg = fuel > 0 ? dist / fuel : 0;
      const l100km = mpg > 0 ? 235.215 / mpg : 0;
      const tripCost = fuel * price;
      const costPerMile = dist > 0 ? tripCost / dist : 0;

      return {
        primaryValue: `${mpg.toFixed(1)} MPG`,
        primaryLabel: 'Vehicle Fuel Economy',
        primarySubtext: `Metric: ${l100km.toFixed(2)} L/100km | Cost: $${costPerMile.toFixed(2)}/mile`,
        summary: [
          { label: 'Total Trip Fuel Cost', value: `$${tripCost.toFixed(2)}` },
          { label: 'Cost Per Mile Driven', value: `$${costPerMile.toFixed(3)}/mi` },
          { label: 'Metric Fuel Efficiency', value: `${l100km.toFixed(2)} L/100km` },
          { label: 'Fuel Consumed', value: `${fuel} Gallons (${(fuel * 3.785).toFixed(1)} Liters)` },
        ],
        breakdown: [
          { label: 'Fuel Expense', percentage: 100, amount: `$${tripCost.toFixed(2)}`, color: 'bg-emerald-500' },
        ],
      };
    },
  },

  // ── 19. AGRICULTURE CALCULATOR ──
  'agriculture-calculator': {
    slug: 'agriculture-calculator',
    title: 'Agriculture Fertilizer & Crop Seeding Rate Calculator',
    tagline: 'Calculate fertilizer application rates, seeding density, and crop yield requirements.',
    category: 'specialized',
    categoryLabel: 'General & Scientific Calculators',
    description: 'Determine exact commercial fertilizer poundage, 50lb bag requirements, and nutrient application rates per acre based on target Nitrogen recommendations.',
    icon: 'Sprout',
    badge: 'Agronomy Modeling',
    tags: ['agriculture', 'fertilizer', 'seeding', 'crop', 'farming', 'yield', 'agronomy'],
    status: 'ready',
    primaryUnit: 'lbs',
    fields: [
      { id: 'fieldAcres', label: 'Field Size (Acres)', type: 'number', defaultValue: 40, min: 0.1, max: 100000, step: 5, unit: 'Acres' },
      { id: 'targetNitrogen', label: 'Target Nitrogen Rate (lbs N / Acre)', type: 'number', defaultValue: 120, min: 1, max: 500, step: 5, unit: 'lbs/acre' },
      { id: 'fertilizerType', label: 'Fertilizer Nitrogen Grade', type: 'select', defaultValue: 'urea', options: [
        { label: 'Urea (46-0-0) [46% N]', value: 'urea' },
        { label: 'Ammonium Nitrate (34-0-0) [34% N]', value: 'an' },
        { label: 'DAP (18-46-0) [18% N]', value: 'dap' },
        { label: 'Liquid UAN-32 [32% N]', value: 'uan32' },
      ]},
    ],
    formulaSteps: [
      { step: 1, title: 'Nutrient Application per Acre', formula: 'ProductRate = TargetNutrient / (Grade% / 100)', description: 'Gross fertilizer product required to supply 1 lb of elemental nutrient.' },
      { step: 2, title: 'Total Field Fertilizer Requirement', formula: 'TotalLbs = ProductRate * FieldAcres', description: 'Gross commercial weight required for full field coverage.' },
      { step: 3, title: 'Bag Inventory Quantity', formula: 'Bags = TotalLbs / 50', description: 'Number of standard 50lb bags to procure.' },
    ],
    usageGuide: [
      { step: 1, title: 'Enter Field Acreage', text: 'Input total tillable crop area in acres.' },
      { step: 2, title: 'Check Agronomic Soil Test', text: 'Apply university extension recommendations for crop nitrogen.' },
      { step: 3, title: 'Select Fertilizer Grade', text: 'Urea supplies 46% elemental N by weight.' },
    ],
    faqs: [
      { question: 'Why does Urea require more bulk product than liquid nitrogen?', answer: 'Urea is 46% Nitrogen, so 100 lbs of Urea delivers 46 lbs of actual elemental N.' },
      { question: 'How is fertilizer burn prevented?', answer: 'Split fertilizer applications across early vegetative growth stages rather than delivering 100% upfront.' },
      { question: 'How many square feet are in an acre?', answer: 'One acre equals exactly 43,560 square feet.' },
    ],
    calculate: (inputs) => {
      const acres = Number(inputs.fieldAcres) || 1;
      const targetN = Number(inputs.targetNitrogen) || 100;
      const type = inputs.fertilizerType || 'urea';

      const nGrades: Record<string, number> = {
        urea: 0.46,
        an: 0.34,
        dap: 0.18,
        uan32: 0.32,
      };

      const nGrade = nGrades[type] || 0.46;
      const lbsProductPerAcre = targetN / nGrade;
      const totalProductLbs = lbsProductPerAcre * acres;
      const bags50 = Math.ceil(totalProductLbs / 50);

      return {
        primaryValue: `${Math.round(totalProductLbs).toLocaleString()} lbs`,
        primaryLabel: 'Total Commercial Fertilizer Required',
        primarySubtext: `${Math.round(lbsProductPerAcre)} lbs/acre across ${acres} acres (${bags50.toLocaleString()} x 50lb bags)`,
        summary: [
          { label: 'Product Rate per Acre', value: `${Math.round(lbsProductPerAcre)} lbs/acre` },
          { label: '50lb Bags Required', value: `${bags50.toLocaleString()} bags` },
          { label: 'Total Elemental N Delivered', value: `${(targetN * acres).toLocaleString()} lbs N` },
          { label: 'Field Surface Area', value: `${(acres * 43560).toLocaleString()} sq ft` },
        ],
        breakdown: [
          { label: 'Elemental Nitrogen (N)', percentage: Math.round(nGrade * 100), amount: `${Math.round(totalProductLbs * nGrade).toLocaleString()} lbs`, color: 'bg-emerald-500' },
          { label: 'Carrier & Conditioner Matrix', percentage: 100 - Math.round(nGrade * 100), amount: `${Math.round(totalProductLbs * (1 - nGrade)).toLocaleString()} lbs`, color: 'bg-slate-400' },
        ],
      };
    },
  },
};

export function getAllCalculators(): CalculatorDefinition[] {
  return Object.values(CALCULATORS_REGISTRY);
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return CALCULATORS_REGISTRY[slug];
}

export function getCalculatorsByCategory(category: CalculatorCategory): CalculatorDefinition[] {
  return Object.values(CALCULATORS_REGISTRY).filter((c) => c.category === category);
}