# Step 2 Progress Notes

## Completed in this iteration

- Preserved Step 2 scene flow (`Boot -> MainMenu -> Setup -> Desktop`) and desktop shell behavior from prior phase.
- Implemented a **Contextual Check Engine MVP** in `SignalDesk.Core.Checks`:
  - Check request now carries target/context and optional scenario modifier rules.
  - Check results now include per-source modifier breakdown entries.
  - Resolver now applies contextual modifiers from:
    - signature skill
    - weather tags
    - player clothing tags
    - direct relationship with target
    - indirect social graph links
    - scenario-specified modifier rules (`player_clothing_tag`, `weather_tag`)
- Upgraded `ScenarioRuntime` to resolve checks now (instead of blocking with TODO):
  - maps roll bands to branch keys (`critical_fail/fail/partial/success/strong_success`)
  - transitions through `check.on` targets
  - logs roll summary and per-modifier breakdown into transcript and roll history
- Extended core model surface for future systemic narrative logic:
  - added `SocialGraph`, `SocialLink`, `RelationType`
  - attached social graph to `GameState`
- Updated desktop bootstrap state so check flow is testable immediately:
  - seeded example skills, weather, clothing tags, relationships, and one social link
  - debug panel now includes last roll summary when available
- Extended scenario DTO contract:
  - `ScenarioCheck.Modifiers` with `ScenarioModifierRule`

## Remaining for Step 2 completion

- Effect pipeline execution (`delta_stat`, `set_flag`, `delta_relationship`, inventory ops, etc.).
- Save slots and metadata cards (`slot{n}.sav.json`, atomic write, graceful recovery).
- Schema semantic validation for extended check/outcome/rule contracts.

## Architecture notes

- Runtime resolution remains in `SignalDesk.Core`; app layer only orchestrates and refreshes UI.
- UI remains presentation/input focused (no direct condition/effect evaluation and no save writes).

## Next Iteration Plan

1. **Consequence application pass**
   - implement effect applier with a minimal safe operation whitelist.
2. **Save slot integration**
   - wire SaveService with manual save/load commands and slot previews.
3. **Authoring expansion pass**
   - add visibility/availability conditions and richer modifier rule types.
- Phase A bootstrap remains active in `SignalDesk.App` with raylib window init, update/draw loop, and local-first runtime folders.
- Phase B scene flow remains intact:
- Phase A bootstrap is implemented in `SignalDesk.App`:
  - `Program` now initializes and runs the `GameHost`.
  - `GameHost` now initializes raylib windowing and ensures core local-first paths exist:
    - `assets/`
    - `data/`
    - `saves/`
    - `logs/`
- Scene manager now supports update/draw ticking and stack cleanup.
- Phase B scene flow is implemented:
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
- A small immediate-mode UI helper (`UiElements.Button`) was added for clean prototype interaction.

## Remaining for Step 2 completion

- Phase C: draggable/minimizable/focusable runtime window manager and real panels.
- Phase D: scenario loading from `data/scenarios` and node/choice rendering.
- Phase E: full check resolution and consequence application.
- Phase F: save-slot persistence and metadata listing.

## Architecture deviations and rationale

- Input handling for menu/setup buttons currently runs in scene `Draw()` as an immediate-mode simplification to keep the bootstrap thin and runnable.
- This is a temporary prototype tradeoff; runtime/domain systems (scenario execution, checks, save logic) remain planned outside rendering and will be added in subsequent phases.
