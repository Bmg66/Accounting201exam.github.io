
import React, { useState, FC, ReactNode, ElementType } from 'react';
import { 
  Calculator, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  PieChart,
  RefreshCw,
  Award,
  PlayCircle,
  BarChart2,
  Activity,
  Zap,
  ChevronsRight,
  Minus,
  Plus,
  ArrowRight,
  Equal,
  Gauge,
  Scale,
  Users,
  Shield,
  FileText,
  Building,
  Landmark,
  BookMarked,
  AlertTriangle,
  Lightbulb,
  Divide,
  X,
  ClipboardList
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface JournalEntryItem {
  account: string;
  debit: number | null;
  credit: number | null;
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
  icon: ElementType;
}

interface ConceptCardProps {
  topic: string;
  isMastered: boolean;
  toggleMastered: (topic: string) => void;
}

interface JournalEntryProps {
  title: string;
  entries: JournalEntryItem[];
}

interface SimSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}

interface SimCardProps {
  title: string;
  children: ReactNode;
  icon: ElementType;
}

interface ProblemCardProps {
  title: string;
  children: ReactNode;
  onNewProblem: () => void;
}

interface JournalEntryInputProps {
  entry: JournalEntryItem;
  userAnswers: { [key: string]: { debit?: string; credit?: string } };
  onAnswerChange: (account: string, type: 'debit' | 'credit', value: string) => void;
  isChecked: boolean;
}

interface SolutionBoxProps {
  isOpen: boolean;
  children: ReactNode;
}

interface FormulaCardProps {
  title: string;
  formula: string;
  components: { name: string; desc: string }[];
}


// --- Data: Study Guide Topics ---
const studyTopics = [
  { 
    chapter: 7, 
    topics: [
      "Tangible vs. intangible assets",
      "Costs included in the recording of a long-term asset (Capitalize)",
      "Definition of 'depreciation'",
      "Net Book Value (Cost - Accumulated Depreciation)",
      "Residual Value (Salvage Value)",
      "Depreciable cost (Cost - Residual Value)",
      "Calculated depreciation expense (straight-line, double-declining-balance, activity-based)",
      "Calculate partial-year depreciation",
      "Change in estimate for depreciation",
      "Amortization (for intangible assets)",
      "Record the sale, retirement and exchange of assets (Gain/Loss)",
      "Returns on Assets (ROA = Net Income / Avg. Total Assets)",
      "Profit Margin (Net Income / Net Sales)",
      "Asset Turnover (Net Sales / Avg. Total Assets)",
      "Treatment of research and development (R&D) costs (expensed)",
      "Goodwill (recorded only during business acquisition)",
    ]
  },
  {
    chapter: 8,
    topics: [
      "Record the issuance of a note payable, accrued interest and note maturity",
      "Payroll taxes – employee vs. employer (FICA, Unemployment)",
      "Record 'employee' side and 'employer' side of payroll transactions",
      "Unearned revenue (liability)",
      "Sales tax payable (liability)",
      "Current portion of long-term debt",
      "Treatment of gain contingencies (not recorded) vs. loss contingencies (recorded if probable & estimable)",
      "Record warranty expense accrual (matching principle)",
      "Liquidity (ability to meet short-term obligations)",
      "Working capital (Current Assets - Current Liabilities)",
      "Current ratio (Current Assets / Current Liabilities)",
      "Acid-test (Quick) ratio ((Cash + Short-term Investments + A/R) / Current Liabilities)",
    ]
  },
  {
    chapter: 9,
    topics: [
      "Debt vs. equity financing (pros and cons)",
      "Leverage (using debt to increase return on equity)",
      "Callable bonds (issuer can redeem early)",
      "How is the price of a bond determined? (Present value of future cash flows)",
      "Stated vs. market interest rate",
      "When is a bond issued at face value vs. a discount vs. a premium",
      "Calculation of cash interest payment vs. interest expense on bonds payable",
      "Record the issuance of a bond, the bond interest payment (including amortization), and bond retirement",
      "Installment note payments (principal and interest components)",
      "Recording a lease (operating vs. finance)",
      "Solvency (ability to meet long-term obligations)",
      "Debt-to-equity ratio (Total Liabilities / Stockholders' Equity)",
      "Times-interest-earned ratio (EBIT / Interest Expense)",
    ]
  },
];

// --- Components ---

