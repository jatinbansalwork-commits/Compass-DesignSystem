# `ResizableSplit` — Component Spec

Portable reference for rebuilding or porting `ResizableSplit` into another design system.
Covers purpose, prompt, style, dimensions, props, and use cases in one place.

**Source:** `packages/compass/src/components/ResizableSplit/`

---

## 0. Cursor prompt — paste this as-is

Copy everything inside the fence below into Cursor as one prompt. Everything after
this section (§1–§7) is reference material the prompt links out to — Cursor should read
it, not re-derive it.

````
I'm porting a component called `ResizableSplit` from the Compass design system into this
codebase. Full spec, prompt-level build instructions, dimensions, color tokens, props, use
cases, and known limitations are in this file: `ResizableSplit-component-spec.md`
(pasted/attached alongside this message). Read it in full before writing any code.

STEP 1 — Discover before building (do this first, report back, then stop and wait for me):
- Find this codebase's existing equivalent of a resizable split/panel layout (a two-pane
  layout with a draggable divider) — a library (`react-resizable-panels`, `allotment`,
  PrimeReact's `Splitter`, etc.) or a hand-rolled one. If one already exists, tell me
  whether we're replacing it, wrapping it, or building a new one alongside it — don't
  assume "build from scratch" if something usable is already there.
- Find this codebase's pointer-drag precedent, if any (anything using `setPointerCapture`,
  or a drag library). The spec's handle (§2) is built on raw `PointerEvent` +
  `setPointerCapture` with no external drag library — confirm whether that's appropriate
  here or whether this codebase already has a drag utility/library you should use instead.
- Find this codebase's design tokens (or equivalent: theme object, CSS variables, Tailwind
  config) for: border/divider colors, primary/accent color (for the active-drag state),
  border radius, spacing scale, and motion/transition durations. Map Compass's token names
  (listed in §4 of the spec) to this codebase's nearest equivalents and show me the mapping
  before using it.
- Report back what you found. Do not write component code yet.

STEP 2 — Once I confirm the mapping, build the component scoped to ONLY this one concern
(don't also touch unrelated layout components or refactor other things you notice along
the way):
- A `ResizableSplit` container + `ResizableSplitPane` compound children (exactly two:
  first = "start" pane that flexes to fill space, second = "end" pane whose width is
  controlled), per §1/§5 of the spec.
- Match the dimensions in §3 and the token mapping from Step 1.
- Implement all props listed in §5 exactly as specified (names, types, defaults) — this is
  a controlled-width component (`width` + `onWidthChange`), not self-persisting; the
  consumer owns storing the value.
- Mouse drag via `pointerdown`/`pointermove`/`pointerup` + `setPointerCapture` (unifies
  mouse and touch in one code path — see §2 for why), plus full keyboard support:
  ArrowLeft/ArrowRight step by `step` px, Home/End jump to min/max, Enter/double-click
  resets to the responsive default. Use the W3C APG "window splitter" pattern:
  `role="separator"`, `aria-orientation="horizontal"` (a side-by-side split is horizontal
  on the *value axis*, even though some APG prose confusingly calls it a "vertical
  splitter" visually — see decisions.md note in §7 if this codebase's own precedent
  disagrees, flag it rather than silently picking one).
- `aria-valuenow`/`valuemin`/`valuemax` are a normalized 0–100 scale (not raw pixels) per
  the APG convention — only the ARIA attributes are normalized; the public `width` prop
  API stays in real pixels throughout.
- Ship the "documented today" use cases in §6 as actual examples/stories/demos in
  whatever pattern this codebase uses for component examples.

