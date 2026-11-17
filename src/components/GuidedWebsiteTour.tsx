import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MousePointer2, Pause, Play, Volume2, VolumeX } from "lucide-react";

export type WebsiteTourAction = (
  | { label: string; selector: string; kind: "click" }
  | { label: string; selector: string; kind: "select"; optionIndex: number }
  | { label: string; selector: string; kind: "range"; value: string }
) & { revealSelector?: string };

export interface WebsiteTourStep {
  narration: string;
  action?: WebsiteTourAction;
  focusSelector?: string;
}

export interface WebsiteTourStage {
  kind?: "intro" | "outro";
  title: string;
  path: string;
  headline?: string;
  subhead?: string;
  steps: readonly WebsiteTourStep[];
}

interface GuidedWebsiteTourProps {
  stages: readonly WebsiteTourStage[];
  siteName: string;
  language?: string;
}

const stepSeconds = (step: WebsiteTourStep) => Math.max(4, Math.ceil(step.narration.length / 13) + (step.action ? 2 : 0));

function performAction(element: Element, action: WebsiteTourAction) {
  const EventCtor = element.ownerDocument.defaultView?.Event ?? Event;
  if (action.kind === "click") {
    (element as HTMLElement).click();
  } else if (action.kind === "select" && element.tagName === "SELECT") {
    const select = element as HTMLSelectElement;
    const option = select.options[action.optionIndex];
    if (option) {
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(select), "value")?.set?.call(select, option.value);
      select.dispatchEvent(new EventCtor("change", { bubbles: true }));
    }
  } else if (action.kind === "range" && element.tagName === "INPUT") {
    const input = element as HTMLInputElement;
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set?.call(input, action.value);
    input.dispatchEvent(new EventCtor("input", { bubbles: true }));
    input.dispatchEvent(new EventCtor("change", { bubbles: true }));
  }
}

