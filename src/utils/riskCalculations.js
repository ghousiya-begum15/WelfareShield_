/**
 * Risk Index Formula (explained in UI):
 * Risk Index = 0.30 × Anomaly Rate (0-100)
 *           + 0.30 × Flagged Transaction Density (normalized)
 *           + 0.20 × High-Risk Beneficiary Proportion
 *           + 0.20 × Population Deviation from Norm
 */

export function computeRiskIndex({ anomalyRate, flaggedDensity, highRiskProportion, populationDeviation }) {
  const normalized = {
    anomalyRate: Math.min(100, anomalyRate),
    flaggedDensity: Math.min(100, (flaggedDensity || 0) * 10),
    highRiskProportion: Math.min(100, (highRiskProportion || 0) * 2),
    populationDeviation: Math.min(100, Math.abs(populationDeviation || 0) * 5),
  };
  return Math.round(
    0.3 * normalized.anomalyRate +
    0.3 * normalized.flaggedDensity +
    0.2 * normalized.highRiskProportion +
    0.2 * normalized.populationDeviation
  );
}

export function getRiskColor(score) {
  if (score < 40) return { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' };
  if (score < 70) return { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' };
  return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' };
}

export function getSeverityColor(severity) {
  const map = {
    low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    medium: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    high: { bg: 'bg-red-500/20', text: 'text-red-400' },
  };
  return map[severity] || map.medium;
}
