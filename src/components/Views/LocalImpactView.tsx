import React from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Wind, 
  Briefcase, 
  ShieldCheck, 
  BarChart3, 
  Layers,
  Info
} from 'lucide-react';
import { GovernanceBill } from '../../types';

interface LocalImpactViewProps {
  bill: GovernanceBill;
  highlightTargetId?: string;
}

export const LocalImpactView: React.FC<LocalImpactViewProps> = ({
  bill,
  highlightTargetId
}) => {
  const [selectedDistrict, setSelectedDistrict] = React.useState('Zone 4 - Metropolitan Core');

  const districtData = {
    'Zone 4 - Metropolitan Core': {
      population: '1.42M Residents',
      commuterVolume: '380K Daily Commutes',
      cleanAirGain: '+38% Particulate Reduction',
      economicShift: '+$185M Net Regional Output',
      jobsImpact: '+1,840 Green Transit Jobs',
      freightFriction: '-$14.2M Logistics Transition Cost',
      demographicEquity: '88/100 Equity Rating',
      confidence: 94
    },
    'Zone 2 - Suburban Industrial Corridor': {
      population: '840K Residents',
      commuterVolume: '220K Daily Commutes',
      cleanAirGain: '+24% Particulate Reduction',
      economicShift: '+$92M Net Output',
      jobsImpact: '+620 Jobs',
      freightFriction: '-$8.6M Transition Cost',
      demographicEquity: '82/100 Equity Rating',
      confidence: 91
    },
    'Zone 6 - Rural Transition Belt': {
      population: '310K Residents',
      commuterVolume: '65K Daily Commutes',
      cleanAirGain: '+14% Particulate Reduction',
      economicShift: '+$41M Net Output',
      jobsImpact: '+210 Jobs',
      freightFriction: '-$2.1M Transition Cost',
      demographicEquity: '85/100 Equity Rating',
      confidence: 89
    }
  };

  const activeData = districtData[selectedDistrict as keyof typeof districtData] || districtData['Zone 4 - Metropolitan Core'];

  return (
    <div className="space-y-6">
      
      {/* Top District Selector Bar */}
      <div 
        id="district-selector-bar"
        className={`p-4 rounded-2xl bg-slate-900 border ${
          highlightTargetId === 'switch-district'
            ? 'border-indigo-400 ring-2 ring-indigo-500/30'
            : 'border-slate-800'
        } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-serif font-bold text-white">
              Granular District Impact Assessment
            </h2>
            <p className="text-xs text-slate-400">
              District-specific econometric modeling with confidence bounds
            </p>
          </div>
        </div>

        {/* District Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {Object.keys(districtData).map((districtName) => (
            <button
              key={districtName}
              onClick={() => setSelectedDistrict(districtName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDistrict === districtName
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {districtName.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main District Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Environmental & Air Quality Impact */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-emerald-400" />
              <span>Air Quality & Health</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              High Impact
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {activeData.cleanAirGain}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Estimated 1,420 fewer pediatric asthma hospitalizations per year across transit corridors.
            </p>
          </div>

          {/* Progress Bar Visualization */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Corridor PM2.5 Abatement</span>
              <span className="font-mono text-emerald-400">76% of Goal</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
        </div>

        {/* Economic & Jobs Shift */}
        <div 
          id="impact-kpi-card"
          className={`p-5 rounded-2xl bg-slate-900 border ${
            highlightTargetId === 'highlight-metrics'
              ? 'border-indigo-400 ring-2 ring-indigo-500/30'
              : 'border-slate-800'
          } space-y-4`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Labor & Economic Output</span>
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              Positive Net
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-2xl font-bold font-mono text-indigo-300">
              {activeData.jobsImpact}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct electrical engineering, bus maintenance, and microgrid installation positions.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Net Economic Output:</span>
            <span className="font-mono font-bold text-slate-200">{activeData.economicShift}</span>
          </div>
        </div>

        {/* Demographic Equity & Confidence Bound */}
        <div 
          id="impact-confidence-card"
          className={`p-5 rounded-2xl bg-slate-900 border ${
            highlightTargetId === 'inspect-confidence'
              ? 'border-indigo-400 ring-2 ring-indigo-500/30'
              : 'border-slate-800'
          } space-y-4`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Equity & Confidence</span>
            </span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono text-purple-300">
                {activeData.confidence}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">p &lt; 0.01</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Empirical modeling confidence based on 8 historical metropolitan transit expansions.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Demographic Equity Score:</span>
            <span className="font-mono font-bold text-purple-300">{activeData.demographicEquity}</span>
          </div>
        </div>

      </div>

      {/* Trade-Off Friction Summary Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold">Localized Trade-off Context: </strong>
          While air quality and green jobs experience massive gains in {selectedDistrict}, commercial logistics operators absorb an initial transition cost of <span className="font-mono text-amber-400">{activeData.freightFriction}</span>. 
          The Pareto Engine utilizes this exact friction data to engineer targeted compromise amendments in Chapter 6.
        </div>
      </div>

    </div>
  );
};
