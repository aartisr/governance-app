import { GuidedWebsiteTour, type WebsiteTourStage } from "../../components/GuidedWebsiteTour";

// Each short narration is paired with the live control it describes.
export const civicTourStages: readonly WebsiteTourStage[] = [
  {
    kind: "intro", title: "Why Civic Accord exists", path: "/",
    headline: "A public decision begins with people.",
    subhead: "Follow one fictional proposal from its text to local impact and a possible compromise.",
    steps: [
      { narration: "Imagine a town rebuilding a bridge. Families need a safer route. A shopkeeper needs customers during construction. Budget stewards need evidence that public money works." },
      { narration: "They can share the goal and still disagree about the bill. Civic Accord makes the proposal, assumed effects, competing priorities, and possible amendments visible in one place." },
      { narration: "This is a working prototype with fictional data. The model can clarify a debate, but a community makes the decision. We will finish with a short decision brief: what we learned and what to do next." },
    ],
  },
  {
    title: "Overview: begin with the decision", path: "/",
    steps: [
      { narration: "The six-step journey map is your route through the sample bill. You can open any step. A green check only means you visited that screen; it never claims you finished an analysis.", focusSelector: ".journey-map" },
      { narration: "The Overview gives you one starting point: a featured fictional bill. Its summary tells you what the proposal is trying to do. The card beside it shows a model-ranked amendment, not a policy decision.", focusSelector: ".decision-brief" },
      { narration: "Below are direct paths to local impact and the practice priority exercise. We will follow the full path, beginning with the bill itself.", focusSelector: ".home-next" },
      { narration: "I click Read sample bills. The bill collection opens so we can inspect the proposal before looking at any score.", action: { label: "Read sample bills", selector: ".decision-brief-main .button.primary", kind: "click" } },
    ],
  },
  {
    title: "Bills: find and open a proposal", path: "/bills",
    steps: [
      { narration: "These are three fictional proposals. The search box accepts a title, bill ID, sponsor, or section. Policy tabs narrow the list without changing the underlying bills.", focusSelector: "input[aria-label='Search sample bills']" },
      { narration: "I choose Civil Rights. The list narrows, and the inspector on the right updates to the matching sample bill.", action: { label: "Civil Rights", selector: "[data-tour='domain-civil-rights']", kind: "click", revealSelector: "[data-tour='bill-inspector']" } },
      { narration: "The inspector shows the selected bill's status, sponsor, summary, sections, and assumed budget changes. These are sample values, not live legislative data.", focusSelector: "[data-tour='bill-inspector']" },
      { narration: "I return to All areas. The full sample collection returns, so I can choose the bridge proposal next.", action: { label: "All areas", selector: "[data-tour='domain-all']", kind: "click", revealSelector: "[data-tour='bill-hr-104']" } },
      { narration: "I select HR-104 in the bill list. The inspector changes to the Community Resilience and Enterprise Act, our bridge story.", action: { label: "Select HR-104", selector: "[data-tour='bill-hr-104']", kind: "click", revealSelector: "[data-tour='bill-inspector']" } },
      { narration: "I click Read bill in the inspector. That opens HR-104's own detail page, where its sections and evidence examples can be examined.", action: { label: "Read bill", selector: "[data-tour='read-selected-bill']", kind: "click" } },
    ],
  },
  {
    title: "Bill detail: inspect the claim", path: "/bills/hr-104",
    steps: [
      { narration: "HR-104 has separate sections. Each section states its proposed change, a sample exposure input, and an assumed budget change. Those numbers are model inputs, not observed effects.", focusSelector: ".section-list" },
      { narration: "I expand the evidence cards. You can now see the sample excerpts and their stated sources. These examples are not verified documents, so a real decision would require primary sources.", action: { label: "View evidence", selector: ".page > details.quiet-details > summary", kind: "click", revealSelector: ".evidence-list" } },
      { narration: "The next question is local: what might this bill mean in a particular district? I click See this bill's local impact to carry HR-104 into the impact view.", action: { label: "See local impact", selector: ".page > .button.primary", kind: "click" } },
    ],
  },
  {
    title: "Impact: see the assumptions", path: "/impact",
    steps: [
      { narration: "Impact starts with HR-104 and a sample district. Each card estimates exposure for one section. The percentage is an illustrative model output, not a measured share of residents.", focusSelector: ".impact-grid" },
      { narration: "I choose the next district. Watch the section percentages respond because the district profile has different local factors.", action: { label: "Change district", selector: ".control-grid label:nth-child(2) select", kind: "select", optionIndex: 1, revealSelector: ".impact-grid" } },
      { narration: "I open How is this calculated? The explanation shows how the section input and local factors produced this example, so the number is inspectable.", action: { label: "Show calculation", selector: ".impact-grid .card:first-child details > summary", kind: "click", revealSelector: ".impact-grid .card:first-child details p" } },
      { narration: "I choose a third district. The same bill now produces another set of estimates. Comparing them shows how much the output depends on the assumptions you select.", action: { label: "Compare district", selector: ".control-grid label:nth-child(2) select", kind: "select", optionIndex: 2, revealSelector: ".impact-grid" } },
      { narration: "Next I open community priorities. This exercise shows how a limited voice-token budget reveals intensity of preference.", action: { label: "Explore priorities", selector: ".journey-next", kind: "click" } },
    ],
  },
  {
    title: "Voter feedback: spend voice tokens", path: "/feedback",
    steps: [
      { narration: "This is a practice exercise. Each sample group has fifty voice tokens to express which issues matter most. These are budget points, not submitted votes.", focusSelector: "[data-tour='token-explainer']" },
      { narration: "I select Equity Bloc. The issues and the used and remaining token budget change to that group's sample priorities.", action: { label: "Equity Bloc", selector: ".segmented button:nth-child(2)", kind: "click", revealSelector: "[data-tour='token-budget-visual']" } },
      { narration: "I raise the first issue to six priority points. Cost is points squared, so that issue now uses thirty-six voice tokens. The budget bar and remaining balance update immediately.", action: { label: "Raise priority", selector: ".allocation-row input[type='range']", kind: "range", value: "6", revealSelector: "[data-tour='token-budget-visual']" } },
      { narration: "The total can exceed fifty. The warning makes an over-budget allocation visible rather than silently accepting it. I lower the priority to four points to bring this example back within budget.", action: { label: "Lower priority", selector: ".allocation-row input[type='range']", kind: "range", value: "4", revealSelector: "[data-tour='token-budget-visual']" } },
      { narration: "I expand sample comments. They show support, opposition, and conditions in people's own words. They are fictional and can be filtered; they do not change the compromise ranking.", action: { label: "Browse comments", selector: ".page > details.quiet-details > summary", kind: "click", revealSelector: ".public-comment-card" } },
      { narration: "The link below the sliders explains where this exercise ends. I open compromise analysis to see the separate model that ranks possible amendments.", action: { label: "See compromise ranking", selector: ".token-connection a", kind: "click" } },
    ],
  },
  {
    title: "Compromise: understand the engine", path: "/compromise",
    steps: [
      { narration: "Here is the human question behind the model: one bridge, three groups, different stakes. HR-104 is fictional. Its four sample amendments try to answer those concerns in different ways.", focusSelector: ".compromise-story" },
      { narration: "The simulator starts with equal group weights. The leading option and trade-off map are shown together. A high average can still hide a group with weak support, so both are visible.", focusSelector: "[data-tour='pareto-simulator']" },
      { narration: "I open the Pareto method. An option remains on the frontier if no other sample option is at least as good for every group and better for one. The separate risk-adjusted formula ranks the frontier options.", action: { label: "Open Pareto method", selector: "[data-tour='pareto-method'] > summary", kind: "click", revealSelector: "[data-tour='pareto-method'] p" } },
      { narration: "I expand all four scores. Average utility, lowest group utility, and risk-adjusted score are shown side by side. Voice tokens, local impact estimates, and trust scores do not feed this ranking.", action: { label: "Compare four scores", selector: "[data-tour='pareto-scores'] > summary", kind: "click", revealSelector: "[data-tour='pareto-scores'] .frontier" } },
    ],
  },
  {
    title: "Compromise: test what changes", path: "/compromise",
    steps: [
      { narration: "Now we stress-test the recommendation. With every group at one times weight, the simulator shows the equal-weight leader. The chart plots each sample option's average and weakest-group utility.", focusSelector: ".simulator-leader" },
      { narration: "I raise Equity Bloc's weight. Its assumed utility now has more influence on the modeled score. Watch the leader text and trade-off map respond.", action: { label: "Raise Equity weight", selector: ".pareto-simulator-card .control-grid > div:nth-child(2) input", kind: "range", value: "2.5", revealSelector: ".simulator-leader" } },
      { narration: "I lower Growth Caucus's weight. If the leading amendment changes, that change comes from the weights we chose, not from new evidence or a real vote.", action: { label: "Lower Growth weight", selector: ".pareto-simulator-card .control-grid > div:nth-child(1) input", kind: "range", value: "0.2", revealSelector: ".simulator-leader" } },
      { narration: "I open the delivery-risk section. This chart is separate from the ranking. It varies preset scores across one thousand simulated runs and shows a distribution, not a real-world forecast.", action: { label: "Open delivery risk", selector: "[data-tour='pareto-risk'] > summary", kind: "click", revealSelector: ".monte-carlo-simulator-card .h-44" } },
      { narration: "I run the sample scenarios again. The percentile cards and histogram update from simulated assumptions. They do not validate the bill's local impact estimates.", action: { label: "Run sample scenarios", selector: ".monte-carlo-simulator-card button.button.primary", kind: "click", revealSelector: ".monte-carlo-simulator-card .h-44" } },
      { narration: "Finally I open stakeholder trust. That page examines a different set of illustrative inputs, kept separate from the amendment score.", action: { label: "Inspect trust", selector: ".journey-next", kind: "click" } },
    ],
  },
  {
    title: "Stakeholder trust: inspect the inputs", path: "/trust",
    steps: [
      { narration: "This page compares fictional participants, not real people. Each trust percentage is an assumed score and does not affect the compromise ranking.", focusSelector: ".trust-grid" },
      { narration: "I open the formula. It weights accuracy, expertise, consistency, and transparency. The weights and inputs are displayed so a user can question them.", action: { label: "Show trust formula", selector: ".page > details.quiet-details:first-of-type > summary", kind: "click", revealSelector: ".page > details.quiet-details:first-of-type p" } },
      { narration: "I expand the first participant. The four input bars now show exactly what contributes to this sample score.", action: { label: "See score breakdown", selector: ".trust-grid .card:first-child details > summary", kind: "click", revealSelector: ".trust-grid .card:first-child .stack" } },
      { narration: "I open the safety reference. It explains safeguards a real system would need. This fictional trust score is not proof of someone's credibility.", action: { label: "Show safety reference", selector: ".page > details.quiet-details:last-of-type > summary", kind: "click", revealSelector: ".quiet-actions" } },
      { narration: "Now I click See what we learned. The last screen brings the bill, trade-offs, and next actions together, so you do not have to remember every chart.", action: { label: "See what we learned", selector: "[data-tour='finish-journey']", kind: "click" } },
    ],
  },
  {
    title: "Decision brief: what we learned", path: "/decision-brief",
    steps: [
      { narration: "Here is the answer in one minute. HR-104 combines infrastructure, small-business support, and reporting. Under equal group weights, the five-year sunset leads. That is a fictional model result, not a vote or real policy recommendation.", focusSelector: "[data-tour='brief-answer']" },
      { narration: "What we learned is in four plain-language points: inspect the bill sections, question district assumptions, hear different priorities, and remember that a modeled leader is not an automatic winner.", focusSelector: "[data-tour='brief-learned']" },
      { narration: "These are the four amendment options, with their modeled scores. All four remain on the Pareto frontier. If we give Equity more weight and Growth less, the transparent need-weighted formula leads instead.", focusSelector: "[data-tour='brief-options']" },
      { narration: "What to do next is your choice: check the proposal and primary sources, question the local assumptions, or compare the trade-offs. These links take you straight back to the relevant screens.", focusSelector: "[data-tour='brief-next']" },
      { narration: "I expand the discussion questions. They ask who gains, who bears costs, what evidence is missing, and who should decide the weights. This is the useful output to carry into a real conversation.", action: { label: "Show discussion questions", selector: "[data-tour='brief-questions'] > summary", kind: "click", revealSelector: "[data-tour='brief-questions'] li" } },
      { narration: "The boundary is explicit: nothing here submits a vote, validates evidence, or chooses a law. A real decision belongs to affected people and accountable institutions.", focusSelector: "[data-tour='brief-boundary']" },
      { narration: "I finish by showing the journey report. Download the PDF for a concise record of the six screens, four amendment options, and next questions. It records the baseline sample, not your personal clicks or slider choices.", focusSelector: "[data-tour='journey-report']" },
    ],
  },
  {
    kind: "outro", title: "Your next step", path: "/decision-brief",
    headline: "A better question is a useful outcome.",
    subhead: "You can revisit the decision brief, inspect another sample bill, or use the questions to guide a real conversation. Thank you for your time.",
    steps: [
      { narration: "You have reached the end of the sample bill journey. The decision brief holds the key findings, four options, and questions worth asking next." },
      { narration: "Choose the brief to revisit the findings, or explore another sample bill. Civic Accord is a working prototype with fictional data. Thank you for your time, and for questioning the assumptions before any real decision." },
    ],
  },
];

export function DemoPage() {
  return <GuidedWebsiteTour stages={civicTourStages} siteName="Civic Accord" />;
}