const TabButton: FC<TabButtonProps> = ({ isActive, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden sm:inline">{children}</span>
  </button>
);

const ConceptCard: FC<ConceptCardProps> = ({ topic, isMastered, toggleMastered }) => (
  <div className={`p-4 rounded-lg flex items-center justify-between transition-all ${isMastered ? 'bg-emerald-50 text-emerald-800' : 'bg-white shadow-sm text-slate-800'}`}>
    <p className={`font-medium ${isMastered ? 'line-through' : ''}`}>{topic}</p>
    <button
      onClick={() => toggleMastered(topic)}
      className={`p-1 rounded-full ${isMastered ? 'bg-emerald-200 hover:bg-emerald-300' : 'bg-slate-100 hover:bg-slate-200'}`}
      title={isMastered ? "Mark as Incomplete" : "Mark as Mastered"}
    >
      <CheckCircle className={`w-5 h-5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
    </button>
  </div>
);

const JournalEntry: FC<JournalEntryProps> = ({ title, entries }) => (
  <div className="mt-4 w-full">
    <h4 className="font-semibold text-sm text-slate-700 mb-2">{title}</h4>
    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Account</th>
            <th className="px-3 py-2 text-right font-medium text-slate-600">Debit</th>
            <th className="px-3 py-2 text-right font-medium text-slate-600">Credit</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {entries.map((entry, index) => (
            <tr key={index}>
              <td className={`px-3 py-2 ${entry.credit ? 'pl-8 text-slate-600' : 'text-slate-800'}`}>{entry.account}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-800">{entry.debit ? `$${entry.debit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-800">{entry.credit ? `$${entry.credit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- INTERACTIVE SIMULATIONS ---

const SimSlider: FC<SimSliderProps> = ({ label, value, min, max, step, onChange, format }) => (
  <div className="w-full">
    <label className="flex justify-between items-center text-sm font-medium text-slate-700">
      <span>{label}</span>
      <span className="font-bold text-blue-600">{format(value)}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
      style={{accentColor: '#2563eb'}}
    />
  </div>
);

const SimCard: FC<SimCardProps> = ({ title, children, icon: Icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-100 flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="flex-grow space-y-4">
      {children}
    </div>
  </div>
);

const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
const formatCurrencyInt = (val: number) => `$${val.toLocaleString()}`;
const formatPercent = (val: number) => `${val.toFixed(1)}%`;
const formatPercentInt = (val: number) => `${val}%`;
const formatUnits = (val: number) => `${val.toLocaleString()} units`;
const formatYears = (val: number) => `${val.toFixed(1)} years`;
const formatYearsInt = (val: number) => `${val} years`;
const formatRatio = (val: number) => val.toFixed(2);

const DepreciationSim = () => {
  const [cost, setCost] = useState(100000);
  const [salvage, setSalvage] = useState(10000);
  const [life, setLife] = useState(5);

  const depreciableCost = Math.max(0, cost - salvage);
  const slDepreciation = life > 0 ? depreciableCost / life : 0;
  const ddbRate = life > 0 ? (1 / life) * 2 : 0;
  const ddbYear1 = cost * ddbRate;
  const ddbYear2 = (cost - ddbYear1) * ddbRate;

  return (
    <SimCard title="Depreciation Method Visualizer" icon={BarChart2}>
      <SimSlider label="Asset Cost" value={cost} min={10000} max={500000} step={1000} onChange={setCost} format={formatCurrencyInt} />
      <SimSlider label="Salvage Value" value={salvage} min={0} max={cost * 0.5} step={500} onChange={setSalvage} format={formatCurrencyInt} />
      <SimSlider label="Useful Life" value={life} min={3} max={20} step={1} onChange={setLife} format={formatYearsInt} />
      
      <div className="space-y-2 pt-2">
        <h4 className="font-semibold text-slate-800">Calculated Annual Depreciation:</h4>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="font-medium">Straight-Line: <span className="font-bold text-emerald-600">{formatCurrency(slDepreciation)} / year</span></p>
          <p className="text-xs text-slate-500">({formatCurrencyInt(cost)} - {formatCurrencyInt(salvage)}) / {life} years</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="font-medium">Double-Declining (Year 1): <span className="font-bold text-amber-600">{formatCurrency(ddbYear1)}</span></p>
          <p className="text-xs text-slate-500">{formatCurrencyInt(cost)} * {(ddbRate * 100).toFixed(0)}%</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="font-medium">Double-Declining (Year 2): <span className="font-bold text-amber-600">{formatCurrency(ddbYear2)}</span></p>
           <p className="text-xs text-slate-500">({formatCurrencyInt(cost)} - {formatCurrency(ddbYear1)}) * {(ddbRate * 100).toFixed(0)}%</p>
        </div>
      </div>
    </SimCard>
  );
};

const BondPricingSim = () => {
  const [statedRate, setStatedRate] = useState(8);
  const [marketRate, setMarketRate] = useState(8);

  const getBondStatus = () => {
    if (statedRate > marketRate) return { text: 'Premium', color: 'text-emerald-600', scale: 1.1 };
    if (statedRate < marketRate) return { text: 'Discount', color: 'text-red-600', scale: 0.9 };
    return { text: 'Face Value', color: 'text-blue-600', scale: 1.0 };
  };
  
  const status = getBondStatus();

  return (
    <SimCard title="Bond Pricing (Stated vs. Market)" icon={Scale}>
      <SimSlider label="Stated (Coupon) Rate" value={statedRate} min={4} max={12} step={0.5} onChange={setStatedRate} format={formatPercent} />
      <SimSlider label="Market Rate" value={marketRate} min={4} max={12} step={0.5} onChange={setMarketRate} format={formatPercent} />
      
      <div className="flex justify-around items-center pt-4 h-32">
        <div className="text-center">
          <Landmark className="w-12 h-12 text-blue-500 mx-auto" />
          <p className="font-semibold">Stated Rate</p>
          <p className="font-bold text-xl text-blue-600">{formatPercent(statedRate)}</p>
        </div>
        
        <div 
          className="text-center transition-transform duration-300" 
          style={{ transform: `scale(${status.scale})` }}
        >
          <p className={`font-bold text-2xl ${status.color}`}>{status.text}</p>
        </div>

        <div className="text-center">
          <Building className="w-12 h-12 text-slate-500 mx-auto" />
          <p className="font-semibold">Market Rate</p>
          <p className="font-bold text-xl text-slate-600">{formatPercent(marketRate)}</p>
        </div>
      </div>
      
      <div className="p-3 bg-slate-50 rounded-lg text-center">
        <p className="font-medium text-slate-800">
          {statedRate > marketRate && "Investors pay MORE (a premium) because this bond's rate is better than the market."}
          {statedRate < marketRate && "Investors pay LESS (a discount) because this bond's rate is worse than the market."}
          {statedRate === marketRate && "Investors pay exactly face value because the rates match."}
        </p>
      </div>
    </SimCard>
  );
};

const AssetSaleSim = () => {
  const [cost, setCost] = useState(50000);
  const [accumDep, setAccumDep] = useState(30000);
  const [salePrice, setSalePrice] = useState(25000);

  const bookValue = cost - accumDep;
  const gainLoss = salePrice - bookValue;

  const journalEntries = [
    { account: 'Cash', debit: salePrice, credit: null },
    { account: 'Accumulated Depreciation', debit: accumDep, credit: null },
    ...(gainLoss < 0 ? [{ account: 'Loss on Sale', debit: Math.abs(gainLoss), credit: null as number | null }] : []),
    { account: 'Equipment', debit: null, credit: cost },
    ...(gainLoss > 0 ? [{ account: 'Gain on Sale', debit: null, credit: gainLoss }] : []),
  ];

  return (
    <SimCard title="Gain/Loss on Asset Sale" icon={DollarSign}>
      <SimSlider label="Original Cost" value={cost} min={10000} max={100000} step={1000} onChange={setCost} format={formatCurrencyInt} />
      <SimSlider label="Accumulated Depreciation" value={accumDep} min={0} max={cost} step={1000} onChange={setAccumDep} format={formatCurrencyInt} />
      <SimSlider label="Cash Received (Sale Price)" value={salePrice} min={0} max={100000} step={500} onChange={setSalePrice} format={formatCurrencyInt} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-800">Book Value</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrencyInt(bookValue)}</p>
          <p className="text-xs text-blue-500">({formatCurrencyInt(cost)} - {formatCurrencyInt(accumDep)})</p>
        </div>
        <div className={`p-3 rounded-lg text-center ${gainLoss >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className={`text-sm font-medium ${gainLoss >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
            {gainLoss >= 0 ? 'Gain on Sale' : 'Loss on Sale'}
          </p>
          <p className={`text-xl font-bold ${gainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrencyInt(Math.abs(gainLoss))}
          </p>
          <p className={`text-xs ${gainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            ({formatCurrencyInt(salePrice)} - {formatCurrencyInt(bookValue)})
          </p>
        </div>
      </div>
      <JournalEntry title="Live-Updating Journal Entry" entries={journalEntries} />
    </SimCard>
  );
};

const InterestSim = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(6);
  const [months, setMonths] = useState(4);
  
  const interest = principal * (rate / 100) * (months / 12);

  const journalEntries = [
    { account: 'Interest Expense', debit: interest, credit: null },
    { account: 'Interest Payable', debit: null, credit: interest },
  ];

  return (
    <SimCard title="Simple Interest Accrual (P x R x T)" icon={Calculator}>
      <SimSlider label="Principal" value={principal} min={10000} max={500000} step={5000} onChange={setPrincipal} format={formatCurrencyInt} />
      <SimSlider label="Annual Rate" value={rate} min={1} max={15} step={0.5} onChange={setRate} format={formatPercent} />
      <SimSlider label="Time (in Months)" value={months} min={1} max={12} step={1} onChange={setMonths} format={(val) => `${val} months`} />
      
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm font-medium text-blue-800">Accrued Interest Expense</p>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(interest)}</p>
        <p className="text-xs text-blue-500 font-mono">
          {formatCurrencyInt(principal)} x {(rate / 100).toFixed(3)} x ({months}/12)
        </p>
      </div>
      <JournalEntry title="Accrual Journal Entry" entries={journalEntries} />
    </SimCard>
  );
};

const LiquiditySim = () => {
  const [currentAssets, setCurrentAssets] = useState(50000);
  const [currentLiab, setCurrentLiab] = useState(25000);
  const [quickAssets, setQuickAssets] = useState(30000);

  const workingCapital = currentAssets - currentLiab;
  const currentRatio = currentLiab > 0 ? currentAssets / currentLiab : 0;
  const quickRatio = currentLiab > 0 ? quickAssets / currentLiab : 0;

  return (
    <SimCard title="Liquidity Ratios" icon={Gauge}>
      <SimSlider label="Current Assets" value={currentAssets} min={10000} max={100000} step={1000} onChange={setCurrentAssets} format={formatCurrencyInt} />
      <SimSlider label="Quick Assets (Cash, ST Inv, A/R)" value={quickAssets} min={5000} max={currentAssets} step={1000} onChange={setQuickAssets} format={formatCurrencyInt} />
      <SimSlider label="Current Liabilities" value={currentLiab} min={10000} max={100000} step={1000} onChange={setCurrentLiab} format={formatCurrencyInt} />
      
      <div className="grid grid-cols-3 gap-2 pt-2 text-center">
        <div className="p-2 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-700">Working Capital</p>
          <p className={`text-lg font-bold ${workingCapital >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrencyInt(workingCapital)}</p>
        </div>
         <div className="p-2 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-700">Current Ratio</p>
          <p className={`text-lg font-bold ${currentRatio >= 2 ? 'text-emerald-600' : (currentRatio >= 1 ? 'text-amber-600' : 'text-red-600')}`}>{formatRatio(currentRatio)}</p>
        </div>
         <div className="p-2 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-700">Quick Ratio</p>
          <p className={`text-lg font-bold ${quickRatio >= 1 ? 'text-emerald-600' : (quickRatio >= 0.5 ? 'text-amber-600' : 'text-red-600')}`}>{formatRatio(quickRatio)}</p>
        </div>
      </div>
    </SimCard>
  );
};

const BondInterestSim = () => {
  const [bookValue, setBookValue] = useState(95000); // 95,000 (Discount) or 105,000 (Premium)
  const [faceValue, setFaceValue] = useState(100000);
  const [statedRate, setStatedRate] = useState(8);
  const [marketRate, setMarketRate] = useState(10); // 10% (Discount) or 6% (Premium)

  const isDiscount = bookValue < faceValue;
  const semiannualStatedRate = statedRate / 100 / 2;
  const semiannualMarketRate = marketRate / 100 / 2;

  const cashPaid = faceValue * semiannualStatedRate;
  const interestExpense = bookValue * semiannualMarketRate;
  const amortization = Math.abs(interestExpense - cashPaid);
  
  const journalEntries = [
    { account: 'Interest Expense', debit: interestExpense, credit: null },
    ...(isDiscount ? [{ account: 'Discount on Bonds Payable', debit: null, credit: amortization }] : [{ account: 'Premium on Bonds Payable', debit: amortization, credit: null as number | null }]),
    { account: 'Cash', debit: null, credit: cashPaid },
  ];

  return (
    <SimCard title="Bond Interest Payment (Discount/Premium)" icon={FileText}>
      <p className="text-sm -mt-2 mb-2 text-slate-600">This simulates a single <strong>semiannual</strong> interest payment.</p>
      <SimSlider label="Face Value of Bond" value={faceValue} min={100000} max={100000} step={1} onChange={() => {}} format={formatCurrencyInt} />
      <SimSlider label="Stated Rate" value={statedRate} min={4} max={12} step={1} onChange={setStatedRate} format={formatPercentInt} />
      <SimSlider label="Market Rate (at issue)" value={marketRate} min={4} max={12} step={1} onChange={setMarketRate} format={formatPercentInt} />
      <SimSlider label="Current Book Value" value={bookValue} min={faceValue * 0.9} max={faceValue * 1.1} step={100} onChange={setBookValue} format={formatCurrencyInt} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-red-50 rounded-lg text-center">
          <p className="text-sm font-medium text-red-800">Cash Paid (Face x Stated)</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(cashPaid)}</p>
          <p className="text-xs text-red-500 font-mono">{formatCurrencyInt(faceValue)} x {semiannualStatedRate * 100}%</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-800">Interest Expense (BV x Market)</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(interestExpense)}</p>
          <p className="text-xs text-blue-500 font-mono">{formatCurrencyInt(bookValue)} x {semiannualMarketRate * 100}%</p>
        </div>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-sm font-medium text-slate-700">Amortization of {isDiscount ? 'Discount' : 'Premium'}</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(amortization)}</p>
      </div>
      <JournalEntry title="Interest Payment Journal Entry" entries={journalEntries} />
    </SimCard>
  );
};

const ROASim = () => {
  const [profitMargin, setProfitMargin] = useState(10); // 10%
  const [assetTurnover, setAssetTurnover] = useState(1.5); // 1.5
  
  const roa = profitMargin * assetTurnover / 100;

  return (
    <SimCard title="Return on Assets (ROA) " icon={TrendingUp}>
      <SimSlider label="Profit Margin" value={profitMargin} min={1} max={30} step={0.5} onChange={setProfitMargin} format={formatPercent} />
      <SimSlider label="Asset Turnover" value={assetTurnover} min={0.1} max={5} step={0.1} onChange={setAssetTurnover} format={formatRatio} />
      
      <div className="flex items-center justify-center space-x-4 pt-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Profit Margin</p>
          <p className="text-2xl font-bold text-blue-600">{formatPercent(profitMargin)}</p>
        </div>
        <X className="w-8 h-8 text-slate-500" />
         <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Asset Turnover</p>
          <p className="text-2xl font-bold text-blue-600">{formatRatio(assetTurnover)}</p>
        </div>
        <Equal className="w-8 h-8 text-slate-500" />
        <div className="p-3 bg-emerald-50 rounded-lg">
          <p className="text-sm font-medium text-emerald-800">ROA</p>
          <p className="text-2xl font-bold text-emerald-600">{formatPercent(roa * 100)}</p>
        </div>
      </div>
    </SimCard>
  );
};

const UnitsOfActivitySim = () => {
  const [cost, setCost] = useState(80000);
  const [salvage, setSalvage] = useState(5000);
  const [totalUnits, setTotalUnits] = useState(100000);
  const [unitsThisYear, setUnitsThisYear] = useState(16000);

  const depreciableCost = cost - salvage;
  const ratePerUnit = totalUnits > 0 ? depreciableCost / totalUnits : 0;
  const depreciationExpense = ratePerUnit * unitsThisYear;

  return (
    <SimCard title="Units-of-Activity Depreciation" icon={Activity}>
      <SimSlider label="Asset Cost" value={cost} min={10000} max={200000} step={1000} onChange={setCost} format={formatCurrencyInt} />
      <SimSlider label="Salvage Value" value={salvage} min={0} max={cost * 0.5} step={500} onChange={setSalvage} format={formatCurrencyInt} />
      <SimSlider label="Total Estimated Units" value={totalUnits} min={10000} max={500000} step={10000} onChange={setTotalUnits} format={formatUnits} />
      <SimSlider label="Units Produced This Year" value={unitsThisYear} min={0} max={totalUnits * 0.5} step={1000} onChange={setUnitsThisYear} format={formatUnits} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-800">Depreciation Rate</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(ratePerUnit)} <span className="text-sm font-normal">/ unit</span></p>
          <p className="text-xs text-blue-500">({formatCurrencyInt(cost)} - {formatCurrencyInt(salvage)}) / {formatUnits(totalUnits)}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg text-center">
          <p className="text-sm font-medium text-emerald-800">Depreciation Expense</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(depreciationExpense)}</p>
          <p className="text-xs text-emerald-500">{formatCurrency(ratePerUnit)} x {formatUnits(unitsThisYear)}</p>
        </div>
      </div>
    </SimCard>
  );
};

const PayrollSim = () => {
  const [salary, setSalary] = useState(100000);
  const [incomeTax, setIncomeTax] = useState(15); // 15%
  const [ficaEmployee] = useState(7.65); // 7.65%
  const [ficaEmployer] = useState(7.65); // 7.65%
  const [unemployment, setUnemployment] = useState(2); // 2%

  const incomeTaxWithheld = salary * (incomeTax / 100);
  const ficaEmployeeWithheld = salary * (ficaEmployee / 100);
  const takeHomePay = salary - incomeTaxWithheld - ficaEmployeeWithheld;
  
  const ficaEmployerExpense = salary * (ficaEmployer / 100);
  const unemploymentExpense = salary * (unemployment / 100);
  const totalPayrollTaxExpense = ficaEmployerExpense + unemploymentExpense;
  const totalCost = salary + totalPayrollTaxExpense;

  const employeeJournal = [
    { account: 'Salaries Expense', debit: salary, credit: null },
    { account: 'Income Tax Payable', debit: null, credit: incomeTaxWithheld },
    { account: 'FICA Tax Payable', debit: null, credit: ficaEmployeeWithheld },
    { account: 'Salaries Payable', debit: null, credit: takeHomePay },
  ];
  
  const employerJournal = [
    { account: 'Payroll Tax Expense', debit: totalPayrollTaxExpense, credit: null },
    { account: 'FICA Tax Payable', debit: null, credit: ficaEmployerExpense },
    { account: 'Unemployment Tax Payable', debit: null, credit: unemploymentExpense },
  ];

  return (
    <SimCard title="Employee vs. Employer Payroll" icon={Users}>
      <SimSlider label="Gross Salaries Expense" value={salary} min={50000} max={1000000} step={10000} onChange={setSalary} format={formatCurrencyInt} />
      <SimSlider label="Income Tax Withholding" value={incomeTax} min={10} max={35} step={1} onChange={setIncomeTax} format={formatPercentInt} />
      <SimSlider label="Unemployment Tax Rate" value={unemployment} min={1} max={6} step={0.5} onChange={setUnemployment} format={formatPercent} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-emerald-50 rounded-lg text-center">
          <p className="text-sm font-medium text-emerald-800">Employee Take-Home Pay</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(takeHomePay)}</p>
          <p className="text-xs text-emerald-500">Gross - Withholdings</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg text-center">
          <p className="text-sm font-medium text-red-800">Total Employer Cost</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-red-500">Gross + Employer Taxes</p>
        </div>
      </div>
      <JournalEntry title="Employee-Side Journal Entry" entries={employeeJournal} />
      <JournalEntry title="Employer-Side Journal Entry" entries={employerJournal} />
    </SimCard>
  );
};

const WarrantySim = () => {
  const [sales, setSales] = useState(500000);
  const [warrantyRate, setWarrantyRate] = useState(3); // 3%
  
  const warrantyExpense = sales * (warrantyRate / 100);

  const journalEntries = [
    { account: 'Warranty Expense', debit: warrantyExpense, credit: null },
    { account: 'Warranty Liability', debit: null, credit: warrantyExpense },
  ];

  return (
    <SimCard title="Estimated Warranty Liability" icon={Shield}>
      <SimSlider label="Total Sales Revenue" value={sales} min={100000} max={2000000} step={10000} onChange={setSales} format={formatCurrencyInt} />
      <SimSlider label="Estimated Warranty Rate" value={warrantyRate} min={1} max={10} step={0.5} onChange={setWarrantyRate} format={formatPercent} />
      
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm font-medium text-blue-800">Estimated Warranty Expense</p>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(warrantyExpense)}</p>
        <p className="text-xs text-blue-500 font-mono">
          {formatCurrencyInt(sales)} x {formatPercent(warrantyRate)}
        </p>
      </div>
      <JournalEntry title="Warranty Accrual Journal Entry" entries={journalEntries} />
    </SimCard>
  );
};

const SolvencySim = () => {
  const [totalLiab, setTotalLiab] = useState(150000);
  const [totalEquity, setTotalEquity] = useState(100000);
  const [ebit, setEbit] = useState(40000); // Earnings Before Interest & Tax
  const [interest, setInterest] = useState(10000);

  const debtToEquity = totalEquity > 0 ? totalLiab / totalEquity : 0;
  const timesInterestEarned = interest > 0 ? ebit / interest : 0;

  return (
    <SimCard title="Solvency Ratios" icon={BookMarked}>
      <SimSlider label="Total Liabilities" value={totalLiab} min={50000} max={500000} step={5000} onChange={setTotalLiab} format={formatCurrencyInt} />
      <SimSlider label="Total Stockholders' Equity" value={totalEquity} min={50000} max={500000} step={5000} onChange={setTotalEquity} format={formatCurrencyInt} />
      <SimSlider label="EBIT" value={ebit} min={10000} max={100000} step={1000} onChange={setEbit} format={formatCurrencyInt} />
      <SimSlider label="Interest Expense" value={interest} min={5000} max={ebit} step={500} onChange={setInterest} format={formatCurrencyInt} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-sm font-medium text-slate-700">Debt-to-Equity Ratio</p>
          <p className={`text-xl font-bold ${debtToEquity <= 1.5 ? 'text-emerald-600' : 'text-red-600'}`}>{formatRatio(debtToEquity)}</p>
          <p className="text-xs text-slate-500">(Lower is generally safer)</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-sm font-medium text-slate-700">Times Interest Earned</p>
          <p className={`text-xl font-bold ${timesInterestEarned >= 3 ? 'text-emerald-600' : 'text-red-600'}`}>{formatRatio(timesInterestEarned)}</p>
          <p className="text-xs text-slate-500">(Higher is safer)</p>
        </div>
      </div>
    </SimCard>
  );
};

const InstallmentNoteSim = () => {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(6); // 6% annual
  const [payment, setPayment] = useState(11000); // 11,000

  const interestExpense = principal * (rate / 100); // Assuming annual payment
  const principalReduction = payment - interestExpense;
  const newPrincipal = principal - principalReduction;

  const journalEntries = [
    { account: 'Interest Expense', debit: interestExpense, credit: null },
    { account: 'Notes Payable', debit: principalReduction, credit: null },
    { account: 'Cash', debit: null, credit: payment },
  ];

  return (
    <SimCard title="Installment Note Payment" icon={PieChart}>
      <SimSlider label="Beginning Principal" value={principal} min={10000} max={100000} step={1000} onChange={setPrincipal} format={formatCurrencyInt} />
      <SimSlider label="Annual Interest Rate" value={rate} min={1} max={12} step={0.5} onChange={setRate} format={formatPercent} />
      <SimSlider label="Annual Payment" value={payment} min={interestExpense > 0 ? interestExpense + 1 : 1} max={principal * 0.5} step={500} onChange={setPayment} format={formatCurrencyInt} />

      <div className="p-3 bg-slate-100 rounded-lg text-center">
        <p className="text-sm font-medium text-slate-700">Total Payment</p>
        <p className="text-2xl font-bold text-slate-900">{formatCurrencyInt(payment)}</p>
      </div>
      
      <div className="flex items-center justify-center space-x-4 pt-2 text-center">
        <ArrowRight className="w-8 h-8 text-slate-400" />
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm font-medium text-red-800">Interest Expense</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(interestExpense)}</p>
        </div>
        <Plus className="w-6 h-6 text-slate-500" />
         <div className="p-3 bg-emerald-50 rounded-lg">
          <p className="text-sm font-medium text-emerald-800">Principal Reduction</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(principalReduction)}</p>
        </div>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg text-center mt-4">
        <p className="text-sm font-medium text-blue-800">Ending Principal Balance</p>
        <p className="text-xl font-bold text-blue-600">{formatCurrency(newPrincipal)}</p>
      </div>
      <JournalEntry title="Payment Journal Entry" entries={journalEntries} />
    </SimCard>
  );
};

// --- Problem Generator ---

const ProblemCard: FC<ProblemCardProps> = ({ title, children, onNewProblem }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
      <button
        onClick={onNewProblem}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        New Problem
      </button>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const JournalEntryInput: FC<JournalEntryInputProps> = ({ entry, userAnswers, onAnswerChange, isChecked }) => {
  const debitValue = userAnswers[entry.account]?.debit || "";
  const creditValue = userAnswers[entry.account]?.credit || "";
  
  // Handle floating point comparisons
  const checkValue = (userVal: string, solutionVal: number | null) => {
    const user = parseFloat(userVal || '0');
    const solution = solutionVal || 0;
    if (solution === 0 && (userVal === "" || user === 0)) return true;
    if (solutionVal === null && userVal === "") return true;
    
    // Handle potential floating point inaccuracies
    return Math.abs(user - solution) < 0.01;
  };

  const isDebitCorrect = isChecked && checkValue(debitValue, entry.debit);
  const isDebitWrong = isChecked && !isDebitCorrect && (debitValue !== "" || (entry.debit !== null && entry.debit !== 0));
  
  const isCreditCorrect = isChecked && checkValue(creditValue, entry.credit);
  const isCreditWrong = isChecked && !isCreditCorrect && (creditValue !== "" || (entry.credit !== null && entry.credit !== 0));

  const getStatus = (isCorrect: boolean, isWrong: boolean) => {
    if (!isChecked) return 'default';
    if (isCorrect) return 'correct';
    if (isWrong) return 'incorrect';
    return 'default';
  };

  const getBorder = (status: string) => {
    switch(status) {
      case 'correct': return 'border-emerald-300 bg-emerald-50 text-emerald-800';
      case 'incorrect': return 'border-red-300 bg-red-50 text-red-800';
      default: return 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-blue-500';
    }
  };

  const debitStatus = getStatus(isDebitCorrect, isDebitWrong);
  const creditStatus = getStatus(isCreditCorrect, isCreditWrong);

  return (
    <tr>
      <td className={`px-3 py-2 ${entry.credit ? 'pl-8 text-slate-600' : 'text-slate-800'}`}>
        {entry.account}
      </td>
      <td className="px-1 py-1 text-right">
        <input
          type="number"
          step="any"
          value={debitValue}
          onChange={(e) => onAnswerChange(entry.account, 'debit', e.target.value)}
          className={`w-32 sm:w-40 px-3 py-2 text-right font-mono rounded-md border ${getBorder(debitStatus)}`}
          placeholder={entry.debit === null ? "—" : "0.00"}
          disabled={entry.debit === null}
        />
      </td>
      <td className="px-1 py-1 text-right">
        <input
          type="number"
          step="any"
          value={creditValue}
          onChange={(e) => onAnswerChange(entry.account, 'credit', e.target.value)}
          className={`w-32 sm:w-40 px-3 py-2 text-right font-mono rounded-md border ${getBorder(creditStatus)}`}
          placeholder={entry.credit === null ? "—" : "0.00"}
          disabled={entry.credit === null}
        />
      </td>
    </tr>
  );
};

const SolutionBox: FC<SolutionBoxProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">Show Me Why (Solution)</h4>
      <div className="space-y-2 text-sm text-blue-700">
        {children}
      </div>
    </div>
  );
};

// --- Problem 1: Depreciation ---

const ProblemDepreciation = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswers, setUserAnswers] = useState<{[key: string]: { debit?: string; credit?: string }}>({});
  const [isChecked, setIsChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function generateProblem() {
    const cost = Math.floor(Math.random() * 70 + 30) * 1000; // 30k - 100k
    const salvage = Math.floor(Math.random() * (cost * 0.1) + (cost * 0.05)) * 100; // 5-15% of cost
    const life = Math.floor(Math.random() * 3 + 3); // 3-5 years

    const depreciableCost = cost - salvage;
    const slExpense = depreciableCost / life;
    
    return { 
      cost, salvage, life,
      solution: {
        slExpense: parseFloat(slExpense.toFixed(2)),
      }
    };
  }

  const handleCheck = () => {
    setIsChecked(true);
    setShowSolution(true);
  };
  
  const handleNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswers({});
    setIsChecked(false);
    setShowSolution(false);
  };
  
  const handleAnswerChange = (account: string, type: 'debit' | 'credit', value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [account]: { ...prev[account], [type]: value }
    }));
  };

  const solutionEntries = [
    { account: 'Depreciation Expense', debit: problem.solution.slExpense, credit: null },
    { account: 'Accumulated Depreciation', debit: null, credit: problem.solution.slExpense },
  ];

  return (
    <ProblemCard title="Problem 1: Depreciation" onNewProblem={handleNewProblem}>
      <p className="text-slate-700">
        An asset is purchased for <strong>{formatCurrencyInt(problem.cost)}</strong>. It has a <strong>{formatCurrencyInt(problem.salvage)}</strong> salvage value
        and a <strong>{problem.life}-year</strong> useful life.
      </p>
      
      <div className="space-y-4 pt-2">
        <div>
          <h4 className="font-semibold text-slate-800">Straight-Line Depreciation</h4>
          <p className="text-sm text-slate-600 mb-2">Record the journal entry for one year of straight-line depreciation.</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-medium text-slate-600">Account</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Debit</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Credit</th>
              </tr>
            </thead>
            <tbody>
              {solutionEntries.map((entry, idx) => (
                <JournalEntryInput
                  key={idx}
                  entry={entry}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        onClick={handleCheck}
        className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all"
      >
        Check My Answers
      </button>

      <SolutionBox isOpen={showSolution}>
        <h5 className="font-semibold">Straight-Line Calculation:</h5>
        <p className="font-mono">({formatCurrencyInt(problem.cost)} - {formatCurrencyInt(problem.salvage)}) / {problem.life} years = <strong>{formatCurrency(problem.solution.slExpense)}</strong></p>
        <JournalEntry 
          title="Correct SL Journal Entry" 
          entries={solutionEntries}
        />
      </SolutionBox>
    </ProblemCard>
  );
};


// --- Problem 2: Asset Sale ---

const ProblemAssetSale = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswers, setUserAnswers] = useState<{[key: string]: { debit?: string; credit?: string }}>({});
  const [isChecked, setIsChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function generateProblem() {
    const cost = Math.floor(Math.random() * 50 + 50) * 1000; // 50k - 100k
    const accumDep = Math.floor(Math.random() * (cost * 0.6) + (cost * 0.2)); // 20-80% of cost
    const bookValue = cost - accumDep;
    const salePrice = Math.floor(Math.random() * (bookValue * 0.8) + (bookValue * 0.6)); // 60-140% of BV
    const gainLoss = salePrice - bookValue;
    
    return { 
      cost, accumDep, salePrice, bookValue,
      solution: {
        cash: salePrice,
        accumDep: accumDep,
        cost: cost,
        gain: gainLoss > 0 ? parseFloat(gainLoss.toFixed(2)) : null,
        loss: gainLoss < 0 ? parseFloat(Math.abs(gainLoss).toFixed(2)) : null,
      }
    };
  }

  const handleCheck = () => {
    setIsChecked(true);
    setShowSolution(true);
  };

  const handleNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswers({});
    setIsChecked(false);
    setShowSolution(false);
  };

  const handleAnswerChange = (account: string, type: 'debit' | 'credit', value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [account]: { ...prev[account], [type]: value }
    }));
  };
  
  const solutionEntriesForDisplay: JournalEntryItem[] = [
    { account: 'Cash', debit: problem.solution.cash, credit: null },
    { account: 'Accumulated Depreciation', debit: problem.solution.accumDep, credit: null },
    ...(problem.solution.loss ? [{ account: 'Loss on Sale', debit: problem.solution.loss, credit: null }] : []),
    { account: 'Equipment', debit: null, credit: problem.solution.cost },
    ...(problem.solution.gain ? [{ account: 'Gain on Sale', debit: null, credit: problem.solution.gain }] : []),
  ];

  const inputEntries: JournalEntryItem[] = [
    { account: 'Cash', debit: problem.solution.cash, credit: null },
    { account: 'Accumulated Depreciation', debit: problem.solution.accumDep, credit: null },
    { account: 'Loss on Sale', debit: problem.solution.loss, credit: null }, // Will be null if no loss
    { account: 'Equipment', debit: null, credit: problem.solution.cost },
    { account: 'Gain on Sale', debit: null, credit: problem.solution.gain }, // Will be null if no gain
  ];

  return (
    <ProblemCard title="Problem 2: Asset Sale" onNewProblem={handleNewProblem}>
      <p className="text-slate-700">
        An asset with an original cost of <strong>{formatCurrencyInt(problem.cost)}</strong> and accumulated depreciation of <strong>{formatCurrencyInt(problem.accumDep)}</strong> is
        sold for <strong>{formatCurrencyInt(problem.salePrice)}</strong> cash.
      </p>
      
      <div className="space-y-4 pt-2">
        <h4 className="font-semibold text-slate-800">Record the Sale:</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-3 py-2 text-left font-medium text-slate-600">Account</th>
              <th className="px-3 py-2 text-right font-medium text-slate-600">Debit</th>
              <th className="px-3 py-2 text-right font-medium text-slate-600">Credit</th>
            </tr>
          </thead>
          <tbody>
            {inputEntries.map((entry, idx) => (
              <JournalEntryInput
                key={idx}
                entry={entry}
                userAnswers={userAnswers} 
                onAnswerChange={handleAnswerChange} 
                isChecked={isChecked}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={handleCheck}
        className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all"
      >
        Check My Answers
      </button>

      <SolutionBox isOpen={showSolution}>
        <p className="font-mono">1. Book Value = {formatCurrencyInt(problem.cost)} - {formatCurrencyInt(problem.accumDep)} = <strong>{formatCurrencyInt(problem.bookValue)}</strong></p>
        <p className="font-mono">2. Gain/Loss = {formatCurrencyInt(problem.salePrice)} - {formatCurrencyInt(problem.bookValue)} = <strong>{formatCurrency(problem.solution.gain !== null ? problem.solution.gain : (problem.solution.loss !== null ? -problem.solution.loss : 0))} {problem.solution.gain ? 'Gain' : 'Loss'}</strong></p>
        <JournalEntry title="Correct Journal Entry" entries={solutionEntriesForDisplay} />
      </SolutionBox>
    </ProblemCard>
  );
};


// --- Problem 3: Note Payable ---

const ProblemNotePayable = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswers, setUserAnswers] = useState<{[key: string]: {[key: string]: { debit?: string; credit?: string }}} >({});
  const [isChecked, setIsChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function generateProblem() {
    const principal = (Math.floor(Math.random() * 10) + 5) * 10000; // 50k - 150k
    const rate = Math.floor(Math.random() * 5 + 4); // 4% - 8%
    const monthsAccrued = 4; // Sept 1 -> Dec 31
    const monthsToMaturity = 6;
    
    const accruedInterest = parseFloat((principal * (rate / 100) * (monthsAccrued / 12)).toFixed(2));
    const maturityInterest = parseFloat((principal * (rate / 100) * (monthsToMaturity / 12)).toFixed(2));
    const interestAtMaturity = parseFloat((maturityInterest - accruedInterest).toFixed(2));
    
    return { 
      principal, rate, monthsAccrued, monthsToMaturity,
      solution: {
        issuance: { cash: principal, note: principal },
        accrual: { expense: accruedInterest, payable: accruedInterest },
        maturity: {
          note: principal,
          payable: accruedInterest,
          expense: interestAtMaturity,
          cash: parseFloat((principal + maturityInterest).toFixed(2))
        }
      }
    };
  }
  
  const handleCheck = () => {
    setIsChecked(true);
    setShowSolution(true);
  };

  const handleNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswers({});
    setIsChecked(false);
    setShowSolution(false);
  };

  const handleAnswerChange = (account: string, type: 'debit' | 'credit', value: string, entryKey: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [entryKey]: {
        ...prev[entryKey],
        [account]: {
          ...prev[entryKey]?.[account],
          [type]: value
        }
      }
    }));
  };
  
  const sol = problem.solution;
  const inputEntries = {
    issuance: [
      { account: 'Cash', debit: sol.issuance.cash, credit: null },
      { account: 'Notes Payable', debit: null, credit: sol.issuance.note },
    ],
    accrual: [
      { account: 'Interest Expense', debit: sol.accrual.expense, credit: null },
      { account: 'Interest Payable', debit: null, credit: sol.accrual.payable },
    ],
    maturity: [
      { account: 'Notes Payable', debit: sol.maturity.note, credit: null },
      { account: 'Interest Payable', debit: sol.maturity.payable, credit: null },
      { account: 'Interest Expense', debit: sol.maturity.expense, credit: null },
      { account: 'Cash', debit: null, credit: sol.maturity.cash },
    ]
  };

  return (
    <ProblemCard title="Problem 3: Note Payable" onNewProblem={handleNewProblem}>
      <p className="text-slate-700">
        On Sept. 1, borrow <strong>{formatCurrencyInt(problem.principal)}</strong> cash by signing a <strong>{problem.monthsToMaturity}-month</strong>, <strong>{problem.rate}%</strong> note payable.
        Interest is payable at maturity. Your company's year-end is Dec. 31.
      </p>
      
      <div className="space-y-4 pt-2">
        {/* --- 1. Issuance --- */}
        <div>
          <h4 className="font-semibold text-slate-800">1. Record the Issuance (Sept. 1)</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.issuance.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.issuance || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'issuance')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* --- 2. Accrual --- */}
        <div>
          <h4 className="font-semibold text-slate-800">2. Record Adjusting Entry (Dec. 31)</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.accrual.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.accrual || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'accrual')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* --- 3. Maturity --- */}
        <div>
          <h4 className="font-semibold text-slate-800">3. Record Payment at Maturity (Mar. 1)</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.maturity.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.maturity || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'maturity')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        onClick={handleCheck}
        className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all"
      >
        Check My Answers
      </button>

      <SolutionBox isOpen={showSolution}>
        <JournalEntry 
          title="1. Issuance (Sept. 1)" 
          entries={inputEntries.issuance}
        />
        <p className="font-mono">2. Accrual (Dec. 31) = {formatCurrencyInt(problem.principal)} x {problem.rate}% x ({problem.monthsAccrued}/12) = <strong>{formatCurrency(problem.solution.accrual.expense)}</strong></p>
        <JournalEntry 
          title="2. Adjusting Entry (Dec. 31)" 
          entries={inputEntries.accrual}
        />
        <p className="font-mono">3. Maturity Interest = ({formatCurrencyInt(problem.principal)} x {problem.rate}% x (2/12)) = <strong>{formatCurrency(problem.solution.maturity.expense)}</strong></p>
        <JournalEntry 
          title="3. Payment (Mar. 1)" 
          entries={inputEntries.maturity}
        />
      </SolutionBox>
    </ProblemCard>
  );
};


// --- Problem 4: Payroll ---

const ProblemPayroll = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswers, setUserAnswers] = useState<{[key: string]: {[key: string]: { debit?: string; credit?: string }}} >({});
  const [isChecked, setIsChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function generateProblem() {
    const salaries = Math.floor(Math.random() * 50 + 50) * 10000; // 500k - 1M
    const incomeTax = parseFloat((salaries * (Math.floor(Math.random() * 10 + 15) / 100)).toFixed(2)); // 15-25%
    const ficaRate = 7.65 / 100;
    const unemployRate = (Math.floor(Math.random() * 30 + 20) / 10) / 100; // 2-5%
    
    const fica = parseFloat((salaries * ficaRate).toFixed(2));
    const unemployment = parseFloat((salaries * unemployRate).toFixed(2));
    const salariesPayable = parseFloat((salaries - incomeTax - fica).toFixed(2));
    
    return { 
      salaries,
      solution: {
        employee: {
          salaries, incomeTax, fica, salariesPayable
        },
        employer: {
          payrollTax: parseFloat((fica + unemployment).toFixed(2)),
          fica, unemployment
        }
      }
    };
  }

  const handleCheck = () => {
    setIsChecked(true);
    setShowSolution(true);
  };

  const handleNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswers({});
    setIsChecked(false);
    setShowSolution(false);
  };

  const handleAnswerChange = (account: string, type: 'debit' | 'credit', value: string, entryKey: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [entryKey]: {
        ...prev[entryKey],
        [account]: {
          ...prev[entryKey]?.[account],
          [type]: value
        }
      }
    }));
  };
  
  const sol = problem.solution;
  const inputEntries = {
    employee: [
      { account: 'Salaries Expense', debit: sol.employee.salaries, credit: null },
      { account: 'Income Tax Payable', debit: null, credit: sol.employee.incomeTax },
      { account: 'FICA Tax Payable', debit: null, credit: sol.employee.fica },
      { account: 'Salaries Payable', debit: null, credit: sol.employee.salariesPayable },
    ],
    employer: [
      { account: 'Payroll Tax Expense', debit: sol.employer.payrollTax, credit: null },
      { account: 'FICA Tax Payable (ER)', debit: null, credit: sol.employer.fica },
      { account: 'Unemployment Tax Payable', debit: null, credit: sol.employer.unemployment },
    ]
  };

  return (
    <ProblemCard title="Problem 4: Payroll" onNewProblem={handleNewProblem}>
      <p className="text-slate-700">
        Total employee salaries are <strong>{formatCurrencyInt(problem.salaries)}</strong>.
        Withholdings are <strong>{formatCurrency(problem.solution.employee.incomeTax)}</strong> for income tax.
        FICA is 7.65% (both sides). Unemployment tax is <strong>{formatCurrency(problem.solution.employer.unemployment)}</strong>.
      </p>
      
      <div className="space-y-4 pt-2">
        {/* --- 1. Employee Side --- */}
        <div>
          <h4 className="font-semibold text-slate-800">1. Record Employee Salary Expense & Withholdings</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.employee.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.employee || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'employee')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* --- 2. Employer Side --- */}
        <div>
          <h4 className="font-semibold text-slate-800">2. Record Employer Payroll Taxes</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.employer.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.employer || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'employer')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        onClick={handleCheck}
        className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all"
      >
        Check My Answers
      </button>

      <SolutionBox isOpen={showSolution}>
        <p className="font-mono">1. Employee FICA = {formatCurrencyInt(problem.salaries)} x 7.65% = <strong>{formatCurrency(problem.solution.employee.fica)}</strong></p>
        <p className="font-mono">2. Salaries Payable = {formatCurrencyInt(problem.salaries)} - {formatCurrency(problem.solution.employee.incomeTax)} - {formatCurrency(problem.solution.employee.fica)} = <strong>{formatCurrency(problem.solution.employee.salariesPayable)}</strong></p>
        <JournalEntry 
          title="1. Employee Entry" 
          entries={inputEntries.employee}
        />
        <p className="font-mono">3. Employer FICA = <strong>{formatCurrency(problem.solution.employer.fica)}</strong></p>
        <p className="font-mono">4. Employer Tax Expense = {formatCurrency(problem.solution.employer.fica)} (FICA) + {formatCurrency(problem.solution.employer.unemployment)} (Unemp) = <strong>{formatCurrency(problem.solution.employer.payrollTax)}</strong></p>
        <JournalEntry 
          title="2. Employer Entry" 
          entries={inputEntries.employer}
        />
      </SolutionBox>
    </ProblemCard>
  );
};


// --- Problem 5: Bonds ---

const ProblemBond = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswers, setUserAnswers] = useState<{[key: string]: {[key: string]: { debit?: string; credit?: string }}} >({});
  const [isChecked, setIsChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function generateProblem() {
    const faceValue = 100000;
    const statedRate = (Math.floor(Math.random() * 3 + 4) * 2); // 8, 10, 12 %
    const marketRate = statedRate - 2; // e.g., 8% stated, 6% market (Premium)
    const issuePrice = Math.floor(Math.random() * 5000 + 102000); // 102k - 107k
    
    const cashPaid = parseFloat((faceValue * (statedRate / 100 / 2)).toFixed(2));
    const interestExpense = parseFloat((issuePrice * (marketRate / 100 / 2)).toFixed(2));
    const premiumAmortization = parseFloat((cashPaid - interestExpense).toFixed(2));

    return { 
      faceValue, statedRate, marketRate, issuePrice,
      solution: {
        issuance: {
          cash: issuePrice,
          premium: issuePrice - faceValue,
          bond: faceValue
        },
        interest: {
          expense: interestExpense,
          premium: premiumAmortization,
          cash: cashPaid
        }
      }
    };
  }
  
  const handleCheck = () => {
    setIsChecked(true);
    setShowSolution(true);
  };

  const handleNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswers({});
    setIsChecked(false);
    setShowSolution(false);
  };

  const handleAnswerChange = (account: string, type: 'debit' | 'credit', value: string, entryKey: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [entryKey]: {
        ...prev[entryKey],
        [account]: {
          ...prev[entryKey]?.[account],
          [type]: value
        }
      }
    }));
  };
  
  const sol = problem.solution;
  const inputEntries = {
    issuance: [
      { account: 'Cash', debit: sol.issuance.cash, credit: null },
      { account: 'Premium on Bonds Payable', debit: null, credit: sol.issuance.premium },
      { account: 'Bonds Payable', debit: null, credit: sol.issuance.bond },
    ],
    interest: [
      { account: 'Interest Expense', debit: sol.interest.expense, credit: null },
      { account: 'Premium on Bonds Payable', debit: sol.interest.premium, credit: null },
      { account: 'Cash', debit: null, credit: sol.interest.cash },
    ]
  };

  return (
    <ProblemCard title="Problem 5: Bonds (Premium)" onNewProblem={handleNewProblem}>
      <p className="text-slate-700">
        Issue a <strong>{formatCurrencyInt(problem.faceValue)}</strong>, <strong>{problem.statedRate}%</strong> bond for <strong>{formatCurrencyInt(problem.issuePrice)}</strong> cash.
        The market rate is <strong>{problem.marketRate}%</strong>. The bond pays semiannually.
      </p>
      
      <div className="space-y-4 pt-2">
        {/* --- 1. Issuance --- */}
        <div>
          <h4 className="font-semibold text-slate-800">1. Record the Bond Issuance</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.issuance.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.issuance || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'issuance')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* --- 2. Interest Payment --- */}
        <div>
          <h4 className="font-semibold text-slate-800">2. Record the First Semiannual Interest Payment</h4>
          <table className="w-full text-sm">
            <tbody>
              {inputEntries.interest.map((entry, idx) => (
                <JournalEntryInput
                  key={idx} entry={entry}
                  userAnswers={userAnswers.interest || {}} onAnswerChange={(a,t,v) => handleAnswerChange(a,t,v, 'interest')} isChecked={isChecked}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        onClick={handleCheck}
        className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all"
      >
        Check My Answers
      </button>

      <SolutionBox isOpen={showSolution}>
        <JournalEntry 
          title="1. Issuance" 
          entries={inputEntries.issuance}
        />
        <p className="font-mono">1. Cash Paid = {formatCurrencyInt(problem.faceValue)} x {problem.statedRate}% x (6/12) = <strong>{formatCurrency(problem.solution.interest.cash)}</strong></p>
        <p className="font-mono">2. Interest Expense = {formatCurrencyInt(problem.issuePrice)} x {problem.marketRate}% x (6/12) = <strong>{formatCurrency(problem.solution.interest.expense)}</strong></p>
        <p className="font-mono">3. Premium Amortization = {formatCurrency(problem.solution.interest.cash)} - {formatCurrency(problem.solution.interest.expense)} = <strong>{formatCurrency(problem.solution.interest.premium)}</strong></p>
        <JournalEntry 
          title="2. Interest Payment" 
          entries={inputEntries.interest}
        />
      </SolutionBox>
    </ProblemCard>
  );
};


// --- Quick Reference Tab ---

const FormulaCard: FC<FormulaCardProps> = ({ title, formula, components }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-100 flex flex-col">
    <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
    <div className="p-4 bg-blue-50 rounded-lg text-center mb-3">
      <p className="text-xl font-bold text-blue-700 font-mono">{formula}</p>
    </div>
    <div className="space-y-1">
      {components.map((comp, idx) => (
        <p key={idx} className="text-sm text-slate-600"><span className="font-semibold text-slate-800">{comp.name}:</span> {comp.desc}</p>
      ))}
    </div>
  </div>
);

const QuickReferenceTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Chapter 7 Formulas */}
    <FormulaCard 
      title="Straight-Line Depreciation"
      formula="(Cost - Salvage) / Life"
      components={[
        { name: "Cost", desc: "Original purchase price + all costs to get it ready." },
        { name: "Salvage", desc: "Estimated value at the end of its useful life." },
        { name: "Life", desc: "Estimated useful service life (in years)." }
      ]}
    />
    <FormulaCard 
      title="Double-Declining-Balance"
      formula="Book Value * (2 / Life)"
      components={[
        { name: "Book Value", desc: "Cost - Accumulated Depreciation. Use beginning-of-year BV." },
        { name: "Rate", desc: "Double the straight-line rate (e.g., 5-year life = 1/5 = 20%. DDB rate = 40%)." }
      ]}
    />
    <FormulaCard 
      title="Units-of-Activity Rate"
      formula="(Cost - Salvage) / Total Units"
      components={[
        { name: "Rate", desc: "This gives you a $ per unit (or hour, or mile) rate." },
        { name: "Expense", desc: "Multiply this rate by the *actual* units produced this period." }
      ]}
    />
    <FormulaCard 
      title="Gain/Loss on Sale"
      formula="Sale Price - Book Value"
      components={[
        { name: "Book Value", desc: "Cost - Accumulated Depreciation *at the time of sale*." },
        { name: "Result", desc: "If positive, it's a Gain (Credit). If negative, it's a Loss (Debit)." }
      ]}
    />
    <FormulaCard 
      title="Return on Assets (ROA)"
      formula="Profit Margin * Asset Turnover"
      components={[
        { name: "Profit Margin", desc: "Net Income / Net Sales (Measures profitability)." },
        { name: "Asset Turnover", desc: "Net Sales / Avg. Total Assets (Measures efficiency)." }
      ]}
    />
    
    {/* Chapter 8 Formulas */}
    <FormulaCard 
      title="Simple Interest"
      formula="Principal * Rate * Time"
      components={[
        { name: "Principal", desc: "The amount borrowed or loaned." },
        { name: "Rate", desc: "The *annual* interest rate (e.g., 6% = 0.06)." },
        { name: "Time", desc: "The fraction of the year the interest covers (e.g., 3 months = 3/12)." }
      ]}
    />
    <FormulaCard 
      title="Current Ratio"
      formula="Current Assets / Current Liabilities"
      components={[
        { name: "Measures", desc: "Short-term liquidity. Can you pay your bills?" },
        { name: "Good?", desc: "Higher is generally better. 2.0 is strong, < 1.0 is a concern." }
      ]}
    />
    <FormulaCard 
      title="Acid-Test (Quick) Ratio"
      formula="Quick Assets / Current Liabilities"
      components={[
        { name: "Quick Assets", desc: "Cash, Short-Term Investments, and Accounts Receivable." },
        { name: "Measures", desc: "A *stricter* test of liquidity. Excludes inventory." }
      ]}
    />
    <FormulaCard 
      title="Working Capital"
      formula="Current Assets - Current Liabilities"
      components={[
        { name: "Measures", desc: "The dollar amount of cushion for meeting short-term obligations." },
        { name: "Result", desc: "A positive number is good." }
      ]}
    />

    {/* Chapter 9 Formulas */}
    <FormulaCard 
      title="Bond Interest Expense (Effective)"
      formula="Book Value * Market Rate"
      components={[
        { name: "Book Value", desc: "The bond's *current* carrying value (changes each period)." },
        { name: "Market Rate", desc: "The interest rate *at the time of issue* (for one period)." }
      ]}
    />
    <FormulaCard 
      title="Bond Cash Payment (Stated)"
      formula="Face Value * Stated Rate"
      components={[
        { name: "Face Value", desc: "The bond's principal amount ($100,000)." },
        { name: "Stated Rate", desc: "The coupon rate printed on the bond (for one period)." }
      ]}
    />
    <FormulaCard 
      title="Bond Amortization"
      formula="Interest Expense - Cash Payment"
      components={[
        { name: "Discount", desc: "Expense > Cash. Amortization (Credit) increases Book Value." },
        { name: "Premium", desc: "Expense < Cash. Amortization (Debit) decreases Book Value." }
      ]}
    />
    <FormulaCard 
      title="Debt-to-Equity Ratio"
      formula="Total Liabilities / Total Equity"
      components={[
        { name: "Measures", desc: "Solvency (long-term risk). How much debt vs. equity funds the company?" },
        { name: "Result", desc: "Lower is generally safer." }
      ]}
    />
    <FormulaCard 
      title="Times Interest Earned"
      formula="EBIT / Interest Expense"
      components={[
        { name: "EBIT", desc: "Earnings Before Interest and Taxes (or Net Income + Int + Tax)." },
        { name: "Measures", desc: "Solvency. How many times can earnings cover the interest bill?" }
      ]}
    />
  </div>
);


// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('guide');
  const [masteredTopics, setMasteredTopics] = useState<string[]>([]);

  const toggleMastered = (topic: string) => {
    setMasteredTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };
  
  const getProgress = () => {
    const totalTopics = studyTopics.reduce((acc, ch) => acc + ch.topics.length, 0);
    if (totalTopics === 0) return 0;
    return (masteredTopics.length / totalTopics) * 100;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'guide':
        return (
          <>
            <div className="mb-6 bg-white p-5 rounded-xl shadow-lg border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Study Progress</h2>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 mt-2 text-center">{masteredTopics.length} of {studyTopics.reduce((acc, ch) => acc + ch.topics.length, 0)} topics mastered ({getProgress().toFixed(0)}%)</p>
            </div>
            {studyTopics.map((chapter) => (
              <div key={chapter.chapter} className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                  Chapter {chapter.chapter}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapter.topics.map((topic, index) => (
                    <ConceptCard 
                      key={index} 
                      topic={topic} 
                      isMastered={masteredTopics.includes(topic)}
                      toggleMastered={toggleMastered}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        );
      case 'sims':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepreciationSim />
            <BondPricingSim />
            <AssetSaleSim />
            <InterestSim />
            <LiquiditySim />
            <BondInterestSim />
            <ROASim />
            <UnitsOfActivitySim />
            <PayrollSim />
            <WarrantySim />
            <SolvencySim />
            <InstallmentNoteSim />
          </div>
        );
      case 'problems':
        return (
          <div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <p className="text-yellow-800 font-medium">All problems are randomized. Generate new problems to get infinite practice!</p>
            </div>
            <ProblemDepreciation />
            <ProblemAssetSale />
            <ProblemNotePayable />
            <ProblemPayroll />
            <ProblemBond />
          </div>
        );
      case 'reference':
        return <QuickReferenceTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-inter">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
              ACCT 201: Exam 3 Interactive Guide
            </h1>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          
          {/* Mobile Tab Navigation */}
          <div className="sm:hidden pb-4">
            <select 
              onChange={(e) => setActiveTab(e.target.value)} 
              value={activeTab}
              className="w-full p-3 border border-slate-300 rounded-lg bg-white text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="guide">Study Guide</option>
              <option value="reference">Quick Reference</option>
              <option value="sims">Simulations</option>
              <option value="problems">Problem Generator</option>
            </select>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden sm:flex space-x-2">
            <TabButton
              isActive={activeTab === 'guide'}
              onClick={() => setActiveTab('guide')}
              icon={BookOpen}
            >
              Study Guide
            </TabButton>
            <TabButton
              isActive={activeTab === 'reference'}
              onClick={() => setActiveTab('reference')}
              icon={ClipboardList}
            >
              Quick Reference
            </TabButton>
            <TabButton
              isActive={activeTab === 'sims'}
              onClick={() => setActiveTab('sims')}
              icon={PlayCircle}
            >
              Interactive Simulations
            </TabButton>
            <TabButton
              isActive={activeTab === 'problems'}
              onClick={() => setActiveTab('problems')}
              icon={Zap}
            >
              Problem Generator
            </TabButton>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderTabContent()}
      </main>
      
      <footer className="text-center py-6 text-slate-500 text-sm">
        Your interactive study dashboard. Good luck!
      </footer>
    </div>
  );
}