export function GuidedWebsiteTour({ stages, siteName, language = "en-US" }: GuidedWebsiteTourProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenReady, setIsScreenReady] = useState(false);
  const [frameSrc, setFrameSrc] = useState(stages[0]?.path ?? "/");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number; label: string; clicking: boolean } | null>(null);
  const [tourError, setTourError] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const completedActions = useRef(new Set<string>());
  const stage = stages[stageIndex];
  const step = stage?.steps[stepIndex];
  const totalSteps = stages.reduce((sum, item) => sum + item.steps.length, 0);
  const completedSteps = stages.slice(0, stageIndex).reduce((sum, item) => sum + item.steps.length, 0) + stepIndex + 1;
  const totalMinutes = Math.round(stages.reduce((sum, item) => sum + item.steps.reduce((time, part) => time + stepSeconds(part), 0), 0) / 60);
  const outcomeIndex = stages.findIndex((item) => item.path === "/decision-brief" && !item.kind);

  const activateStage = useCallback((index: number) => {
    const nextPath = stages[index]?.path;
    if (!nextPath) return;
    let currentFramePath: string | undefined;
    try { currentFramePath = frameRef.current?.contentWindow?.location.pathname; } catch { /* The iframe may still be navigating. */ }
    if (currentFramePath !== nextPath) {
      setIsScreenReady(false);
      setFrameSrc(nextPath);
    }
    setStageIndex(index);
  }, [stages]);

  useEffect(() => {
    if (!isPlaying || !isScreenReady || !stage || !step) return;
    let cancelled = false;
    let timeReady = false;
    let voiceReady = isMuted || !("speechSynthesis" in window);
    const actionKey = `${stageIndex}:${stepIndex}`;
    let actionReady = !step.action || completedActions.current.has(actionKey);
    const timers: number[] = [];
    const schedule = (callback: () => void, ms: number) => timers.push(window.setTimeout(callback, ms));
    const advance = () => {
      if (cancelled || !timeReady || !voiceReady || !actionReady) return;
      if (stepIndex + 1 < stage.steps.length) setStepIndex(stepIndex + 1);
      else if (stageIndex + 1 < stages.length) {
        setStepIndex(0);
        activateStage(stageIndex + 1);
      } else {
        setIsPlaying(false);
        setHasCompleted(true);
      }
    };

    const focus = step.focusSelector ? frameRef.current?.contentDocument?.querySelector(step.focusSelector) : null;
    focus?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (step.action && !actionReady) {
      const action = step.action;
      schedule(() => {
        const element = frameRef.current?.contentDocument?.querySelector(action.selector);
        if (!element) {
          setTourError(`The “${action.label}” control did not load. Continuing at the next screen.`);
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
          schedule(() => {
            setTourError(null);
            if (stageIndex + 1 < stages.length) {
              setStepIndex(0);
              activateStage(stageIndex + 1);
            } else {
              setIsPlaying(false);
              setHasCompleted(true);
            }
          }, 2500);
          return;
        }
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        schedule(() => {
          const rect = element.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          setCursor({ x, y, label: action.label, clicking: false });
          schedule(() => {
            setCursor({ x, y, label: action.label, clicking: true });
            performAction(element, action);
            completedActions.current.add(actionKey);
            schedule(() => {
              const reveal = action.revealSelector ? frameRef.current?.contentDocument?.querySelector(action.revealSelector) : null;
              reveal?.scrollIntoView({ behavior: "smooth", block: "center" });
              setCursor(null);
              actionReady = true;
              advance();
            }, 1250);
          }, 550);
        }, 700);
      }, 500);
    }

    const duration = stepSeconds(step);
    schedule(() => { timeReady = true; advance(); }, duration * 1000);
    schedule(() => { voiceReady = true; advance(); }, (duration + 8) * 1000);
    if (!voiceReady) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(step.narration);
      utterance.lang = language;
      utterance.rate = 0.92;
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === language.toLowerCase())
        ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()))
        ?? null;
      utterance.onend = utterance.onerror = () => { voiceReady = true; advance(); };
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      setCursor(null);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [stage, step, stageIndex, stepIndex, stages, isPlaying, isMuted, isScreenReady, language, activateStage]);

  if (!stage || !step) return null;
  const chooseStage = (index: number) => {
    setTourError(null);
    completedActions.current.clear();
    activateStage(index);
    setStepIndex(0);
    setHasCompleted(false);
    setHasStarted(true);
    setIsPlaying(true);
  };
  const togglePlayback = () => {
    if (hasCompleted) chooseStage(0);
    else { setTourError(null); setHasStarted(true); setIsPlaying((playing) => !playing); }
  };
  const playbackStatus = hasCompleted ? "Tour complete" : isPlaying
    ? isScreenReady ? "Playing · advances automatically" : "Playing · loading next screen"
    : hasStarted ? "Paused · press Resume to continue" : "Ready to play";

  return (
    <section className="tour-shell" aria-label={`${siteName} guided tour`}>
      <header className="tour-topbar">
        <div className="tour-topbar-title"><strong>{siteName}</strong><span>Guided website tour · about {totalMinutes} min</span></div>
        <div className="tour-topbar-actions">
          <label className="tour-chapter-picker"><span className="sr-only">Choose chapter</span><select value={stageIndex} onChange={(event) => chooseStage(Number(event.target.value))}>{stages.map((item, index) => <option key={`${item.path}-${item.title}`} value={index}>{index + 1}. {item.title}</option>)}</select></label>
          {outcomeIndex >= 0 && stageIndex < outcomeIndex && <button type="button" className="tour-skip" onClick={() => chooseStage(outcomeIndex)}>Jump to outcome</button>}
          <Link to="/" className="tour-exit">Exit tour</Link>
        </div>
      </header>
      <div className="tour-viewport">
        <iframe ref={frameRef} src={frameSrc} title={`${stage.title} — live ${siteName} screen`} className={`tour-screen${isPlaying ? " is-playing" : ""}`} loading="eager" onLoad={() => setIsScreenReady(true)} />
        {!isScreenReady && <div className="tour-loading" role="status">Loading the website…</div>}
        {cursor && <div className={`tour-cursor${cursor.clicking ? " is-clicking" : ""}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true"><MousePointer2 size={25} fill="white" /><span>{cursor.label}</span></div>}
        {isScreenReady && stage.kind && <div className={`tour-start-overlay tour-${stage.kind}-card`}><div><span>{stage.kind === "intro" ? `${siteName} · about ${totalMinutes} minutes` : "The journey is complete"}</span><h2>{stage.headline ?? stage.title}</h2>{stage.subhead && <p>{stage.subhead}</p>}{stage.kind === "outro" && hasCompleted && <div className="tour-end-actions"><Link to="/decision-brief" className="button primary">Open decision brief</Link><Link to="/bills" className="button secondary">Explore sample bills</Link></div>}</div></div>}
      </div>
      <div className="tour-bottom">
        <div className="tour-progress" role="progressbar" aria-label="Tour progress" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={completedSteps}><span style={{ width: `${(completedSteps / totalSteps) * 100}%` }} /></div>
        <div className="tour-bottom-content">
          <div className="tour-caption"><div className="tour-caption-meta"><span className="tour-step">Chapter {stageIndex + 1} of {stages.length} · Step {stepIndex + 1} of {stage.steps.length}</span><span className={`tour-playback-status${isPlaying ? " is-playing" : ""}`} role="status"><span className="tour-playback-dot" aria-hidden="true" />{playbackStatus}</span></div><h1>{stage.title}</h1><p aria-live="polite" aria-atomic="true">{tourError ?? step.narration}</p></div>
          <div className="tour-controls" aria-label="Tour controls"><button type="button" className="button primary" onClick={togglePlayback} aria-label={isPlaying ? "Pause tour" : hasCompleted ? "Replay tour" : "Play tour"}>{isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}{isPlaying ? "Pause" : hasCompleted ? "Replay" : stageIndex === 0 ? "Play tour" : "Resume"}</button><button type="button" className="tour-control-button" onClick={() => setIsMuted((muted) => !muted)} aria-label={isMuted ? "Turn narration on" : "Mute narration"}>{isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><Link to={stage.path} className="tour-open-page">Open page</Link></div>
        </div>
      </div>
    </section>
  );
}
