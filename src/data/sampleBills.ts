import { GovernanceBill } from '../types';

export const SAMPLE_BILLS: GovernanceBill[] = [
  {
    id: 'sb-402',
    code: 'SB-402',
    title: 'Regional Clean Transit & Grid Modernization Act',
    category: 'Infrastructure & Clean Energy',
    status: 'Pareto Compromise Ready',
    sponsor: 'Sen. Elena Rostova (Dist. 14) & Rep. Marcus Chen (Dist. 08)',
    district: 'Statewide / Metropolitan Zone 4',
    summary: 'A legislative framework to decarbonize regional transit networks, mandate distributed microgrids for public utilities, and institute progressive congestion mitigation while safeguarding small business logistics and low-income commuter mobility.',
    problemStatement: 'Previous drafts faced political deadlock: transit advocates demanded aggressive carbon levies, while regional business coalitions and commuter unions protested disproportionate fee burdens and grid unreliability.',
    budgetEst: '$2.45 Billion over 6 Years',
    timeline: 'Phase 1: FY2027 • Full Enactment: FY2030',
    confidenceScore: 94,
    statusQuoUtility: { groupA: 42, groupB: 38, generalPublic: 45 }, // Group A = Transit/Eco, Group B = Freight/Commerce
    baseBillUtility: { groupA: 88, groupB: 24, generalPublic: 56 }, // Highly skewed towards A, harms B
    paretoOptimizedUtility: { groupA: 84, groupB: 78, generalPublic: 86 }, // Win-Win Pareto frontier
    clauses: [
      {
        id: 'cl-1',
        number: 'Sec. 101',
        title: 'Zero-Emission Bus Fleet & Rapid Transit Corridors',
        summary: 'Mandates 100% electric bus conversion for metropolitan transit authorities by 2030 with dedicated priority busways.',
        fiscalImpact: '$940M Capital Outlay',
        contestedLevel: 'low',
        stakeholderPositions: [
          { group: 'Clean Air Coalition', stance: 'support', reason: 'Reduces particulate emissions by 68% in high-density corridors.' },
          { group: 'Regional Transit Authority', stance: 'support', reason: 'Lowers long-term fleet maintenance costs by 22%.' }
        ]
      },
      {
        id: 'cl-2',
        number: 'Sec. 204',
        title: 'Dynamic Commercial Corridor Congestion Levy',
        summary: 'Imposes variable tolling for commercial freight vehicles entering urban centers during peak morning and evening logistics windows.',
        fiscalImpact: '+$310M/year Revenue Generation',
        contestedLevel: 'high',
        stakeholderPositions: [
          { group: 'Clean Air Coalition', stance: 'support', reason: 'Incentivizes off-peak logistics and reduces bottleneck gridlock.' },
          { group: 'Freight & Logistics Alliance', stance: 'oppose', reason: 'Adds $1,200/month per delivery vehicle; hurts independent operators.' },
          { group: 'Downtown Small Business Union', stance: 'oppose', reason: 'Pass-through surcharge elevates consumer prices by ~4.2%.' }
        ]
      },
      {
        id: 'cl-3',
        number: 'Sec. 308',
        title: 'Decentralized Microgrid & Battery Storage Mandate',
        summary: 'Requires commercial properties over 50,000 sq ft to incorporate 4-hour battery backup and open telemetry to the public power grid.',
        fiscalImpact: '$620M Private Co-Investment with 30% Tax Credit',
        contestedLevel: 'medium',
        stakeholderPositions: [
          { group: 'Public Grid Operator', stance: 'support', reason: 'Eliminates brownout risk during peak summer heatwaves.' },
          { group: 'Commercial Property Council', stance: 'neutral', reason: 'Feasible only if tax credit applies against municipal property taxes immediately.' }
        ]
      },
      {
        id: 'cl-4',
        number: 'Sec. 402',
        title: 'Low-Income Commuter Mobility Dividend',
        summary: 'Provides direct transit credit subsidies and off-peak toll exemptions for households earning under 80% Area Median Income (AMI).',
        fiscalImpact: '$180M/year Dedicated Trust Fund',
        contestedLevel: 'low',
        stakeholderPositions: [
          { group: 'Civic Equity Council', stance: 'support', reason: 'Guarantees equitable access without regressive transit tax burden.' },
          { group: 'Clean Air Coalition', stance: 'support', reason: 'Broadens public buy-in for environmental reforms.' }
        ]
      }
    ],
    stakeholders: [
      {
        id: 'sh-1',
        name: 'Dr. Sarah Jenkins',
        role: 'Chief Policy Scientist',
        organization: 'Regional Clean Air & Climate Alliance',
        category: 'Environmental',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 96,
        credibilityBreakdown: {
          empiricalRigor: 98,
          domainExpertise: 95,
          financialTransparency: 94,
          historicalAccuracy: 97
        },
        initialUtility: 88,
        currentUtility: 84,
        voiceTokensAllocated: 36,
        keyDemands: ['Firm 2030 deadline for bus electrification', 'Dedicated corridor air quality sensors', 'Transparent emissions audit']
      },
      {
        id: 'sh-2',
        name: 'Roberto Valenzuela',
        role: 'Executive Director',
        organization: 'Metro Freight & Logistics Coalition',
        category: 'Industry',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 89,
        credibilityBreakdown: {
          empiricalRigor: 86,
          domainExpertise: 94,
          financialTransparency: 88,
          historicalAccuracy: 88
        },
        initialUtility: 24,
        currentUtility: 78,
        voiceTokensAllocated: 42,
        keyDemands: ['Night-time off-peak toll waiver for freight', 'Green fleet upgrade rebate matching funds', 'Phased roll-out with 2-year grace period']
      },
      {
        id: 'sh-3',
        name: 'Amina Al-Mansoor',
        role: 'Community Advocate',
        organization: 'District 4 Transit Justice League',
        category: 'Community',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 93,
        credibilityBreakdown: {
          empiricalRigor: 91,
          domainExpertise: 92,
          financialTransparency: 96,
          historicalAccuracy: 93
        },
        initialUtility: 56,
        currentUtility: 86,
        voiceTokensAllocated: 22,
        keyDemands: ['Protection of low-income commuter rates', 'Equitable neighborhood bus frequency', 'Air monitoring in historically industrial zones']
      }
    ],
    amendments: [
      {
        id: 'am-1',
        title: 'Amendment 204-A: Night & Off-Peak Logistics Waiver',
        clauseTarget: 'Sec. 204 (Congestion Levy)',
        description: 'Exempts commercial freight vehicles from tolls between 8:00 PM and 6:00 AM while offering an instant 50% rebate for low-emission EV trucks.',
        active: true,
        stakeholderUtilityDelta: { 'sh-1': -2, 'sh-2': +38, 'sh-3': +4 },
        paretoGainScore: 92,
        evidenceConfidence: 96,
        evidenceSource: 'UC Berkeley Transportation Logistics Empirical Simulation (2025)'
      },
      {
        id: 'am-2',
        title: 'Amendment 308-B: Accelerated Municipal Tax Credit Stream',
        clauseTarget: 'Sec. 308 (Battery Storage)',
        description: 'Enables commercial properties to claim 100% of microgrid battery depreciation in Year 1 against municipal tax liabilities.',
        active: true,
        stakeholderUtilityDelta: { 'sh-1': +1, 'sh-2': +16, 'sh-3': +3 },
        paretoGainScore: 88,
        evidenceConfidence: 93,
        evidenceSource: 'State Energy Commission Grid Reliability Benchmark (2026)'
      },
      {
        id: 'am-3',
        title: 'Amendment 402-C: Automated Smart Transit Card Credit',
        clauseTarget: 'Sec. 402 (Mobility Dividend)',
        description: 'Auto-enrolls eligible SNAP & Medicaid recipients for zero-fare transit credits directly linked to municipal digital IDs without bureaucratic paperwork.',
        active: true,
        stakeholderUtilityDelta: { 'sh-1': +0, 'sh-2': +0, 'sh-3': +23 },
        paretoGainScore: 95,
        evidenceConfidence: 98,
        evidenceSource: 'Civic Accord Demographic Equity Impact Modeling'
      }
    ]
  },
  {
    id: 'hr-108',
    code: 'HR-108',
    title: 'Responsible AI & Public Algorithm Governance Act',
    category: 'Technology & Civic Rights',
    status: 'Floor Deliberation',
    sponsor: 'Rep. Maya Lin & Sen. David Sterling',
    district: 'National / Cross-Jurisdiction',
    summary: 'Establishes statutory transparency standards, bias audit protocols, and algorithmic impact disclosures for AI models utilized in judicial, credit, hiring, and public safety determinations.',
    problemStatement: 'Startups fear regulatory stifle and trade-secret exposure, while civil liberties groups demand uncompromised model transparency and redress rights.',
    budgetEst: '$140M Annual Agency Oversight',
    timeline: 'Mandatory Audits by Q3 2027',
    confidenceScore: 91,
    statusQuoUtility: { groupA: 35, groupB: 50, generalPublic: 40 },
    baseBillUtility: { groupA: 85, groupB: 20, generalPublic: 60 },
    paretoOptimizedUtility: { groupA: 82, groupB: 74, generalPublic: 88 },
    clauses: [
      {
        id: 'cl-108-1',
        number: 'Sec. 12',
        title: 'Mandatory Bias & Fairness Auditing in High-Stakes Public Decisions',
        summary: 'Third-party annual audits required for algorithmic models determining loan approvals, bail recommendations, and public housing allocations.',
        fiscalImpact: '$45M Oversight Grants',
        contestedLevel: 'medium',
        stakeholderPositions: [
          { group: 'Civil Rights Coalition', stance: 'support', reason: 'Prevents systemic racial and socioeconomic disparate impact.' },
          { group: 'Tech Innovators Guild', stance: 'neutral', reason: 'Supports standardized benchmarks over subjective review boards.' }
        ]
      },
      {
        id: 'cl-108-2',
        number: 'Sec. 18',
        title: 'Safe Harbor for Tier-1 Open Source Research Models',
        summary: 'Exempts non-commercial research models and small developers (<$5M ARR) from full compliance burdens while retaining strict liability for deployment.',
        fiscalImpact: 'Neutral',
        contestedLevel: 'high',
        stakeholderPositions: [
          { group: 'Open Source AI Foundation', stance: 'support', reason: 'Protects decentralized innovation and academic researchers.' },
          { group: 'Enterprise AI Consortium', stance: 'oppose', reason: 'Argues dual standards create regulatory arbitrage.' }
        ]
      }
    ],
    stakeholders: [
      {
        id: 'sh-108-1',
        name: 'Prof. Marcus Vance',
        role: 'Chair of Algorithmic Ethics',
        organization: 'National Data Rights Institute',
        category: 'Community',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 97,
        credibilityBreakdown: {
          empiricalRigor: 99,
          domainExpertise: 98,
          financialTransparency: 96,
          historicalAccuracy: 95
        },
        initialUtility: 85,
        currentUtility: 82,
        voiceTokensAllocated: 40,
        keyDemands: ['Standardized fairness metrics', 'Citizen appeal mechanism', 'Whistleblower protections']
      },
      {
        id: 'sh-108-2',
        name: 'Elena Rostova-Dunn',
        role: 'VP Public Policy',
        organization: 'NextGen AI Developer Coalition',
        category: 'Industry',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 88,
        credibilityBreakdown: {
          empiricalRigor: 85,
          domainExpertise: 94,
          financialTransparency: 84,
          historicalAccuracy: 89
        },
        initialUtility: 20,
        currentUtility: 74,
        voiceTokensAllocated: 35,
        keyDemands: ['Safe harbor for open research', 'Clear testing sandboxes', 'Protection of proprietary weights']
      }
    ],
    amendments: [
      {
        id: 'am-108-1',
        title: 'Amendment 18-A: Tiered Sandbox & Standardized Benchmarking',
        clauseTarget: 'Sec. 18 (Safe Harbor)',
        description: 'Establishes a National AI Testing Sandbox with verifiable zero-knowledge compliance proofs, eliminating proprietary weight disclosure.',
        active: true,
        stakeholderUtilityDelta: { 'sh-108-1': -3, 'sh-108-2': +54 },
        paretoGainScore: 94,
        evidenceConfidence: 95,
        evidenceSource: 'NIST Framework & IEEE AI Governance Standards'
      }
    ]
  },
  {
    id: 'hb-89',
    code: 'HB-89',
    title: 'Balanced Workforce Housing & Transit-Oriented Zoning Act',
    category: 'Urban Planning & Housing',
    status: 'In Committee',
    sponsor: 'Rep. Julian Brooks & Councilmember Karen Diaz',
    district: 'Statewide Urban Districts',
    summary: 'Allows missing-middle multi-family zoning within 0.5 miles of major transit hubs while providing density bonuses for 30%+ permanent affordability.',
    problemStatement: 'Neighborhood homeowner associations fear neighborhood character loss and parking overload; working families are priced out of proximity to transit.',
    budgetEst: '$420M Infrastructure Matching Grants',
    timeline: 'Enacted Q1 2027',
    confidenceScore: 93,
    statusQuoUtility: { groupA: 40, groupB: 45, generalPublic: 42 },
    baseBillUtility: { groupA: 82, groupB: 28, generalPublic: 58 },
    paretoOptimizedUtility: { groupA: 80, groupB: 76, generalPublic: 85 },
    clauses: [
      {
        id: 'cl-89-1',
        number: 'Sec. 4',
        title: 'Transit-Adjacent Duplex & Fourplex By-Right Permitting',
        summary: 'Removes single-family exclusivity within 800 meters of rail stations and high-frequency bus lines.',
        fiscalImpact: 'Revenue Positive via Property Tax Base Growth',
        contestedLevel: 'high',
        stakeholderPositions: [
          { group: 'Housing For All Coalition', stance: 'support', reason: 'Unlocks thousands of attainable homes close to employment hubs.' },
          { group: 'Preserve Neighborhood Heritage', stance: 'oppose', reason: 'Increases parking strain and reduces lot canopy coverage.' }
        ]
      }
    ],
    stakeholders: [
      {
        id: 'sh-89-1',
        name: 'Devon Thorne',
        role: 'Policy Director',
        organization: 'Affordable Housing Coalition',
        category: 'Community',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 94,
        credibilityBreakdown: { empiricalRigor: 93, domainExpertise: 96, financialTransparency: 95, historicalAccuracy: 92 },
        initialUtility: 82,
        currentUtility: 80,
        voiceTokensAllocated: 45,
        keyDemands: ['Minimum 30% permanent affordability covenants', 'Tenant anti-displacement protections']
      },
      {
        id: 'sh-89-2',
        name: 'Clara Vance-Holloway',
        role: 'President',
        organization: 'Metropolitan Homeowners Federation',
        category: 'Municipal',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        credibilityScore: 87,
        credibilityBreakdown: { empiricalRigor: 82, domainExpertise: 91, financialTransparency: 86, historicalAccuracy: 89 },
        initialUtility: 28,
        currentUtility: 76,
        voiceTokensAllocated: 38,
        keyDemands: ['Dedicated tree canopy quotas', 'Infrastructure matching funds for water/sewer upgrades']
      }
    ],
    amendments: [
      {
        id: 'am-89-1',
        title: 'Amendment 4-C: Green Canopy & Infrastructure Surcharge Match',
        clauseTarget: 'Sec. 4 (By-Right Permitting)',
        description: 'Requires developers to preserve 25% permeable green space and contributes 2% of construction value to localized neighborhood drainage/parking improvements.',
        active: true,
        stakeholderUtilityDelta: { 'sh-89-1': -2, 'sh-89-2': +48 },
        paretoGainScore: 93,
        evidenceConfidence: 96,
        evidenceSource: 'Urban Land Institute Sustainable Density Empirical Analysis'
      }
    ]
  }
];
