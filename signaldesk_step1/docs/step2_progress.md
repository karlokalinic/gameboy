# Step 2 Progress Notes

## Completed in this iteration

- Phase A bootstrap remains active in `SignalDesk.App` with raylib window init, update/draw loop, and local-first runtime folders.
- Phase B scene flow remains intact:
  - `BootScene`
  - `MainMenuScene`
  - `SetupScene`
  - `DesktopScene`
- Phase C1/C2 implemented with a real minimal desktop shell in `SignalDesk.UI`:
  - Reworked `WindowPanel` with reusable window state and behavior (`id`, `title`, `bounds`, `minimized`, `visible`, focus), draggable titlebar, and minimize button.
  - Reworked `WindowManager` for click-to-focus and z-order behavior (front-most interaction), plus per-frame input/update/draw dispatch.
  - Added concrete windows/panels:
    - `MessagesPanel`
    - `ChoicesPanel`
    - `StatsPanel`
    - `DebugPanel`
    - `TaskbarPanel`
  - Integrated these windows into `DesktopScene` with a non-chaotic default layout and interactive desktop behavior.
- Phase D1/D2 (first half) implemented:
  - `DesktopScene` loads one scenario file from `data/scenarios/scenario_delta_warehouse_v1.json`.
  - If missing, the scene bootstraps it from `examples/scenario_delta_warehouse_v1.json`.
  - `ScenarioRuntime` starts at `startNode`, exposes runtime node/choices view, appends transcript entries, and supports branching for choices that have `next` and no check.
  - Choices with checks are explicitly marked `(CHECK TODO)` and currently blocked with a clear runtime message.

## Remaining for Step 2 completion

- Phase D semantic validation and richer scenario diagnostics.
- Phase E full check resolution and consequence application pipeline.
- Phase F save-slot persistence (atomic writes, metadata cards, load recovery).

## Architecture deviations and rationale

- Choice interaction remains immediate-mode for this vertical slice and is routed through UI panel callbacks into App orchestration (`DesktopScene`) and Core runtime (`ScenarioRuntime`).
- Condition/effect application is intentionally deferred to avoid overreaching this iteration; check choices are visibly tagged and handled with explicit TODO behavior.

## Next Iteration Plan

1. **CheckResolver integration**
   - Implement 2d6 + skill + modifiers flow.
   - Resolve `check.on` branches (`fail` / `partial` / `success`) with roll log entries in transcript/debug output.

2. **Consequence application**
   - Execute core effect ops (`set_flag`, `delta_stat`, `delta_relationship`, `add_inventory`, `remove_inventory`, `append_log`) in runtime.
   - Keep effect processing in Core runtime (not UI).

3. **Save slots**
   - Wire `SaveService` slot files (`./saves/slot{n}.sav.json`) with safe write strategy.
   - Add slot metadata preview and manual save/load hooks from desktop/taskbar.
