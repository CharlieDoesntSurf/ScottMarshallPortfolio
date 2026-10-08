import { useState } from "react";
import type { Exercise } from "./data";
import { api } from "./useDemoWorkspace";
export function WorkoutBuilder({
  exercises,
  onSaved,
}: {
  exercises: Exercise[];
  onSaved: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [custom, setCustom] = useState(false),
    [name, setName] = useState(""),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<string[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <section className="card builder">
      <div className="section-top">
        <div>
          <h3>Your workout, your way.</h3>
          <p>Choose from the catalog or add a custom exercise.</p>
        </div>
        <button className="secondary" onClick={() => setOpen(!open)}>
          {open ? "Close builder" : "Create workout"}
        </button>
      </div>
      {message && <p role="status">{message}</p>}
      {open && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await api("workout", { name, exerciseIds: selected });
              await onSaved();
              setOpen(false);
              setSelected([]);
              setName("");
              setMessage(
                "Workout saved in this browser. Open it below to set your targets.",
              );
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Workout name
            <input
              aria-label="Workout name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
            />
          </label>
          <label>
            Find exercises
            <input
              aria-label="Find exercises for workout"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all exercises"
            />
          </label>
          <div className="builder-choices">
            {exercises
              .filter((e) =>
                `${e.name} ${e.muscle}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .slice(0, 15)
              .map((e) => (
                <button
                  type="button"
                  className={selected.includes(e.id) ? "chosen" : ""}
                  key={e.id}
                  onClick={() =>
                    setSelected((s) =>
                      s.includes(e.id)
                        ? s.filter((id) => id !== e.id)
                        : [...s, e.id],
                    )
                  }
                >
                  {selected.includes(e.id) ? "✓ " : "+ "}
                  {e.name}
                </button>
              ))}
          </div>
          <p>{selected.length} selected</p>
          <div className="chips">
            {selected.map((id) => (
              <button
                type="button"
                key={id}
                onClick={() => setSelected((s) => s.filter((x) => x !== id))}
              >
                {exercises.find((e) => e.id === id)?.name} ×
              </button>
            ))}
          </div>
          <button className="primary" disabled={busy || !selected.length}>
            {busy ? "Saving…" : "Save workout"}
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
      <button className="text-button" onClick={() => setCustom(!custom)}>
        {custom ? "Close custom exercise" : "Create a new exercise"}
      </button>
      {custom && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const form = e.currentTarget;
            const values = new FormData(form);
            try {
              await api("exercise", {
                name: values.get("name"),
                muscle: values.get("muscle"),
                equipment: values.get("equipment"),
                kind: values.get("kind"),
                instructions: String(values.get("instructions"))
                  .split("\n")
                  .filter(Boolean),
              });
              await onSaved();
              setCustom(false);
              setMessage(
                "Custom exercise saved. It is now available in your catalog.",
              );
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Exercise name
            <input name="name" required maxLength={200} />
          </label>
          <label>
            Target muscle
            <input name="muscle" required maxLength={100} />
          </label>
          <label>
            Equipment
            <input name="equipment" required maxLength={100} />
          </label>
          <label>
            Tracking
            <select name="kind">
              <option value="strength">Reps and weight</option>
              <option value="timed">Time</option>
              <option value="cardio">Cardio time</option>
            </select>
          </label>
          <label>
            Form instructions
            <textarea
              name="instructions"
              placeholder="One step per line"
              maxLength={10000}
            />
          </label>
          <button className="primary" disabled={busy}>
            {busy ? "Saving…" : "Save exercise"}
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
    </section>
  );
}
