import { useNavigate } from 'react-router-dom';
import { getRiskColor } from '../utils/riskCalculations';

export default function KPICard({ title, value, subtitle, riskScore, to, colorScheme }) {
  const navigate = useNavigate();
  const colors = colorScheme || (riskScore != null ? getRiskColor(riskScore) : null);
  const clickable = !!to;

  const handleClick = () => {
    if (clickable && to) navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!clickable}
      className={`
        w-full text-left p-6 rounded-xl border transition-all
        bg-slate-800/80 border-slate-700 hover:border-slate-600
        ${clickable ? 'cursor-pointer hover:bg-slate-800' : 'cursor-default'}
        ${colors?.border ? `hover:${colors.border}` : ''}
      `}
    >
      <p className="text-sm text-slate-400 uppercase tracking-wider">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${colors?.text || 'text-slate-100'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </button>
  );
}
