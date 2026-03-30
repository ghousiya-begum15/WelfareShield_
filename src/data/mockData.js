// Welfare Leakage Intelligence Platform - Mock Data
// Simulates government welfare disbursement data for audit dashboards

// Indian states with simplified coordinates for map (center points)
export const INDIA_STATES_GEO = [
  { code: 'MH', name: 'Maharashtra', lat: 19.076, lng: 72.8777, riskIndex: 62, anomalyRate: 5.2, flaggedCount: 340, beneficiaryCount: 12500 },
  { code: 'UP', name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, riskIndex: 78, anomalyRate: 8.1, flaggedCount: 890, beneficiaryCount: 28500 },
  { code: 'WB', name: 'West Bengal', lat: 22.5726, lng: 88.3639, riskIndex: 55, anomalyRate: 4.1, flaggedCount: 210, beneficiaryCount: 15200 },
  { code: 'TN', name: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, riskIndex: 48, anomalyRate: 3.2, flaggedCount: 95, beneficiaryCount: 11800 },
  { code: 'KA', name: 'Karnataka', lat: 12.9716, lng: 77.5946, riskIndex: 52, anomalyRate: 3.8, flaggedCount: 180, beneficiaryCount: 10200 },
  { code: 'GJ', name: 'Gujarat', lat: 23.0225, lng: 72.5714, riskIndex: 45, anomalyRate: 2.9, flaggedCount: 75, beneficiaryCount: 9800 },
  { code: 'RJ', name: 'Rajasthan', lat: 26.9124, lng: 75.7873, riskIndex: 71, anomalyRate: 6.8, flaggedCount: 420, beneficiaryCount: 13200 },
  { code: 'AP', name: 'Andhra Pradesh', lat: 17.385, lng: 78.4867, riskIndex: 58, anomalyRate: 4.5, flaggedCount: 195, beneficiaryCount: 11200 },
  { code: 'MP', name: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, riskIndex: 65, anomalyRate: 5.6, flaggedCount: 310, beneficiaryCount: 14800 },
  { code: 'BH', name: 'Bihar', lat: 25.0961, lng: 85.3131, riskIndex: 82, anomalyRate: 9.2, flaggedCount: 720, beneficiaryCount: 22000 },
  { code: 'KL', name: 'Kerala', lat: 10.8505, lng: 76.2711, riskIndex: 38, anomalyRate: 2.1, flaggedCount: 45, beneficiaryCount: 8900 },
  { code: 'OD', name: 'Odisha', lat: 20.2961, lng: 85.8245, riskIndex: 68, anomalyRate: 6.2, flaggedCount: 270, beneficiaryCount: 10500 },
  { code: 'PB', name: 'Punjab', lat: 31.1471, lng: 75.3412, riskIndex: 54, anomalyRate: 4.0, flaggedCount: 120, beneficiaryCount: 7200 },
  { code: 'HR', name: 'Haryana', lat: 28.7041, lng: 77.1025, riskIndex: 49, anomalyRate: 3.5, flaggedCount: 88, beneficiaryCount: 6500 },
  { code: 'DL', name: 'Delhi', lat: 28.7041, lng: 77.1025, riskIndex: 42, anomalyRate: 2.8, flaggedCount: 65, beneficiaryCount: 4200 },
];

// Risk factors for tagging
export const RISK_FACTOR_TAGS = [
  'Duplicate Bank Account',
  'Multiple IDs',
  'Multiple Scheme Usage',
  'Unusual Age Distribution',
  'High Regional Density',
  'Same Aadhaar Multiple Payments',
  'Elderly Age Skew',
  'Ghost Beneficiary Suspect',
  'Duplicate Entry',
];

// Schemes
export const SCHEMES = ['NSAP Pension', 'PM-Kisan', 'NFSA', 'MGNREGA', 'Ayushman Bharat', 'Ujjwala'];

