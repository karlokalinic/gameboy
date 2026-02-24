# Architecture Overview (Deploy-Oriented)

## Tech stack decision
**C# + raylib-cs**

Razlog:
- compile u Windows `.exe`
- full offline runtime
- custom render/UI bez Unity editor ovisnosti
- dovoljno brz razvoj za UI-heavy narativnu igru

## High-level layers

```text
[ SignalDesk.App ]        -> game loop, scenes, startup, service wiring
[ SignalDesk.UI ]         -> windows/panels/widgets/layout/animation/input focus
[ SignalDesk.Core ]       -> game state, checks, runtime, consequences, thought cabinet
[ SignalDesk.Data ]       -> JSON loading, schema validation, save files, migrations
[ SignalDesk.Tools ]      -> authoring panels, graph debug, hacker inspector
[ File System ]           -> assets/data/saves/logs
```

## Runtime modes

1. **Boot Mode**
   - config load
   - paths init
   - schema registry init
   - asset preflight (fonts/icons)

2. **Main Menu / Start Screen**
   - continue/new session
   - slot select
   - scenario select
   - profile (future)

3. **Character Creator / Archetype Setup**
   - archetype preset
   - skill points
   - signature skill
   - optional trait / flaw / opening thought

4. **Desktop Runtime**
   - inbox/messages
   - files/logs
   - stats/inventory/memory/relationships
   - codex/world context
   - thought cabinet
   - map/districts (limited V1)
   - debug/authoring toggles (dev mode)

5. **Ending / Debrief**
   - consequence recap
   - world outcome summary
   - stats of playthrough
   - unlocks (future)

## Core services (singleton-ish through DI/service locator)

- `ILoggerService`
- `IClockService` (game time)
- `IRandomService` (seeded rolls)
- `IPathService`
- `IAssetService`
- `ISaveService`
- `ISchemaValidator`
- `IScenarioRepository`
- `IContactRepository`
- `IWorldRepository`
- `IScenarioRuntime`
- `IEventBus`
- `IAnimationService`
- `IWindowLayoutService`

## Why this split matters
Bez ovoga ćeš završiti s jednim `Game.cs` fajlom od 6000 linija gdje UI direktno mutira save file i runtime state. To radi 3 dana, onda sve pukne.

## Data flow (choice -> consequence)

1. Igrač klikne choice u `ConversationPanel`
2. UI pošalje `ChoiceSelectedEvent`
3. `ScenarioRuntime` evaluira:
   - preconditions
   - skill check (ako postoji)
   - transcript/log references
   - inventory/memory/world modifiers
4. Runtime emitira `ResolutionResult`
5. `GameState` se ažurira (stats, flags, relationships, inventory, district state)
6. Transcript/logs dobivaju nove entryje
7. UI paneli dobivaju update preko event busa
8. Autosave (ovisno o policyju)

## Open-world (pragmatična definicija za tvoj žanr)
Nije GTA. Za ovaj projekt "open world" znači:
- više distrikata / lokacija
- više aktivnih threadova/scenarija
- stateful svijet koji reagira na vrijeme i posljedice
- redoslijed rješavanja nije strogo linearan

To je realno i dovoljno moćno.
