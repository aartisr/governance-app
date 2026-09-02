import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  BarChart3,
  BookOpenText,
  Sparkles,
  Sliders,
  Landmark,
  Vote,
  GitBranch,
  Award,
  ChevronRight,
  Maximize2,
  Minimize2,
  Tv,
  ArrowRight
} from "lucide-react";
import { Badge, Card, PageHeader } from "../../components/ui";

interface DemoStage {
  id: number;
  title: string;
  subtitle: string;
  routePath: string;
  icon: any;
  durationSec: number;
  scriptText: string;
  captionText: string;
  keyPoints: string[];
  metrics: { label: string; value: string; color: string }[];
}

const DEMO_STAGES: DemoStage[] = [
  {
    id: 1,
    title: "1. The Governance Imperative",
    subtitle: "Solving Policy Polarization with Pareto Efficiency",
    routePath: "/",
    icon: Award,
    durationSec: 18,
    scriptText:
      "Welcome to Governance OS, an evidence-based civic decision engine designed to eliminate partisan gridlock. By replacing intuition with Pareto efficiency and stochastic simulation, Governance OS crafts optimal policies backed by data.",
    captionText:
      "Governance OS replaces partisan intuition with mathematical Pareto efficiency and stochastic risk modeling.",
    keyPoints: [
      "Evidence-based decision support system",
      "Mathematically grounded Pareto trade-off curves",
      "Real-time civic data integration"
    ],
    metrics: [
      { label: "Engine Status", value: "Active / Optimal", color: "emerald" },
      { label: "Target Efficiency", value: "94.2% Pareto", color: "indigo" }
    ]
  },
  {
    id: 2,
    title: "2. Real-Time Command Center",
    subtitle: "Executive Governance Metrics & Health Scores",
    routePath: "/",
    icon: BarChart3,
    durationSec: 18,
    scriptText:
      "The Command Center provides a real-time pulse of legislative velocity, public trust scores, and high-impact policy metrics. Executives gain immediate clarity on policy readiness, risk distributions, and district sentiment.",
    captionText:
      "Executive Dashboard monitoring legislative velocity, trust index (87.4%), and recommendation readiness.",
    keyPoints: [
      "Real-time governance health score (87.4/100)",
      "Automated bill velocity and active docket tracking",
      "Executive decision briefing cards"
    ],
    metrics: [
      { label: "Trust Score", value: "87.4 / 100", color: "indigo" },
      { label: "Active Bills", value: "24 Monitored", color: "blue" }
    ]
  },
  {
    id: 3,
    title: "3. Legislative Workspace & LegiScan",
    subtitle: "Multi-Bill Comparison & Live Docket Sync",
    routePath: "/bills",
    icon: BookOpenText,
    durationSec: 18,
    scriptText:
      "In the Bills Workspace, policymakers explore active legislation across AI, healthcare, and energy domains. Side-by-side bill comparison matrices and live LegiScan API docket syncing bring state and federal legislation into unified view.",
    captionText:
      "Bills Workspace featuring domain filters, side-by-side bill matrix comparison, and LegiScan docket sync.",
    keyPoints: [
      "Cross-domain legislative categorization",
      "Side-by-side multi-bill clause comparison",
      "Live LegiScan API docket synchronization"
    ],
    metrics: [
      { label: "Sync Status", value: "LegiScan API Live", color: "emerald" },
      { label: "Tracked Clauses", value: "184 Sections", color: "violet" }
    ]
  },
  {
    id: 4,
    title: "4. Gemini 3.6 AI Policy Intelligence",
    subtitle: "Deep Multi-Dimensional Risk & Stakeholder Matrix",
    routePath: "/bills",
    icon: Sparkles,
    durationSec: 20,
    scriptText:
      "Powered by Gemini 3.6 Flash, the AI Policy Inspector evaluates complex legislative text in real time. It generates executive summaries, highlights key operational risks, builds stakeholder impact matrices, and suggests actionable compromise amendments.",
    captionText:
      "Gemini 3.6 Flash AI evaluating policy risks, enterprise impacts, and proposing balanced amendments.",
    keyPoints: [
      "Instant AI text evaluation via Gemini 3.6 Flash",
      "3-tier stakeholder impact matrix (Citizens, Business, Oversight)",
      "Actionable compromise amendment generation"
    ],
    metrics: [
      { label: "AI Latency", value: "< 1.2s Real-Time", color: "indigo" },
      { label: "Model", value: "Gemini 3.6 Flash", color: "teal" }
    ]
  },
  {
    id: 5,
    title: "5. Monte Carlo & Pareto Risk Simulators",
    subtitle: "1,000-Run Stochastic Variance & Trade-Off Modeling",
    routePath: "/bills",
    icon: Sliders,
    durationSec: 20,
    scriptText:
      "Governance OS runs 1,000 stochastic Monte Carlo simulations to model fiscal variance, implementation latency, and regulatory tail-risk. Simultaneously, the Interactive Pareto Simulator maps multi-objective trade-off frontiers for optimal policy balance.",
    captionText:
      "Monte Carlo simulator running 1,000 iterations alongside interactive Pareto efficiency curve modeling.",
    keyPoints: [
      "1,000 stochastic Monte Carlo iterations",
      "Confidence intervals and variance forecasting",
      "Interactive multi-objective Pareto trade-off curve"
    ],
    metrics: [
      { label: "Simulations", value: "1,000 Iterations", color: "emerald" },
      { label: "Confidence", value: "95% Interval", color: "indigo" }
    ]
  },
  {
    id: 6,
    title: "6. District Impact & Economic Mapping",
    subtitle: "Granular Urban vs. Rural Preference Intensity",
    routePath: "/impact",
    icon: Landmark,
    durationSec: 18,
    scriptText:
      "The Impact module analyzes legislative outcomes across diverse economic sectors and regional districts. It measures preference intensity to ensure policies do not disproportionately burden rural agricultural or urban high-density populations.",
    captionText:
      "District impact analysis evaluating economic sector shift and preference intensity across regional cohorts.",
    keyPoints: [
      "Regional district economic forecasting",
      "Preference intensity weighting",
      "Equitable burden distribution analysis"
    ],
    metrics: [
      { label: "Districts Mapped", value: "12 Cohorts", color: "blue" },
      { label: "Net Gain", value: "+$14.2M Est.", color: "emerald" }
    ]
  },
  {
    id: 7,
    title: "7. Public Feedback & Sentiment Parsing",
    subtitle: "NLP Topic Clustering & Verified Evidence Verification",
    routePath: "/feedback",
    icon: Vote,
    durationSec: 18,
    scriptText:
      "Public feedback parser uses natural language processing to categorize thousands of citizen comments. It matches public input with verified empirical evidence, grounding civic participation in peer-reviewed facts rather than rhetoric.",
    captionText:
      "Public comment parser clustering voter sentiment and anchoring feedback to verified empirical sources.",
    keyPoints: [
      "NLP sentiment and topic clustering",
      "Empirical evidence verification matching",
      "Transparent civic engagement metrics"
    ],
    metrics: [
      { label: "Public Input", value: "3,420 Comments", color: "indigo" },
      { label: "Evidence Link", value: "92% Grounded", color: "emerald" }
    ]
  },
  {
    id: 8,
    title: "8. Consensus Engine & NIST Compliance",
    subtitle: "Data-Backed Compromise & Audit Export",
    routePath: "/compromise",
    icon: GitBranch,
    durationSec: 18,
    scriptText:
      "The Consensus Engine synthesizes stakeholder inputs to generate win-win policy compromise proposals. Integrated NIST AI Safety Cards ensure regulatory compliance, while full audit reports export with a single click.",
    captionText:
      "Consensus Engine generating data-backed compromise policies with NIST AI Safety Card verification.",
    keyPoints: [
      "Automated win-win policy compromise generator",
      "Integrated NIST AI Safety Card compliance modal",
      "Instant PDF & JSON governance audit exports"
    ],
    metrics: [
      { label: "Win-Win Score", value: "91.8 Pareto", color: "emerald" },
      { label: "NIST Audit", value: "Passed / Certified", color: "teal" }
    ]
  },
  {
    id: 9,
    title: "9. Epilogue: Interactive Governance OS Paradigm",
    subtitle: "A New Standard for Data-Driven Modern Democracy",
    routePath: "/trust",
    icon: Award,
    durationSec: 18,
    scriptText:
      "Governance OS transforms public policy from an era of partisan friction into an era of verifiable proof, transparent trust, and Pareto efficiency. This is the future of governance.",
    captionText:
      "Governance OS delivers verifiable proof, transparent stakeholder trust, and zero-gridlock public policy.",
    keyPoints: [
      "Verifiable empirical proof in legislation",
      "Zero-gridlock consensus building",
      "A transformative paradigm for global governance"
    ],
    metrics: [
      { label: "Overall Rating", value: "Verified Active", color: "amber" },
      { label: "Deployment", value: "Production Ready", color: "emerald" }
    ]
  }
];

