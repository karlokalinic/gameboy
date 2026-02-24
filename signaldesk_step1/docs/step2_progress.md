# Step 2 Progress Notes

## Completed in this iteration

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
- A small immediate-mode UI helper (`UiElements.Button`) was added for clean prototype interaction.

## Remaining for Step 2 completion

- Phase C: draggable/minimizable/focusable runtime window manager and real panels.
- Phase D: scenario loading from `data/scenarios` and node/choice rendering.
- Phase E: full check resolution and consequence application.
- Phase F: save-slot persistence and metadata listing.

## Architecture deviations and rationale

- Input handling for menu/setup buttons currently runs in scene `Draw()` as an immediate-mode simplification to keep the bootstrap thin and runnable.
- This is a temporary prototype tradeoff; runtime/domain systems (scenario execution, checks, save logic) remain planned outside rendering and will be added in subsequent phases.
