# Codex Prompt Seed (when you move implementation there)

Use this after Step 1 docs are reviewed.

---
Implement **Step 2 Runtime Bootstrap** for the `SignalDesk` project using C# and raylib-cs.

Constraints:
- Preserve architecture boundaries from docs in `docs/`
- File-based saves in `saves/slot{n}.json` (5 slots)
- Offline only, no web dependencies
- Create a minimal desktop shell UI with draggable/minimizable windows (Messages, Files, Stats, Taskbar)
- Load scenario JSON from `data/scenarios/*.json`
- Render first message node and choices in Messages window
- Log runtime to `logs/`
- Do not implement full checks/effects yet; scaffold interfaces and TODOs

Priorities:
1) compile and run
2) clean project structure
3) typed models for scenario/save
4) robust save/load skeleton
5) minimal but clean UI interaction loop

Please implement file-by-file and keep TODO comments for deferred systems.
---