export function DemoPage() {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentStage = DEMO_STAGES[currentStageIdx];
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Stage timer loop with synchronized SpeechSynthesis
  useEffect(() => {
    let speechFinished = false;
    let timerFinished = false;

    const tryAdvance = () => {
      if (speechFinished && timerFinished) {
        if (currentStageIdx < DEMO_STAGES.length - 1) {
          setCurrentStageIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          if (isRecording) stopRecording();
        }
      }
    };

    if (isPlaying) {
      if (isAudioEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentStage.scriptText);
        utterance.rate = 0.98;
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Samantha"))
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
          speechFinished = true;
          setTimeout(tryAdvance, 800);
        };
        utterance.onerror = () => {
          speechFinished = true;
          tryAdvance();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        speechFinished = true;
      }

      stageTimerRef.current = setTimeout(() => {
        timerFinished = true;
        tryAdvance();
      }, currentStage.durationSec * 1000);
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    }

    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    };
  }, [isPlaying, currentStageIdx, isAudioEnabled]);

  // Canvas Frame Rendering for Recording & Cinematic Display
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background with gradient
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#0f172a");
      bgGradient.addColorStop(0.5, "#1e1b4b");
      bgGradient.addColorStop(1, "#020617");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient grid pattern
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Top Banner: Governance OS Presentation Studio
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(0, 0, width, 60);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
      ctx.beginPath();
      ctx.moveTo(0, 60);
      ctx.lineTo(width, 60);
      ctx.stroke();

      ctx.fillStyle = "#818cf8";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("GOVERNANCE OS • VIDEO DEMONSTRATION", 30, 36);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(`STAGE ${currentStage.id} OF ${DEMO_STAGES.length}`, width - 180, 36);

      // Main Card Container
      const cardX = 40;
      const cardY = 80;
      const cardWidth = width - 80;
      const cardHeight = height - 170;

      ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(129, 140, 248, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Title & Subtitle
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(currentStage.title, cardX + 30, cardY + 50);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px sans-serif";
      ctx.fillText(currentStage.subtitle, cardX + 30, cardY + 80);

      // Pulse indicator
      const pulseRadius = 8 + Math.sin(elapsed * 4) * 2;
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(cardX + cardWidth - 40, cardY + 45, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Key Points Box
      const boxY = cardY + 110;
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.beginPath();
      ctx.roundRect(cardX + 30, boxY, cardWidth - 60, 140, 12);
      ctx.fill();

      ctx.fillStyle = "#818cf8";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("SYSTEM ARCHITECTURE & WORKFLOW HIGHLIGHTS:", cardX + 50, boxY + 30);

      currentStage.keyPoints.forEach((point, idx) => {
        ctx.fillStyle = "#f8fafc";
        ctx.font = "15px sans-serif";
        ctx.fillText(`• ${point}`, cardX + 50, boxY + 62 + idx * 28);
      });

      // Metrics Badges
      const metricsY = boxY + 160;
      currentStage.metrics.forEach((metric, idx) => {
        const mx = cardX + 30 + idx * 240;
        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.beginPath();
        ctx.roundRect(mx, metricsY, 220, 60, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(129, 140, 248, 0.4)";
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px sans-serif";
        ctx.fillText(metric.label.toUpperCase(), mx + 16, metricsY + 22);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(metric.value, mx + 16, metricsY + 48);
      });

      // Captions Box (Bottom)
      const captionY = height - 75;
      ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
      ctx.fillRect(0, captionY, width, 75);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, captionY);
      ctx.lineTo(width, captionY);
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("VOICEOVER SUBTITLES:", 30, captionY + 24);

      ctx.fillStyle = "#f1f5f9";
      ctx.font = "15px sans-serif";
      ctx.fillText(currentStage.captionText, 30, captionY + 50);

      // Progress Line
      const progressWidth = (width * (currentStageIdx + 1)) / DEMO_STAGES.length;
      ctx.fillStyle = "#6366f1";
      ctx.fillRect(0, height - 4, progressWidth, 4);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [currentStageIdx]);

  // Record Canvas Video to Downloadable File
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    recordedChunksRef.current = [];

    const stream = canvas.captureStream(30);
    const options = { mimeType: "video/webm;codecs=vp9" };
    try {
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsPlaying(true);
      setCurrentStageIdx(0);
    } catch (err) {
      console.error("MediaRecorder error:", err);
      alert("Video recording initialized using WebM fallback.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const restartDemo = () => {
    setCurrentStageIdx(0);
    setIsPlaying(true);
  };

  return (
    <div className="page space-y-6 max-w-7xl mx-auto px-4 py-6">
      <PageHeader
        title="Video Demo Studio"
        description="Automated end-to-end demonstration tour showcasing real-time data visualization, Gemini 3.6 AI intelligence, and Pareto policy tracking."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={currentStage.routePath}
              className="button secondary text-xs flex items-center gap-1.5"
            >
              <Tv size={14} /> Open Live Screen
            </Link>
            <Link to="/" className="button primary text-xs flex items-center gap-1.5">
              Back to Overview <ArrowRight size={14} />
            </Link>
          </div>
        }
      />

      {/* Main Video Theater */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Player & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            {/* Canvas Video Renderer */}
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full aspect-video object-contain bg-slate-950"
            />

            {/* Video Overlay Control Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 text-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 sm:p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg flex items-center justify-center shrink-0"
                  title={isPlaying ? "Pause Demo" : "Play Demo"}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={restartDemo}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition shrink-0"
                  title="Restart Presentation"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition shrink-0"
                  title={isAudioEnabled ? "Mute Voiceover" : "Enable Voiceover"}
                >
                  {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-rose-400" />}
                </button>
                <span className="sm:hidden text-xs font-mono bg-slate-800/80 px-2 py-1 rounded text-slate-300">
                  {currentStageIdx + 1}/{DEMO_STAGES.length}
                </span>
              </div>

              {/* Progress Stage Tracker */}
              <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3">
                <span className="text-xs font-mono text-slate-400">
                  {currentStageIdx + 1}/{DEMO_STAGES.length}
                </span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
                  {DEMO_STAGES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setCurrentStageIdx(idx);
                        setIsPlaying(true);
                      }}
                      className={`flex-1 h-full rounded-full transition-all ${
                        idx === currentStageIdx
                          ? "bg-indigo-500 shadow-glow"
                          : idx < currentStageIdx
                          ? "bg-emerald-500/80"
                          : "bg-slate-700"
                      }`}
                      title={s.title}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
                  >
                    <Video size={14} /> Record Demo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 animate-pulse shadow-md transition"
                  >
                    <Video size={14} /> Stop Recording
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Download Recorded Video Banner */}
          {recordedVideoUrl && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-900 dark:text-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-sm">Demo Video Recorded Successfully!</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    High-definition WebM video file compiled and ready for presentation download.
                  </p>
                </div>
              </div>
              <a
                href={recordedVideoUrl}
                download="Governance_OS_Video_Demo.webm"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Download size={15} /> Download Video (.webm)
              </a>
            </div>
          )}

          {/* Current Stage Narration & Details */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge tone="violet">Stage {currentStage.id} of 9</Badge>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {currentStage.title}
                </h3>
              </div>
              <Link
                to={currentStage.routePath}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                Jump to Live Route <ChevronRight size={14} />
              </Link>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                Narrator Script:
              </strong>
              "{currentStage.scriptText}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentStage.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Workflow Stage Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Video size={16} className="text-amber-400" /> Video Demo Agenda
              </h3>
              <span className="text-xs text-slate-400">9 Stages</span>
            </div>
            <p className="text-xs text-slate-400">
              Click any stage to fast-forward the cinematic walkthrough.
            </p>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {DEMO_STAGES.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isActive = idx === currentStageIdx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setCurrentStageIdx(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <StageIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong
                        className={`text-xs font-semibold truncate ${
                          isActive
                            ? "text-indigo-900 dark:text-indigo-200"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {stage.title}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono ml-1">
                        {stage.durationSec}s
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {stage.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
