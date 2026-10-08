import { useState } from "react";
import type { Exercise } from "./data";
export function ExerciseDemo({
  exercise: e,
  compact = false,
}: {
  exercise: Exercise;
  compact?: boolean;
}) {
  const [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  return (
    <div className={`exercise-demo ${compact ? "small" : ""}`}>
      {e.image && !failed ? (
        <div className="demo-frame">
          <img
            src={playing && e.animation ? e.animation : e.image}
            alt={`${e.name} form demonstration`}
            loading="lazy"
            onError={() => setFailed(true)}
          />
          {e.animation && (
            <button
              className="demo-toggle"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? "Pause demo" : "Play demo"}
            </button>
          )}
        </div>
      ) : (
        <p className="muted">
          {failed
            ? "Demo could not load. Form instructions remain available."
            : "Custom exercise · add your own form instructions"}
        </p>
      )}
      <div className="metadata">
        <span>{e.muscle}</span>
        <span>{e.equipment}</span>
      </div>
      <details>
        <summary>Form & instructions</summary>
        <ol>
          {(e.instructions || [e.cue]).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {e.secondaryMuscles?.length ? (
          <p className="muted">Also works: {e.secondaryMuscles.join(", ")}</p>
        ) : null}
      </details>
    </div>
  );
}
