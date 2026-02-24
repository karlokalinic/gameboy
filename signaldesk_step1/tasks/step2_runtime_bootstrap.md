# Step 2 Runtime Bootstrap - Task List (Implement next)

## Objective
Podignuti raylib app koji može učitati scenario JSON i prikazati prvu poruku unutar draggable desktop prozora, uz save slot file persistence.

## Task breakdown

### A. App boot and project wiring
- [ ] Kreirati .NET solution i projekte iz `src/`
- [ ] Dodati `raylib-cs` u `SignalDesk.App`
- [ ] Implementirati `Program.cs` + `GameHost`
- [ ] Napraviti game loop (`Update/Draw`) i scene stack
- [ ] Inicijalizirati pathe (`assets/`, `data/`, `saves/`, `logs/`)

### B. Core state skeleton
- [ ] `GameState` root model
- [ ] `PlayerState`, `WorldState`, `RelationshipState`, `ThoughtCabinetState`
- [ ] `SessionState` + transcript entries
- [ ] `GameStateFactory` (new game defaults)

### C. Save slots (file-based)
- [ ] `SaveService` with slot1-slot5 paths
- [ ] atomic write (`.tmp` -> replace)
- [ ] manual save/load methods
- [ ] metadata peek (slot card previews)
- [ ] autosave path per slot

### D. Scenario loading
- [ ] `ScenarioRepository` loads JSON from `data/scenarios`
- [ ] JSON deserialize into typed models
- [ ] schema validation stub (can return warnings only for now)
- [ ] semantic validation stub (`startNode`, duplicate IDs)

### E. Minimal runtime executor
- [ ] `ScenarioRuntime.Start(scenarioId)`
- [ ] locate `startNode`
- [ ] append transcript entry from first node
- [ ] expose current choices list
- [ ] no checks yet (Step 2 can hard-disable check choices with label)

### F. UI desktop shell (minimum viable)
- [ ] `WindowManager` base
- [ ] draggable `WindowPanel`
- [ ] `TaskbarPanel`
- [ ] `MessagesPanel` (shows transcript + choices)
- [ ] `StatsPanel` placeholder
- [ ] `FilesPanel` placeholder with slot buttons
- [ ] focus/z-order on click
- [ ] minimize/restore

### G. Main menu and setup stub
- [ ] Start screen with Continue / New Session / Slot Select
- [ ] Setup screen placeholder (archetype buttons only)
- [ ] Start scenario button

### H. Logging / debug
- [ ] text logger to `logs/runtime.log`
- [ ] exception -> `logs/crash_*.txt`
- [ ] onscreen tiny debug overlay toggle (FPS + scene + slot)

## Done criteria
- [ ] `dotnet run` opens app
- [ ] can start new session in slot
- [ ] loads one JSON scenario
- [ ] first message + choices visible in draggable window
- [ ] save and load restore state
