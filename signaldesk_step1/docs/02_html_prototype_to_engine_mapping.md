# HTML Prototype -> Engine Mapping

Ovdje mapiramo što si već izgradio/probao u HTML/CSS/JS demoima na engine module. Ovo sprječava da "izgubiš" dobar UX i gameplay logiku pri migraciji.

## Dokazani featurei iz prototipa (referenca)
Na temelju dosadašnjeg demo smjera:
- Orwell-style desktop UI
- tabs / windows / taskbar / minimize mindset
- save/load + save slots
- scenario authoring JSON + validator + draft play
- branch graph debug view
- export session loga JSON
- hacker panel (live stat editing)
- skills / checks / logs / inventory / memory / relationships / sanity
- character setup (archetype + points + signature skill)

## Engine mapping table

### UI / Presentation
- HTML panels -> `SignalDesk.UI.Windows.*Panel`
- CSS transitions -> `TweenAnimation` + style tokens (`Theme`)
- taskbar buttons -> `TaskbarWidget`
- tabs -> `TabStripWidget`
- responsive layout -> `LayoutProfiles` (Desktop, Narrow, UltraWide)

### State / Gameplay
- JS `state` object -> `GameState` aggregate (`SignalDesk.Core`)
- UI direct mutations -> `Commands` / `ScenarioEffects`
- random checks (`2d6 + mods`) -> `CheckResolver`
- log parsing bonuses -> `TranscriptAnalyzer`

### Data / Persistence
- `localStorage` saves -> `SaveService` file-based JSON slots
- draft scenarios in localStorage -> `DraftScenarioRepository` (`data/drafts/*.json` or `saves/editor/`)
- window layout localStorage -> `WindowLayoutService` (`saves/ui/layout.json`)

### Debug / Authoring
- branch graph debug tab -> `GraphDebugPanel` + `ScenarioGraphInspector`
- hacker modal -> `StateInspectorPanel`
- validator -> `SchemaValidationService`

## Feature parity strategy
Ne pokušavaj 1:1 pixel copy odmah. Čuvaj **behavioral parity** prvo.

### Prioritet 1 (must preserve)
- save slot semantics
- choice -> checks -> consequence pipeline
- transcript/log evidence affecting outcomes
- hidden/visible stats toggles
- debug tools availability in dev mode

### Prioritet 2 (evolve)
- smoother animations
- better panel manager
- window snapping/maximize rules
- richer inbox/thread UX

### Prioritet 3 (new systems)
- thought cabinet
- district travel/open-world progression
- multiple ending synthesis

## Common migration trap (nemoj)
"Prepisat ću HTML app 1:1 u C#".

Ne. HTML demo je **spec/prototype**, ne final architecture.
Migriraš:
- koncept
- state model
- interaction loops
- data contracts

Ne migriraš doslovni DOM mindset.
