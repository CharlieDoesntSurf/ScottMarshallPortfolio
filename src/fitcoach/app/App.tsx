import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Database,
  Dumbbell,
  Flame,
  Heart,
  LayoutDashboard,
  Monitor,
  Play,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Wifi,
  BatteryFull,
  Signal,
  X,
} from "lucide-react";
import { IPhoneFrame } from "./prototype/IPhoneFrame";
import {
  emptyIntake,
  weekDays,
  schemaGroups,
  newSession,
  type Intake,
  type Session,
  type Routine,
  type Equipment,
} from "./prototype/data";
import {
  agentContract,
  previewCoach,
  type CoachPreview,
} from "./prototype/coach";
import { useDemoWorkspace } from "./prototype/useDemoWorkspace";
import { ExerciseDemo } from "./prototype/ExerciseDemo";
import { WorkoutBuilder } from "./prototype/WorkoutBuilder";
import "../styles/prototype.css";
type Page = "overview" | "workouts" | "interview" | "agent" | "database";
const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "interview", label: "Your interview", icon: Heart },
  { id: "agent", label: "Coach preview", icon: Sparkles },
  { id: "database", label: "Data blueprint", icon: Database },
] as const;
function download(name: string, value: unknown) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export default function App() {
  const mainShellRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"web" | "phone">("web");
  const [page, setPage] = useState<Page>("overview");
  const cloud = useDemoWorkspace();
  const {
    exercises,
    routines,
    sessions,
    active,
    intake,
    setActive,
    saveIntake,
  } = cloud;
  useEffect(() => {
    mainShellRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [page, view, active?.id]);
  const [draft, setDraft] = useState<Intake>(intake ?? emptyIntake);
  const [preview, setPreview] = useState<CoachPreview | null>(null);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);

  const [equipment, setEquipment] = useState("All equipment");
  useEffect(() => setVisibleCount(24), [search, equipment]);
  useEffect(() => {
    if (intake) setDraft(intake);
  }, [intake]);
  const [libraryTab, setLibraryTab] = useState<"routines" | "exercises">(
    "routines",
  );
  const [schemaIndex, setSchemaIndex] = useState(0);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const [selectedDay, setSelectedDay] = useState((today.getDay() + 6) % 7);
  const go = (p: Page) => {
    setPage(p);
    setNotice("");
    setSelectedRoutine(null);
  };
  const completedSets = sessions.reduce(
    (sum, s) => sum + s.sets.filter((s) => s.done).length,
    0,
  );
  const setField = <K extends keyof Intake>(key: K, value: Intake[K]) =>
    setDraft({ ...draft, [key]: value });
  const toggle = <T,>(list: T[], item: T) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
  const runPreview = () => {
    if (!intake) {
      go("interview");
      return;
    }
    setPreview(previewCoach(intake, exercises));
    setNotice("Preview generated locally. No API request was made.");
  };
  const start = (r: Routine) => {
    setActive(newSession(r));
    setSelectedRoutine(null);
    setNotice("");
  };
  const updateSet = (
    index: number,
    changes: Partial<Session["sets"][number]>,
  ) =>
    active &&
    setActive({
      ...active,
      sets: active.sets.map((s, i) => (i === index ? { ...s, ...changes } : s)),
    });
  const finish = () => {
    cloud.finish();
    setNotice(
      "Workout saved in this browser.",
    );
  };
  if (!cloud.ready)
    return (
      <div className="prototype-stage">
        <section className="card">
          <h1>FitCoach</h1>
          <p role="status">
            {cloud.error || "Loading the openGym exercise library…"}
          </p>
          <button className="secondary" onClick={() => location.reload()}>
            Reload demo
          </button>
        </section>
      </div>
    );
  const title = nav.find((n) => n.id === page)!.label;
  const content = (
    <div className={`fit-app ${view === "phone" ? "compact" : ""}`}>
      {view === "phone" && (
        <div className="phone-status">
          <b>9:41</b>
          <span>
            <Signal size={13} />
            <Wifi size={14} />
            <BatteryFull size={19} />
          </span>
        </div>
      )}
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("overview");
          }}
        >
          <span className="brand-icon">
            <Activity size={24} />
          </span>
          fitcoach<span className="brand-dot">.</span>
        </a>
        <div className="nav-label">YOUR SPACE</div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              aria-label={n.label}
              className={page === n.id ? "active" : ""}
              onClick={() => go(n.id)}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {n.id === "agent" && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-dot" /> DEMO WORKSPACE
          <p>
            Your next chapter
            <br />
            starts with one rep.
          </p>
          <div className="profile">
            <span>{intake?.name.charAt(0).toUpperCase() || "Y"}</span>
            <div>
              <b>{intake?.name || "Your space"}</b>
              <small>Personal fitness journal</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="main-shell" ref={mainShellRef}>
        <header className="app-header">
          <div>
            <span className="header-path">YOUR JOURNEY</span>
            <span className="header-title">{title}</span>
          </div>
          <span className="demo-chip">
            <i /> Portfolio demo
          </span>
        </header>
        <main className="main-content">
          <div
            className={`cloud-status ${cloud.error ? "error" : ""}`}
            role="status"
          >
            {cloud.error ||
              (cloud.pending
                ? `Saving ${cloud.pending} change${cloud.pending === 1 ? "" : "s"}…`
                : "Saved in this browser")}
            {cloud.error && <button onClick={cloud.retry}>Retry save</button>}
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {active ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">YOUR WORKOUT · DEMO LOG</p>
                  <h1>{active.name}</h1>
                  <p>Record what you did. Loads are in kilograms.</p>
                </div>
                <button
                  className="secondary"
                  onClick={() => {
                    setActive(null);
                    setNotice("Demo workout closed.");
                  }}
                >
                  {active.completedAt
                    ? "Close editor"
                    : "End without completing"}
                </button>
              </div>
              <div className="session-list">
                {[...new Set(active.sets.map((s) => s.exerciseId))].map(
                  (id) => {
                    const ex = exercises.find((e) => e.id === id)!;
                    return (
                      <section className="card" key={id}>
                        <h3>{ex.name}</h3>
                        <ExerciseDemo exercise={ex} />
                        <div className="set-row set-label">
                          <span>Set</span>
                          <span>
                            {ex.kind === "strength" ? "Reps" : "Seconds"}
                          </span>
                          <span>kg</span>
                          <span>RIR</span>
                          <span>Done</span>
                        </div>
                        {active.sets.map(
                          (s, index) =>
                            s.exerciseId === id && (
                              <div
                                className={`set-row ${s.done ? "set-done" : ""}`}
                                key={index}
                              >
                                <span>{s.position + 1}</span>
                                <input
                                  aria-label={`${ex.name} set ${s.position + 1} ${ex.kind === "strength" ? "reps" : "seconds"}`}
                                  type="number"
                                  min="0"
                                  max={ex.kind === "strength" ? 200 : 7200}
                                  value={
                                    ex.kind === "strength" ? s.reps : s.seconds
                                  }
                                  onChange={(e) =>
                                    updateSet(index, {
                                      [ex.kind === "strength"
                                        ? "reps"
                                        : "seconds"]: Math.max(
                                        0,
                                        Number(e.target.value),
                                      ),
                                    })
                                  }
                                />
                                <input
                                  aria-label={`${ex.name} set ${s.position + 1} kg`}
                                  type="number"
                                  min="0"
                                  max="1000"
                                  step="0.5"
                                  disabled={ex.kind !== "strength"}
                                  value={s.weightKg}
                                  onChange={(e) =>
                                    updateSet(index, {
                                      weightKg: Math.max(
                                        0,
                                        Number(e.target.value),
                                      ),
                                    })
                                  }
                                />
                                <input
                                  aria-label={`${ex.name} set ${s.position + 1} RIR`}
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={s.rir ?? ""}
                                  onChange={(e) =>
                                    updateSet(index, {
                                      rir:
                                        e.target.value === ""
                                          ? null
                                          : Math.max(
                                              0,
                                              Math.min(
                                                10,
                                                Number(e.target.value),
                                              ),
                                            ),
                                    })
                                  }
                                />
                                <button
                                  className={s.done ? "check checked" : "check"}
                                  aria-label={`${s.done ? "Unmark" : "Complete"} ${ex.name} set ${s.position + 1}`}
                                  onClick={() =>
                                    updateSet(index, { done: !s.done })
                                  }
                                >
                                  {s.done ? (
                                    <Check size={17} />
                                  ) : (
                                    <Circle size={17} />
                                  )}
                                </button>
                              </div>
                            ),
                        )}
                      </section>
                    );
                  },
                )}
              </div>
              <div className="session-footer">
                <span>
                  {active.sets.filter((s) => s.done).length} /{" "}
                  {active.sets.length} sets completed
                </span>
                <button
                  className="primary"
                  disabled={!active.sets.some((s) => s.done)}
                  onClick={finish}
                >
                  {active.completedAt ? "Save corrections" : "Finish & save"}{" "}
                  <Check size={17} />
                </button>
              </div>
            </>
          ) : page === "overview" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">MAKE ROOM FOR A STRONGER YOU</p>
                  <h1>
                    {intake
                      ? `Let's keep moving, ${intake.name}.`
                      : "Small steps. Real progress."}
                  </h1>
                  <p>Your training, your rhythm. All in one place.</p>
                </div>
                <span className="date-label">
                  {today.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="overview-grid">
                <section className="hero-card">
                  <div className="hero-copy">
                    <span className="pill">
                      <Sparkles size={13} /> BUILT AROUND YOU
                    </span>
                    <h2>
                      A plan that starts
                      <br />
                      with your story.
                    </h2>
                    <p>
                      Tell us where you are and where you want to go.
                      <br className="desktop-break" /> Let’s make your next step
                      a little clearer.
                    </p>
                    <button className="primary" onClick={() => go("interview")}>
                      {intake
                        ? "Update your interview"
                        : "Start your interview"}
                      <ArrowRight size={17} />
                    </button>
                    <small>About 2 minutes · Saved in this browser</small>
                  </div>
                  <div className="orbit-art" aria-hidden="true">
                    <div className="orbit o1" />
                    <div className="orbit o2" />
                    <div className="orbit o3" />
                    <div className="orbit-center">
                      <Activity size={48} />
                    </div>
                    <span className="orbit-spark">✦</span>
                  </div>
                </section>
                <section className="card week-card">
                  <div className="section-top">
                    <h3>Your week</h3>
                    <span className="muted">
                      {today.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div className="week-days">
                    {weekDays.map((d, i) => {
                      const date = new Date(weekStart);
                      date.setDate(date.getDate() + i);
                      return (
                        <button
                          key={d}
                          className={selectedDay === i ? "selected" : ""}
                          onClick={() => setSelectedDay(i)}
                          aria-label={`View ${d}`}
                        >
                          <span>{d[0]}</span>
                          <b>{date.getDate()}</b>
                          <i
                            className={
                              intake?.days.includes(d) ? "planned" : ""
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="week-detail">
                    <div className="icon-tile">
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <b>
                        {intake?.days.includes(weekDays[selectedDay])
                          ? "Training day"
                          : "Make space to move"}
                      </b>
                      <small>
                        {intake?.days.includes(weekDays[selectedDay])
                          ? `${intake.minutes} minutes · Choose a routine`
                          : "Your schedule starts with your interview"}
                      </small>
                    </div>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => go(intake ? "workouts" : "interview")}
                  >
                    {intake
                      ? "Explore your workouts"
                      : "Set your training days"}
                    <ArrowRight size={15} />
                  </button>
                </section>
              </div>
              <div className="stats-grid">
                {[
                  {
                    label: "Workouts logged",
                    value: sessions.length,
                    unit: "sessions",
                    icon: Dumbbell,
                    color: "pink",
                  },
                  {
                    label: "Completed sets",
                    value: completedSets,
                    unit: "sets",
                    icon: Flame,
                    color: "purple",
                  },
                  {
                    label: "Weekly intention",
                    value: intake?.days.length ?? "—",
                    unit: "days / week",
                    icon: Target,
                    color: "purple",
                  },
                ].map((s) => (
                  <section className="card stat" key={s.label}>
                    <div>
                      <p>{s.label}</p>
                      <strong>{s.value}</strong>
                      <span>{s.unit}</span>
                    </div>
                    <div className={`icon-tile ${s.color}`}>
                      <s.icon size={22} />
                    </div>
                  </section>
                ))}
              </div>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">SHOW UP FOR YOURSELF</p>
                  <h2>Your next workout</h2>
                </div>
                <button className="text-button" onClick={() => go("workouts")}>
                  Explore library <ArrowRight size={16} />
                </button>
              </div>
              <div className="bottom-grid">
                <section className="card workout-feature">
                  <div className="workout-art" aria-hidden="true">
                    <Dumbbell size={84} strokeWidth={1} />
                    <span>01 / FOUNDATIONS</span>
                  </div>
                  <div>
                    <span className="eyebrow">OPENGYM STARTER ROUTINE</span>
                    <h2>{routines[0]?.name || "Build your first workout"}</h2>
                    <p>Simple movements. A solid place to begin.</p>
                    <div className="metadata">
                      <span>
                        <Clock3 size={14} />
                        {routines[0]?.minutes || 45} min
                      </span>
                      <span>
                        <Dumbbell size={14} />
                        {routines[0]?.exerciseIds.length || 0} exercises
                      </span>
                    </div>
                    <button
                      className="secondary"
                      onClick={() => setSelectedRoutine(routines[0])}
                    >
                      View routine <ChevronRight size={16} />
                    </button>
                  </div>
                </section>
                <section className="card coach-card">
                  <div className="section-top">
                    <span className="icon-tile purple">
                      <Sparkles size={21} />
                    </span>
                    <span className="tag">PREVIEW</span>
                  </div>
                  <h3>
                    A little guidance.
                    <br />A lot of possibility.
                  </h3>
                  <p>
                    {intake
                      ? "Your interview is ready. Explore how your coach will turn your context into a draft."
                      : "Your coach starts by listening. Complete your interview to preview the experience."}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => go(intake ? "agent" : "interview")}
                  >
                    {intake ? "Meet your coach" : "Tell your story"}{" "}
                    <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <section className="card history">
                <h3>Recent activity</h3>
                {sessions.length ? (
                  sessions
                    .slice(-3)
                    .reverse()
                    .map((s) => (
                      <div key={s.id} className="history-row">
                        <Check size={18} />
                        <b>{s.name}</b>
                        <button
                          className="text-button"
                          onClick={() => cloud.edit(s)}
                        >
                          Edit workout
                        </button>
                        <span>
                          {s.sets.filter((x) => x.done).length} sets ·{" "}
                          {new Date(s.completedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                ) : (
                  <p>
                    Your story is just getting started. Your completed workouts
                    will appear here.
                  </p>
                )}
              </section>
            </>
          ) : page === "interview" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">FIRST, A LITTLE ABOUT YOU</p>
                  <h1>Let’s find your rhythm.</h1>
                  <p>
                    A brief interview to make your training feel like yours.
                  </p>
                </div>
                <span className="pill">01 / YOUR FOUNDATION</span>
              </div>
              <form
                className="interview-grid"
                onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    const result = previewCoach(draft, exercises);
                    saveIntake(draft);
                    setPreview(result);
                    setPage("agent");
                    setNotice(
                      "Interview saved in this browser. Your offline coach preview is ready.",
                    );
                  } catch (err) {
                    setNotice((err as Error).message);
                  }
                }}
              >
                <div className="card form-card">
                  <label>
                    Your first name
                    <input
                      required
                      maxLength={60}
                      placeholder="What should we call you?"
                      value={draft.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                  </label>
                  <fieldset>
                    <legend>What are you working toward?</legend>
                    <div className="option-grid">
                      {[
                        "Build strength",
                        "Build muscle",
                        "Improve fitness",
                        "Build consistency",
                      ].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          aria-pressed={draft.goal === goal}
                          className={
                            draft.goal === goal ? "option selected" : "option"
                          }
                          onClick={() => setField("goal", goal)}
                        >
                          <Target size={17} />
                          {goal}
                          {draft.goal === goal && <Check size={15} />}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    Your training experience
                    <select
                      value={draft.experience}
                      onChange={(e) => setField("experience", e.target.value)}
                    >
                      {[
                        "Getting started",
                        "Some experience",
                        "Experienced",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <fieldset>
                    <legend>Which days can you make time?</legend>
                    <div className="day-options">
                      {weekDays.map((d) => (
                        <button
                          type="button"
                          aria-pressed={draft.days.includes(d)}
                          className={draft.days.includes(d) ? "selected" : ""}
                          key={d}
                          onClick={() =>
                            setField("days", toggle(draft.days, d))
                          }
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    Time for each session{" "}
                    <span className="range-value">{draft.minutes} min</span>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      step="5"
                      value={draft.minutes}
                      onChange={(e) =>
                        setField("minutes", Number(e.target.value))
                      }
                    />
                  </label>
                  <fieldset>
                    <legend>What equipment do you have?</legend>
                    <div className="chips">
                      {(
                        [
                          "Bodyweight",
                          "Dumbbells",
                          "Barbell",
                          "Cable",
                          "Machine",
                        ] as Equipment[]
                      ).map((v) => (
                        <button
                          type="button"
                          className={
                            draft.equipment.includes(v) ? "selected" : ""
                          }
                          aria-pressed={draft.equipment.includes(v)}
                          key={v}
                          onClick={() =>
                            setField("equipment", toggle(draft.equipment, v))
                          }
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    Any limitations or movements to avoid?{" "}
                    <small>Optional</small>
                    <textarea
                      maxLength={1500}
                      placeholder="Anything you want your coach to take into account…"
                      value={draft.limitations}
                      onChange={(e) => setField("limitations", e.target.value)}
                    />
                  </label>
                  <label>
                    What’s your personal “why”? <small>Optional</small>
                    <textarea
                      maxLength={2000}
                      placeholder="I want to feel stronger for…"
                      value={draft.motivation}
                      onChange={(e) => setField("motivation", e.target.value)}
                    />
                  </label>
                  <button className="primary" type="submit">
                    Save & preview my coach <ArrowRight size={17} />
                  </button>
                </div>
                <aside className="card interview-aside">
                  <span className="icon-tile pink">
                    <Heart size={24} />
                  </span>
                  <h2>
                    Your goals.
                    <br />
                    Your starting point.
                  </h2>
                  <p>
                    There’s no perfect answer. A plan you can show up for is a
                    good place to start.
                  </p>
                  <hr />
                  <h4>What happens next</h4>
                  <ol>
                    <li>Save your interview on this browser.</li>
                    <li>Review a sample coach response.</li>
                    <li>Shape the experience before connecting AI.</li>
                  </ol>
                  <div className="small-note">
                    <ShieldCheck size={18} />
                    <span>
                      Nothing is sent to a model or database in this prototype.
                    </span>
                  </div>
                </aside>
              </form>
            </>
          ) : page === "workouts" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">BUILD YOUR PRACTICE</p>
                  <h1>A little stronger, every day.</h1>
                  <p>
                    Build your own workout or explore the complete openGym
                    exercise library.
                  </p>
                </div>
                <span className="pill">{exercises.length} EXERCISES</span>
              </div>
              <WorkoutBuilder
                exercises={exercises}
                onSaved={cloud.refreshCatalog}
              />
              <div className="library-toolbar">
                <div className="segmented">
                  <button
                    className={libraryTab === "routines" ? "selected" : ""}
                    onClick={() => setLibraryTab("routines")}
                  >
                    Routines
                  </button>
                  <button
                    className={libraryTab === "exercises" ? "selected" : ""}
                    onClick={() => setLibraryTab("exercises")}
                  >
                    Exercises
                  </button>
                </div>
                <label className="search">
                  <Search size={18} />
                  <input
                    aria-label="Search library"
                    placeholder="Find your next movement"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                {libraryTab === "exercises" && (
                  <select
                    aria-label="Filter equipment"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                  >
                    {[
                      "All equipment",
                      ...new Set(exercises.map((e) => e.equipment).sort()),
                    ].map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                )}
              </div>
              {libraryTab === "routines" ? (
                <div className="routine-grid">
                  {routines
                    .filter((r) =>
                      r.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((r, i) => (
                      <button
                        className={`card routine-card ${r.color}`}
                        key={r.id}
                        onClick={() => setSelectedRoutine(r)}
                      >
                        <div className="routine-art">
                          <Dumbbell size={65} strokeWidth={1} />
                          <span>{String(i + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="routine-copy">
                          <span className="eyebrow">{r.focus}</span>
                          <h3>{r.name}</h3>
                          <p>{r.subtitle}</p>
                          <div className="metadata">
                            <span>
                              <Clock3 size={14} />
                              {r.minutes} min
                            </span>
                            <span>{r.exerciseIds.length} exercises</span>
                            <ArrowRight size={17} />
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="exercise-grid">
                  {exercises
                    .filter(
                      (e) =>
                        `${e.name} ${e.muscle}`
                          .toLowerCase()
                          .includes(search.toLowerCase()) &&
                        (equipment === "All equipment" ||
                          e.equipment === equipment),
                    )
                    .slice(0, visibleCount)
                    .map((e) => (
                      <article className="card exercise-card" key={e.id}>
                        <span className="icon-tile">
                          <Dumbbell size={21} />
                        </span>
                        <div>
                          <h3>{e.name}</h3>
                          <span className="muted">
                            {e.muscle} · {e.equipment}
                          </span>
                          <ExerciseDemo exercise={e} compact />
                        </div>
                      </article>
                    ))}
                </div>
              )}
              {libraryTab === "exercises" &&
                visibleCount <
                  exercises.filter(
                    (e) =>
                      `${e.name} ${e.muscle}`
                        .toLowerCase()
                        .includes(search.toLowerCase()) &&
                      (equipment === "All equipment" ||
                        e.equipment === equipment),
                  ).length && (
                  <button
                    className="secondary"
                    onClick={() => setVisibleCount((n) => n + 24)}
                  >
                    Show more exercises
                  </button>
                )}
              {(libraryTab === "routines"
                ? !routines.some((r) =>
                    r.name.toLowerCase().includes(search.toLowerCase()),
                  )
                : !exercises.some(
                    (e) =>
                      `${e.name} ${e.muscle}`
                        .toLowerCase()
                        .includes(search.toLowerCase()) &&
                      (equipment === "All equipment" ||
                        e.equipment === equipment),
                  )) && (
                <div className="card empty">
                  No matches. Try a different search or equipment filter.
                </div>
              )}
            </>
          ) : page === "agent" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">
                    LISTEN → UNDERSTAND → SUGGEST → REVIEW
                  </p>
                  <h1>Meet your future coach.</h1>
                  <p>
                    A transparent rehearsal of the agent, before connecting a
                    model.
                  </p>
                </div>
                <span className="pill">
                  <span className="local-dot" /> OFFLINE
                </span>
              </div>
              <div className="agent-grid">
                <section className="card">
                  <div className="section-top">
                    <span className="icon-tile purple">
                      <Sparkles size={22} />
                    </span>
                    <span className="tag">LOCAL RULES · NO MODEL</span>
                  </div>
                  <h2>A starting point, together.</h2>
                  {intake ? (
                    <>
                      <p>
                        Using {intake.name}’s interview:{" "}
                        {intake.goal.toLowerCase()}, {intake.days.length} days a
                        week, {intake.minutes} minutes.
                      </p>
                      <button className="primary" onClick={runPreview}>
                        {preview ? "Run preview again" : "Run offline preview"}
                        <Play size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Your coach needs a little context first.</p>
                      <button
                        className="primary"
                        onClick={() => go("interview")}
                      >
                        Start your interview <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                  {preview && (
                    <div className="coach-result" aria-live="polite">
                      <span className="eyebrow">
                        {preview.status === "needs-review"
                          ? "NEEDS YOUR REVIEW"
                          : "DRAFT RESPONSE"}
                      </span>
                      <h3>{preview.summary}</h3>
                      {preview.exerciseIds.map((id) => (
                        <div className="preview-exercise" key={id}>
                          <Dumbbell size={17} />
                          {exercises.find((e) => e.id === id)?.name}
                        </div>
                      ))}
                      <h4>Let’s clarify</h4>
                      {preview.questions.map((q) => (
                        <p key={q}>{q}</p>
                      ))}
                      <h4>Assumptions</h4>
                      <ul>
                        {preview.assumptions.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                      <button
                        className="secondary"
                        onClick={() =>
                          download("fittrack-coach-preview.json", {
                            interview: intake,
                            result: preview,
                            contract: agentContract,
                          })
                        }
                      >
                        <ArrowDownToLine size={16} /> Export review packet
                      </button>
                    </div>
                  )}
                </section>
                <section className="card">
                  <p className="eyebrow">AGENT CONTRACT · V1</p>
                  <h2>Designed to be reviewable.</h2>
                  <div className="contract-step">
                    <span>01</span>
                    <div>
                      <h4>Read your context</h4>
                      <p>
                        Versioned interview answers and a known exercise
                        catalog.
                      </p>
                    </div>
                  </div>
                  <div className="contract-step">
                    <span>02</span>
                    <div>
                      <h4>Suggest, with boundaries</h4>
                      <p>
                        Equipment-aware exercise IDs. Explicit assumptions.
                        Limitations prompt a review.
                      </p>
                    </div>
                  </div>
                  <div className="contract-step">
                    <span>03</span>
                    <div>
                      <h4>Keep you in the loop</h4>
                      <p>
                        A draft for review. No automatic plan changes or
                        database writes.
                      </p>
                    </div>
                  </div>
                  <details>
                    <summary>Inspect the proposed instructions</summary>
                    <p>{agentContract.instructions}</p>
                  </details>
                  <div className="small-note">
                    <ShieldCheck size={19} />
                    <span>
                      Model selection and live API evaluation are still pending.
                      This preview does not assess model quality.
                    </span>
                  </div>
                </section>
              </div>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">THE DEVELOPMENT BLUEPRINT</p>
                  <h1>A home for every rep.</h1>
                  <p>Portfolio demo · browser storage. Connected app · Supabase.</p>
                </div>
                <span className="pill">IN DEVELOPMENT</span>
              </div>
              <section className="card database-intro">
                <Database size={28} />
                <div>
                  <h3>One backend. Web today, iOS next.</h3>
                  <p>
                    The connected development app uses the existing <code>public</code> workout
                    tables. The complete openGym catalog also replaces the
                    existing <code>exercise_liss</code> catalog. Manual workouts
                    and custom exercises work without the coach.
                  </p>
                  <code>rsyeiwzoijdojbawpgrd</code>
                </div>
              </section>
              <div className="schema-flow">
                {schemaGroups.map((g, i) => (
                  <button
                    className={schemaIndex === i ? "selected" : ""}
                    key={g.name}
                    onClick={() => setSchemaIndex(i)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <b>{g.name}</b>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
              <section className="card">
                <div className="section-top">
                  <h2>{schemaGroups[schemaIndex].name}</h2>
                  <span className="tag">DEVELOPMENT TABLES</span>
                </div>
                <div className="schema-tables">
                  {schemaGroups[schemaIndex].tables.map(([table, desc]) => (
                    <div key={table}>
                      <code>{table}</code>
                      <p>{desc}</p>
                    </div>
                  ))}
                </div>
              </section>
              <div className="two-columns">
                <section className="card">
                  <h3>Edit before, during and after</h3>
                  <p>
                    Templates, scheduled targets and actual sessions are
                    separate. Edit one occurrence or future workouts explicitly.
                    Corrections to completed sets update progress graphs and
                    personal records.
                  </p>
                </section>
                <section className="card">
                  <h3>The openGym foundation</h3>
                  <p>
                    Adopt the 1,324-exercise catalog, instructions, starter
                    plans, calendar, guided training, history and progress
                    features. Users can also create private custom exercises.
                    This demo loads public upstream exercise images and animations. Calendar and progress features remain on the
                    implementation roadmap.
                  </p>
                </section>
              </div>
              <section className="card local-data-tools">
                <h3>Your workspace backup</h3>
                <p>Export your current workouts and any pending changes.</p>
                <button
                  className="secondary"
                  onClick={() =>
                    download("fittrack-workspace.json", {
                      intake,
                      sessions,
                      active,
                      pending: JSON.parse(
                        localStorage.getItem("fitcoach.portfolio.pending") ||
                          "[]",
                      ),
                    })
                  }
                >
                  Export workspace
                </button>
              </section>
              <p className="muted">
                Portfolio demo. Authentication and the OpenAI
                connection are deferred. All preserved openGym source files and
                guides are available in Supabase; importing source does not
                activate every feature.
              </p>
            </>
          )}
        </main>
        <footer className="app-footer">
          <span>FITCOACH · A LITTLE BETTER, EVERY DAY.</span>
          <span>Browser-saved demo · In Dev</span>
        </footer>
      </div>
      <nav className="mobile-nav">
        {nav.map((n) => (
          <button
            key={n.id}
            className={page === n.id ? "active" : ""}
            aria-label={n.label}
            onClick={() => go(n.id)}
          >
            <n.icon size={19} />
            <span>
              {n.id === "interview"
                ? "Interview"
                : n.id === "database"
                  ? "Blueprint"
                  : n.id === "agent"
                    ? "Coach"
                    : n.label}
            </span>
          </button>
        ))}
      </nav>
      {selectedRoutine && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedRoutine(null)}
        >
          <section
            className="routine-modal card"
            role="dialog"
            aria-modal="true"
            aria-label={selectedRoutine.name}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelectedRoutine(null);
              if (e.key === "Tab") {
                const buttons =
                  e.currentTarget.querySelectorAll<HTMLButtonElement>("button");
                const first = buttons[0],
                  last = buttons[buttons.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-top">
              <span className="eyebrow">OPENGYM STARTER ROUTINE</span>
              <button
                autoFocus
                aria-label="Close routine"
                onClick={() => setSelectedRoutine(null)}
              >
                <X size={21} />
              </button>
            </div>
            <h2>{selectedRoutine.name}</h2>
            <p>{selectedRoutine.subtitle}</p>
            <div className="metadata">
              <span>
                <Clock3 size={15} />
                {selectedRoutine.minutes} min
              </span>
              <span>
                {selectedRoutine.targets?.reduce((n, t) => n + t.sets, 0) ||
                  selectedRoutine.exerciseIds.length * 3}{" "}
                sets
              </span>
            </div>
            {selectedRoutine.exerciseIds.map((id, i) => {
              const ex = exercises.find((e) => e.id === id)!;
              return (
                <div className="routine-detail" key={id}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <b>{ex.name}</b>
                    <p>
                      {ex.equipment} ·{" "}
                      {selectedRoutine.targets?.find((t) => t.exerciseId === id)
                        ?.sets || 3}{" "}
                      sets ·{" "}
                      {selectedRoutine.targets?.find((t) => t.exerciseId === id)
                        ?.reps || 10}{" "}
                      reps
                    </p>
                  </div>
                </div>
              );
            })}
            <p className="muted">
              Example targets only. Adjust each set to record your actual
              workout.
            </p>
            <button className="primary" onClick={() => start(selectedRoutine)}>
              Start workout <Play size={16} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
  return (
    <div className={`prototype-stage ${view}`}>
      <div className="demo-disclosure">Interactive development demo · Your entries stay in this browser · AI is off</div>
      <div className="preview-toolbar">
        <div>
          <Activity size={18} />
          <b>FitCoach</b>
          <span>DESIGN PREVIEW</span>
        </div>
        <div className="view-switch" aria-label="Preview mode">
          <button
            aria-pressed={view === "web"}
            className={view === "web" ? "selected" : ""}
            onClick={() => setView("web")}
          >
            <Monitor size={15} />
            Web view
          </button>
          <button
            aria-pressed={view === "phone"}
            className={view === "phone" ? "selected" : ""}
            onClick={() => setView("phone")}
          >
            <Smartphone size={15} />
            Phone view
          </button>
        </div>
        <span className="toolbar-status">
          <span className="local-dot" /> IN DEV
        </span>
      </div>
      {view === "phone" ? (
        <div className="phone-stage">
          <div className="phone-caption">
            <span className="eyebrow">YOUR ROUTINE, IN YOUR POCKET</span>
            <h2>Built to move with you.</h2>
            <p>Same workspace. A little more portable.</p>
          </div>
          <IPhoneFrame>{content}</IPhoneFrame>
          <p className="phone-footnote">
            iPhone frame from your community template · Web preview
          </p>
        </div>
      ) : (
        content
      )}
      <footer className="demo-attribution">Exercise data and templates: <a href="https://github.com/DuarteSantos8/openGym" target="_blank" rel="noreferrer">openGym</a> · <a href="./legal/NOTICE.md" target="_blank" rel="noreferrer">Attribution & media notices</a> · <a href="./source.zip">Demo source</a></footer>
    </div>
  );
}
