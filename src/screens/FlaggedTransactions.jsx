import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSeverityColor } from '../utils/riskCalculations';
import { SCHEMES } from '../data/mockData';

export default function FlaggedTransactions() {
  const navigate = useNavigate();
  const { transactions } = useApp();
  const [filterScheme, setFilterScheme] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filtered = useMemo(() => {
    let list = transactions;
    if (filterScheme !== 'all') list = list.filter((t) => t.scheme === filterScheme);
    if (filterSeverity !== 'all') list = list.filter((t) => t.riskSeverity === filterSeverity);
    if (filterDateFrom) list = list.filter((t) => t.date >= filterDateFrom);
    if (filterDateTo) list = list.filter((t) => t.date <= filterDateTo);
    return list.slice(0, 100);
  }, [transactions, filterScheme, filterSeverity, filterDateFrom, filterDateTo]);

  const handleRowClick = (txn) => {
    setSelectedTxn(txn);
  };

  const handleViewBeneficiary = (beneficiaryId) => {
    navigate(`/profile/beneficiary/${beneficiaryId}`);
    setSelectedTxn(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Flagged Transactions</h1>
        <p className="text-slate-400 mt-1">
          Welfare payments flagged as abnormal — review signals only, not fraud determinations
        </p>
      </header>

      <div className="flex flex-wrap gap-4">
        <select
          value={filterScheme}
          onChange={(e) => setFilterScheme(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
        >
          <option value="all">All Schemes</option>
          {SCHEMES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
        >
          <option value="all">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          placeholder="From"
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          placeholder="To"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Date</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Scheme</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Amount</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Flag Reason</th>
                    <th className="text-left py-4 px-6 text-slate-400 font-medium">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const sev = getSeverityColor(t.riskSeverity);
                    return (
                      <tr
                        key={t.id}
                        onClick={() => handleRowClick(t)}
                        className="border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer"
                      >
                        <td className="py-4 px-6 text-slate-200">{t.date}</td>
                        <td className="py-4 px-6 text-slate-400">{t.scheme}</td>
                        <td className="py-4 px-6 text-slate-400">₹{t.amount.toLocaleString()}</td>
                        <td className="py-4 px-6 text-slate-400 text-sm max-w-[200px] truncate">{t.flagReason}</td>
                        <td className="py-4 px-6">
                          <span className={`text-xs px-2 py-0.5 rounded capitalize ${sev.bg} ${sev.text}`}>
                            {t.riskSeverity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedTxn ? (
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
              <h3 className="font-medium text-slate-200 mb-4">Transaction Details</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-slate-500">Date:</span> {selectedTxn.date}
                </p>
                <p>
                  <span className="text-slate-500">Scheme:</span> {selectedTxn.scheme}
                </p>
                <p>
                  <span className="text-slate-500">Amount:</span> ₹{selectedTxn.amount.toLocaleString()}
                </p>
                <p>
                  <span className="text-slate-500">Flag reason:</span> {selectedTxn.flagReason}
                </p>
                <p>
                  <span className="text-slate-500">Linked beneficiary:</span> {selectedTxn.beneficiaryName}
                </p>
                <p>
                  <span className="text-slate-500">Location:</span>{' '}
                  {[selectedTxn.location.district, selectedTxn.location.state].join(', ')}
                </p>
              </div>
              <p className="mt-4 text-xs text-slate-500 italic">
                A flagged transaction is a review signal — not a fraud determination. Verify with field data.
              </p>
              <button
                type="button"
                onClick={() => handleViewBeneficiary(selectedTxn.beneficiaryId)}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300"
              >
                View beneficiary profile →
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 text-slate-500 text-sm">
              Click a transaction to see flag explanation and linked beneficiary.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
