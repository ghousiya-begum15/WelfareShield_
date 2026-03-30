import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import RiskZonesMap from './screens/RiskZonesMap';
import RiskIndexTrend from './screens/RiskIndexTrend';
import HighRiskBeneficiaries from './screens/HighRiskBeneficiaries';
import FlaggedTransactions from './screens/FlaggedTransactions';
import AnomalyAnalysis from './screens/AnomalyAnalysis';
import DrillDownProfile from './screens/DrillDownProfile';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="risk-map" element={<RiskZonesMap />} />
              <Route path="risk-trend" element={<RiskIndexTrend />} />
              <Route path="high-risk-beneficiaries" element={<HighRiskBeneficiaries />} />
              <Route path="flagged-transactions" element={<FlaggedTransactions />} />
              <Route path="anomaly-analysis" element={<AnomalyAnalysis />} />
              <Route path="profile/:entityType/:id" element={<DrillDownProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