Decisions already made for you (don't re-ask, just follow):
- No vertical (top/bottom) orientation — horizontal/side-by-side only, out of scope for
  this port (see §7, limitation #1).
- No RTL handling — ArrowLeft always shrinks the end pane regardless of text direction,
  matching the Compass original; out of scope for this port (see §7, limitation #2).
- If this is a cross-platform (web + native) codebase: native gets a non-resizable
  vertical stack of both panes as a fallback, not a ported drag gesture — building a
  native drag gesture is real, separate scope (see §7, limitation #3).
- The "primary pane" for Home/End keyboard shortcuts is the **start** pane (Home gives it
  its smallest size, i.e. the end pane its largest) — this assumes the start pane is the
  main content and the end pane is the auxiliary adjustable one. Flag me directly if this
  port's actual use case has it reversed (end pane is the main content) rather than
  guessing.

Deliverables — when done, tell me:
1. The token mapping you used (Compass token → this codebase's token), as a table.
2. What this codebase already had for split-panels/pointer-drag (from Step 1) and how your
   implementation relates to it (replaced / wrapped / new).
3. Any place the local styling/interaction system genuinely couldn't replicate a
   dimension/behavior from §3/§4 exactly, and what you did instead.
4. File paths of everything you created or changed.

If you hit a genuine open question not covered above (something needing a product/business
decision, not an implementation detail) — stop and ask me directly rather than guessing.
````

---

## 1. Purpose

A two-pane layout with a draggable (mouse + touch) and keyboard-resizable divider between
a "start" pane (flexes to fill remaining space) and an "end" pane (explicit pixel width,
clamped to min widths). Used for split views like a document viewer next to a form, or a
scrollable list next to a map. Replaces hand-rolled split logic and third-party splitters
with one controlled-width primitive.

---

## 2. Build notes (the "how", narrative form)

- **Controlled, not self-persisting.** `width: number | null` + `onWidthChange` — the
  consumer owns storing the value (e.g. `localStorage`). `onResizeEnd` fires once per
  drag/keyboard interaction, separate from `onWidthChange` (which fires continuously
  during a drag so the pane visually tracks the pointer) — this is the consumer's "persist
  now" hook.
- **`width: null` means "use the responsive default,"** computed from the container's
  current width via `computeDefaultWidth` (default: flat 40%). Tracked through a
  `ResizeObserver`, so it reacts to the container resizing, not just the window.
  Double-click or Enter on the handle calls `onWidthChange(null)` directly.
- **Clamping:** `clamp(width, minEndWidth, containerWidth - minStartWidth - handleWidth)`
  — the `- handleWidth` term matters: without it, the start pane could drop below its own
  minimum purely because the handle's own width ate the remaining space.
- **Drag mechanics:** raw `PointerEvent` + `setPointerCapture` (not `window`-level
  `pointermove`/`pointerup` listeners) — this keeps the drag tracking even if the pointer
  leaves the handle's bounds mid-drag, and unifies mouse + touch in one code path. The new
  width on each move is computed as `(container's right edge) - pointerClientX` — an
  absolute position, not a running delta off the previous value.
- **Keyboard (W3C APG "window splitter" pattern):** `role="separator"`,
  `aria-orientation="horizontal"` for a side-by-side split (the orientation attribute
  describes the *value/movement axis*, not the divider line's visual angle — easy to get
  backwards). ArrowLeft/ArrowRight step by `step` px; Home gives the *start* pane its
  smallest size (end pane largest); End gives the start pane its largest size; Enter resets
  to the responsive default.
- **ARIA value attributes are normalized 0–100**, per the APG pattern's own convention —
  the public pixel-based `width` API is untouched; only `aria-valuenow`/`valuemin`/
  `valuemax`/`valuetext` are computed as a percentage of the allowed range.

---

## 3. Dimensions

| Element | Value |
| --- | --- |
| Handle hit-target width | `12px` default (`handleWidth` prop) |
| Handle track line width | `1px` idle → `2px` while dragging |
| Handle grip size | `20px` wide × `32px` tall |
| Grip border radius | `xsmall` |
| Grip border width | `thin` (`1px`), transparent when idle |
| Default min pane width (start + end) | `320px` each |
| Default keyboard step | `16px` per arrow key press |
| Default responsive width | `40%` of container width (when `width` is `null`) |
| Transition (track/grip color + width) | `quick` duration, `standard` easing |
| `touch-action` on handle | `none` (stops touch-drag from also scrolling the page) |

---

## 4. Style / color tokens

| Element / state | Token |
| --- | --- |
| Track line, idle | `interactive.background.gray.faded` |
| Track line, dragging | `interactive.background.primary.default` |
| Grip background, idle | `interactive.background.gray.faded` |
| Grip background, dragging | `interactive.background.primary.default` |
| Grip border, idle | `transparent` |
| Grip border, dragging | `interactive.border.primary.default` |
| Grip icon (6-dot), dragging | `interactive.icon.onPrimary.normal` (white on primary fill) |
| Handle focus ring | shared `getFocusRingStyles` (same as every other Compass interactive element) |
| Cursor over handle | `col-resize` |

**Interaction states:** idle (thin gray track, faded grip) → hover/focus (focus ring only,
no color change) → dragging (thick primary-color track, primary-filled grip, `col-resize`
cursor + `user-select: none` on `document.body` for the duration of the drag).

---

## 5. Props

### `ResizableSplit`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | exactly 2 `ResizableSplitPane` | — | Order matters: first = start (flex) pane, second = end (sized) pane |
| `width` | `number \| null` | — | End pane width in px; `null` = responsive default |
| `onWidthChange` | `(width: number \| null) => void` | — | Fires continuously while dragging/stepping; `null` only on reset |
| `onResizeEnd` | `(width: number) => void` | — | Fires once when a drag/keyboard interaction ends — persist here |
| `computeDefaultWidth` | `(containerWidth: number) => number` | 40% of container | Used only when `width` is `null` |
| `minStartWidth` | `number` | `320` | Also the width given to the start pane on Home |
| `minEndWidth` | `number` | `320` | Also the width given to the end pane on End |
| `handleWidth` | `number` | `12` | Included in clamp math so the start pane can't be squeezed below its min by the handle itself |
| `step` | `number` | `16` | Arrow-key resize step, px |
| `accessibilityLabel` | `string` | — | **Required** — labels the `role="separator"` handle |

### `ResizableSplitPane`

| Prop | Type | Notes |
| --- | --- | --- |
| `children` | `React.ReactNode` | The pane's content |

---

## 6. Use cases

### Documented today (4)

| # | Use case | What it shows |
| - | --- | --- |
| 1 | Default | Baseline two-pane split with the default width |
| 2 | WithCustomMinWidths | Custom `minStartWidth`/`minEndWidth` clamping |
| 3 | WithExplicitWidth | Controlled `width` instead of the responsive default |
| 4 | ListAndMap | Real-world layout: a list pane next to a map pane (~30/70 split via `computeDefaultWidth`) |

### Gap — supported by code, no dedicated story (quick wins)

| # | Use case | Why it's missing |
| - | --- | --- |
| 5 | Keyboard-only resize walkthrough | No story isolates Arrow/Home/End/Enter interactions on their own |
| 6 | Reset to default (double-click / Enter) | Not shown as its own example |
| 7 | Persisted width (`onResizeEnd` → `localStorage` round-trip) | The real-world pattern this component was built for isn't demoed end-to-end |
| 8 | Reversed pane roles (end pane as "main content") | Only the "start = main content" orientation is shown; the decisions.md flags this as a judgment call worth testing |

### Gap — would need new capability (real feature work)

| # | Use case | What's missing |
| - | --- | --- |
| 9 | Native (React Native) drag/resize | Native currently just stacks both panes vertically, non-resizable — no gesture-handler equivalent built |
| 10 | Vertical (top/bottom) orientation | API is written orientation-neutral but a vertical variant has never actually been built/verified |
| 11 | RTL support | Explicitly out of scope — ArrowLeft always shrinks the end pane regardless of text direction |

**Total: 4 shipped, 7 candidate additions (4 docs-only, 3 need new capability).**

---

## 7. Known limitations (carried from source `decisions.md`)

- **No native drag/resize interaction.** Building a `PanResponder`/`react-native-gesture-handler`
  equivalent is non-trivial, net-new work — not attempted in the original build.
- **No vertical split orientation.** Real use cases are horizontal only;
  the public prop names (`width`, `minStartWidth`/`minEndWidth`) are orientation-neutral on
  purpose, but a vertical variant has never been built or verified against this API shape.
- **No RTL guidance.** `ArrowLeft` grows/shrinks the pane in a fixed, direction-independent
  way — flagged as unaddressed, not fixed.
- **"Primary pane" for Home/End is a judgment call, not a spec requirement** — the original
  spec just says "primary pane" without defining which of the two unlabeled panes that is.
  Compass picked "start pane = primary" based on real call sites (a document
  viewer and a card list, both naturally the "main content"). A port whose actual use case
  has the *end* pane as the main content should flip this, not copy it blindly.
