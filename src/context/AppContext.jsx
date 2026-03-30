import { createContext, useContext, useMemo } from 'react';
import {
  generateBeneficiaries,
  generateFlaggedTransactions,
  generateRiskIndexTrend,
  generateRegionalAnomalies,
  generateAnomalyAlerts,
  getDashboardKPIs,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const beneficiaries = useMemo(() => generateBeneficiaries(600), []);
  const transactions = useMemo(() => generateFlaggedTransactions(beneficiaries, 800), [beneficiaries]);
  const riskTrend = useMemo(() => generateRiskIndexTrend(12), []);
  const regionalAnomalies = useMemo(() => generateRegionalAnomalies(), []);
  const anomalyAlerts = useMemo(() => generateAnomalyAlerts(), []);
  const kpis = useMemo(() => getDashboardKPIs(beneficiaries, transactions), [beneficiaries, transactions]);

  const value = useMemo(
    () => ({
      beneficiaries,
      transactions,
      riskTrend,
      regionalAnomalies,
      anomalyAlerts,
      kpis,
    }),
    [beneficiaries, transactions, riskTrend, regionalAnomalies, anomalyAlerts, kpis]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
