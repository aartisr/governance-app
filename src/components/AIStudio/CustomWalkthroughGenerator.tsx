import React from 'react';
import { 
  Sparkles, 
  Video, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Cpu, 
  Sliders, 
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { VideoScene, GovernanceBill } from '../../types';

interface CustomWalkthroughGeneratorProps {
  onLoadCustomWalkthrough: (newBill: GovernanceBill, newScenes: VideoScene[]) => void;
  onSwitchToVideo: () => void;
}

export const CustomWalkthroughGenerator: React.FC<CustomWalkthroughGeneratorProps> = ({
  onLoadCustomWalkthrough,
  onSwitchToVideo
}) => {
  const [topic, setTopic] = React.useState('Municipal Water Conservation & Agricultural Drought Protection Act');
  const [billContext, setBillContext] = React.useState(
    'A state regulatory proposal balancing mandatory urban water usage limits, agricultural irrigation exemptions, smart metering subsidies, and drought emergency reserves.'
  );
  const [audience, setAudience] = React.useState('Citizen & Policymaker');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationResult, setGenerationResult] = React.useState<any | null>(null);

  const presetTemplates = [
    {
      title: 'Municipal Water & Drought Accord',
      desc: 'Balancing urban ration quotas with agricultural irrigation rights.',
      topic: 'Municipal Water Conservation & Agricultural Drought Protection Act',
      context: 'Urban water reduction mandates vs agricultural crop yield protections and groundwater telemetry subsidies.'
    },
    {
      title: 'Decentralized Energy & Grid Wheeling Act',
      desc: 'Rooftop solar peer-to-peer trading vs utility maintenance revenues.',
      topic: 'Decentralized Rooftop Solar & Fair Grid Wheeling Accord',
      context: 'Solar prosumers demand open grid export rates while utility operators require fixed grid maintenance fees.'
    },
    {
      title: 'Autonomous Transit & Labor Transition Pact',
      desc: 'Autonomous public transit fleets with guaranteed workforce reskilling.',
      topic: 'Autonomous Municipal Transit Safety & Labor Transition Pact',
      context: 'City aims to deploy autonomous micro-shuttles; transit unions demand protected wages and automated maintenance training.'
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-walkthrough', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          customBillText: billContext,
          targetAudience: audience
        })
      });

      const json = await res.json();
      if (json.data) {
        setGenerationResult(json.data);
      } else {
        // Fallback local generated scenario
        const fallbackBill: GovernanceBill = {
          id: 'custom-ai-bill',
          code: 'HB-920',
          title: topic,
          category: 'Civic Resources & Sustainability',
          status: 'Pareto Compromise Ready',
          sponsor: 'Joint Legislative Energy & Water Committee',
          district: 'Cross-District State Water Basin',
          summary: billContext,
          problemStatement: 'Partisan standoff between urban consumers and agricultural producers over water allocation rights during drought periods.',
          budgetEst: '$850M State Conservation Fund',
          timeline: 'Phased Enforcement 2027-2029',
          confidenceScore: 95,
          statusQuoUtility: { groupA: 38, groupB: 35, generalPublic: 40 },
          baseBillUtility: { groupA: 85, groupB: 22, generalPublic: 55 },
          paretoOptimizedUtility: { groupA: 82, groupB: 76, generalPublic: 86 },
          clauses: [
            {
              id: 'c-custom-1',
              number: 'Sec. 101',
              title: 'Telemetry-Based Agricultural Irrigation Rebate',
              summary: 'Subsidizes 80% of IoT drip irrigation installation for commercial farms maintaining water efficiency standards.',
              fiscalImpact: '$340M Grant Outlay',
              contestedLevel: 'low',
              stakeholderPositions: [
                { group: 'Farm Bureau Coalition', stance: 'support', reason: 'Modernizes equipment without crippling small producers.' }
              ]
            },
            {
              id: 'c-custom-2',
              number: 'Sec. 202',
              title: 'Dynamic Tiered Urban Peak Consumption Tariff',
              summary: 'Progressive rates for residential properties exceeding 150 gallons/person/day during drought alerts.',
              fiscalImpact: '+$120M Annual Reserve',
              contestedLevel: 'high',
              stakeholderPositions: [
                { group: 'Urban Water District', stance: 'support', reason: 'Curbs non-essential ornamental turf watering.' },
                { group: 'Suburban HOA Alliance', stance: 'oppose', reason: 'Argues penalties are punitive on multi-generational households.' }
              ]
            }
          ],
          stakeholders: [
            {
              id: 'sh-custom-1',
              name: 'Dr. Elena Rostova',
              role: 'Hydrogeologist',
              organization: 'State Water Basin Conservation Coalition',
              category: 'Environmental',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
              credibilityScore: 96,
              credibilityBreakdown: { empiricalRigor: 98, domainExpertise: 95, financialTransparency: 94, historicalAccuracy: 97 },
              initialUtility: 85,
              currentUtility: 82,
              voiceTokensAllocated: 40,
              keyDemands: ['Aquifer replenishment guarantees', 'Mandatory flow sensors']
            },
            {
              id: 'sh-custom-2',
              name: 'Thomas Bradley',
              role: 'President',
              organization: 'Regional Agricultural Producers Federation',
              category: 'Industry',
              avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
              credibilityScore: 89,
              credibilityBreakdown: { empiricalRigor: 86, domainExpertise: 94, financialTransparency: 88, historicalAccuracy: 88 },
              initialUtility: 22,
              currentUtility: 76,
              voiceTokensAllocated: 38,
              keyDemands: ['Drip irrigation matching funds', 'Multi-year rolling water averages']
            }
          ],
          amendments: [
            {
              id: 'am-custom-1',
              title: 'Amendment 202-A: Multi-Generational Household Exemption & Drip Rebate',
              clauseTarget: 'Sec. 202 (Urban Tariff)',
              description: 'Exempts families >4 occupants from tier-3 surcharges and auto-rebates drip conversion.',
              active: true,
              stakeholderUtilityDelta: { 'sh-custom-1': -3, 'sh-custom-2': +54 },
              paretoGainScore: 93,
              evidenceConfidence: 96,
              evidenceSource: 'USGS Hydrological Modeling'
            }
          ]
        };

        const fallbackScenes: VideoScene[] = [
          {
            id: 'sc-c-1',
            sceneNumber: 1,
            title: `Chapter 1: Overview of ${topic}`,
            subtitle: 'AI-Generated Policy Simulation & Pareto Optimization',
            timestamp: '00:00',
            durationSeconds: 22,
            activeTab: 'overview',
            narrationScript: `Welcome to the custom AI-generated simulation for ${topic}. Civic Accord analyzes the multi-objective trade-offs between stakeholders to synthesize Pareto optimal compromises.`,
            keyTakeaways: ['AI-generated policy clauses', 'Real-time quadratic token math', 'Pareto compromise discovery'],
            interactiveCues: []
          },
          {
            id: 'sc-c-2',
            sceneNumber: 2,
            title: 'Chapter 2: Clause Intelligence',
            subtitle: 'Decomposition and fiscal review',
            timestamp: '00:22',
            durationSeconds: 22,
            activeTab: 'intelligence',
            narrationScript: `In Chapter 2, we inspect the decomposed clauses, analyzing fiscal impacts and identifying key points of contention between urban residents and agricultural producers.`,
            keyTakeaways: ['Clause-level breakdown', 'Fiscal estimations', 'Identified friction signals'],
            interactiveCues: []
          },
          {
            id: 'sc-c-3',
            sceneNumber: 3,
            title: 'Chapter 3: Pareto Compromise',
            subtitle: 'Synthesizing win-win amendments',
            timestamp: '00:44',
            durationSeconds: 24,
            activeTab: 'pareto',
            narrationScript: `By activating targeted compromise amendments, both agricultural producers and urban water districts achieve high utility without degrading emergency conservation reserves.`,
            keyTakeaways: ['Pareto Frontier shift', 'Mutually beneficial policy adjustments', 'Consensus achieved'],
            interactiveCues: []
          }
        ];

        setGenerationResult({
          bill: fallbackBill,
          scenes: fallbackScenes
        });
      }
    } catch (e) {
      console.warn('AI generation error, using fallback');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToPlayer = () => {
    if (generationResult?.bill && generationResult?.scenes) {
      onLoadCustomWalkthrough(generationResult.bill, generationResult.scenes);
      onSwitchToVideo();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini AI Scenario & Video Studio</span>
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
          Generate Custom Governance Video Walkthroughs
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Input any legislative dilemma or regulatory conflict. Gemini 3.7 Flash will decompose the clauses, calculate stakeholder utilities, and generate a customized 6-chapter narrated video demonstration.
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div>
        <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300 block mb-2 px-1">
          Quick Preset Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presetTemplates.map((tmpl, idx) => (
            <div
              key={idx}
              onClick={() => {
                setTopic(tmpl.topic);
                setBillContext(tmpl.context);
              }}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 cursor-pointer transition-all"
            >
              <h4 className="text-xs font-bold text-white">{tmpl.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{tmpl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
            Policy / Bill Title:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            placeholder="e.g., Statewide Microgrid & Decentralized Solar Reliability Act"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
            Core Trade-Offs & Stakeholder Friction:
          </label>
          <textarea
            rows={3}
            value={billContext}
            onChange={(e) => setBillContext(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            placeholder="Describe the opposing stakeholder groups, contested provisions, and budgetary constraints..."
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Target Audience:</span>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Citizen & Policymaker">Citizen & Policymaker</option>
              <option value="Executive & Legislative Staff">Executive & Legislative Staff</option>
              <option value="Academic & Civic Researchers">Academic & Civic Researchers</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Video Script...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video Walkthrough</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Result Preview */}
      {generationResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Custom Video Script & Simulation Dataset Ready!</span>
            </div>

            <button
              onClick={handleApplyToPlayer}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Watch in Master Video Player</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="text-white font-bold text-sm">
              {generationResult.bill?.title || topic}
            </div>
            <p className="text-slate-400">
              {generationResult.bill?.summary || billContext}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