const firstNames = ['Ramesh', 'Suresh', 'Lakshmi', 'Geeta', 'Vijay', 'Anita', 'Rajesh', 'Kavitha', 'Manoj', 'Priya', 'Sundar', 'Meera', 'Gopal', 'Sunita', 'Arun'];
const lastNames = ['Kumar', 'Singh', 'Sharma', 'Patel', 'Reddy', 'Rao', 'Nair', 'Menon', 'Das', 'Banerjee', 'Ghosh', 'Mukherjee', 'Verma', 'Gupta', 'Joshi'];
const districts = ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Hyderabad', 'Vijayawada', 'Bangalore', 'Mysore'];
const blocks = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];
const villages = ['Village Alpha', 'Village Beta', 'Village Gamma', 'Village Delta', 'Village Epsilon', 'Village Zeta'];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate beneficiaries
export function generateBeneficiaries(count = 600) {
  const beneficiaries = [];
  const usedIds = new Set();
  for (let i = 0; i < count; i++) {
    const id = `BEN${String(100001 + i).padStart(6, '0')}`;
    if (usedIds.has(id)) continue;
    usedIds.add(id);
    const riskScore = randomInt(15, 95);
    const riskFactors = [];
    if (riskScore > 70) riskFactors.push(randomChoice(RISK_FACTOR_TAGS));
    if (riskScore > 80) riskFactors.push(randomChoice(RISK_FACTOR_TAGS));
    if (Math.random() > 0.7) riskFactors.push('Duplicate Bank Account');
    if (Math.random() > 0.8) riskFactors.push('Multiple IDs');

    beneficiaries.push({
      id,
      name: `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
      age: randomInt(25, 85),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      location: {
        state: randomChoice(INDIA_STATES_GEO).name,
        district: randomChoice(districts),
        block: randomChoice(blocks),
        village: randomChoice(villages),
      },
      riskScore,
      riskFactors: [...new Set(riskFactors)].slice(0, 4),
      schemes: [randomChoice(SCHEMES), ...(Math.random() > 0.6 ? [randomChoice(SCHEMES)] : [])],
      bankHash: `B***${randomInt(1000, 9999)}`,
      aadhaarHash: `A***${randomInt(10000, 99999)}`,
      flags: riskScore > 60 ? randomInt(1, 5) : 0,
    });
  }
  return beneficiaries.sort((a, b) => b.riskScore - a.riskScore);
}

// Generate flagged transactions
export function generateFlaggedTransactions(beneficiaries, count = 800) {
  const transactions = [];
  const flagReasons = [
    'Amount exceeds scheme limit',
    'Duplicate payment same month',
    'Bank account shared with multiple beneficiaries',
    'Unusual payment frequency',
    'Location mismatch',
    'Age eligibility concern',
    'Multiple scheme overlap same period',
    'Aadhaar verification pending',
  ];
  const severities = ['low', 'medium', 'high'];

  for (let i = 0; i < count; i++) {
    const beneficiary = beneficiaries[Math.floor(Math.random() * beneficiaries.length)];
    const riskSeverity = randomChoice(severities);
    transactions.push({
      id: `TXN${String(200001 + i).padStart(6, '0')}`,
      date: new Date(2024, randomInt(0, 11), randomInt(1, 28)).toISOString().split('T')[0],
      scheme: randomChoice(SCHEMES),
      amount: randomInt(500, 5000),
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      flagReason: randomChoice(flagReasons),
      riskSeverity,
      location: beneficiary.location,
    });
  }
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Generate risk index trend over time
export function generateRiskIndexTrend(months = 12) {
  const data = [];
  let base = 52;
  for (let m = months; m >= 0; m--) {
    const date = new Date();
    date.setMonth(date.getMonth() - m);
    const trend = (Math.sin(m * 0.3) * 8) + (Math.random() * 6 - 3);
    base = Math.max(25, Math.min(85, base + trend));
    const events = [];
    if (m === 4) events.push('Policy revision - NSAP eligibility');
    if (m === 8) events.push('Audit conducted - UP districts');
    if (m === 2) events.push('Bank verification drive');
    if (m === 10) events.push('Aadhaar linkage campaign');
    data.push({
      month: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      fullDate: date.toISOString().split('T')[0],
      riskIndex: Math.round(base * 10) / 10,
      anomalyRate: Math.round((base * 0.12 + Math.random() * 2) * 10) / 10,
      events: events.length ? events : null,
    });
  }
  return data;
}

// Regional anomalies for dashboard chart
export function generateRegionalAnomalies() {
  return INDIA_STATES_GEO.map((s, i) => ({
    region: s.name,
    anomalyCount: s.flaggedCount,
    riskIndex: s.riskIndex,
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i % 6],
  }));
}

// Anomaly analysis - explainable alerts
export function generateAnomalyAlerts() {
  return [
    { id: 1, entity: 'Village Alpha', type: 'village', district: 'Patna', state: 'Bihar', riskScore: 87, bullets: ['42% beneficiaries share 3 bank accounts', 'Pension count 3× district average', '15 duplicate Aadhaar referrals'], reason: 'Concentrated bank account usage and above-normal pension density suggest verification needed.' },
    { id: 2, entity: 'Block B', type: 'block', district: 'Muzaffarpur', state: 'Bihar', riskScore: 72, bullets: ['28% duplicate ID entries in MGNREGA', 'Elderly age skew: 45% over 70', 'Unusual payment clustering in Oct-Nov'], reason: 'Multiple data quality flags and age distribution anomalies warrant field verification.' },
    { id: 3, entity: 'Gaya District', type: 'district', state: 'Bihar', riskScore: 78, bullets: ['High-risk beneficiary count 2.1× state average', '23% flagged transactions in Q4', 'Ghost beneficiary suspects: 12'], reason: 'District shows elevated risk across multiple indicators. Priority audit recommended.' },
    { id: 4, entity: 'Village Delta', type: 'village', district: 'Lucknow', state: 'Uttar Pradesh', riskScore: 65, bullets: ['Same bank account used by 8 beneficiaries', 'Multiple scheme overlap for 15%', 'Population deviation +35% from block norm'], reason: 'Bank account sharing and scheme overlap require beneficiary verification.' },
    { id: 5, entity: 'Block D', type: 'block', district: 'Kanpur', state: 'Uttar Pradesh', riskScore: 58, bullets: ['19% duplicate entries in NFSA', 'Payment timing anomalies', 'Aadhaar linkage incomplete for 8%'], reason: 'Data quality issues and verification gaps flagged for review.' },
  ];
}

// Dashboard summary KPIs
export function getDashboardKPIs(beneficiaries, transactions) {
  const totalBeneficiaries = beneficiaries.length;
  const highRiskCount = beneficiaries.filter(b => b.riskScore >= 70).length;
  const flaggedCount = transactions.length;
  const anomalyRate = totalBeneficiaries > 0
    ? Math.round((flaggedCount / (totalBeneficiaries * 3)) * 1000) / 10
    : 0;
  const ghostBeneficiaries = beneficiaries.filter(b => b.riskFactors.includes('Ghost Beneficiary Suspect')).length;
  const duplicateEntries = beneficiaries.filter(b => b.riskFactors.includes('Duplicate Entry') || b.riskFactors.includes('Multiple IDs')).length;

  return {
    totalBeneficiaries,
    highRiskBeneficiaries: highRiskCount,
    flaggedTransactions: flaggedCount,
    anomalyRate: Math.min(15, Math.max(2, anomalyRate)),
    ghostBeneficiaries,
    duplicateEntries,
  };
}
