# Data Formats (Scenario / Save / Contacts / World / Thought Cabinet)

## Design principles
- Human-readable (`JSON`)
- Versioned (`version` field everywhere bitno)
- Strict identifiers (`snake_case` or `kebab-case`, konzistentno)
- Minimal duplicated text (odvajanje contenta po potrebi)
- Easy diff in Git

## 1) Scenario JSON (declarative runtime)

### Core structure
- `id`, `version`, `title`
- `startNode`
- `nodes[]`
- optional: `contacts`, `districts`, `unlocks`, `endings`, `variables`

### Node types (V1)
- `message` (prikaz poruke + choices)
- `check` (roll + branching)
- `event` (efekti bez izbora)
- `travel` (odabir lokacije/distrikta)
- `ending` (završetak scenarija / route)

### Choice structure (V1)
- `id`
- `label`
- `next`
- optional `conditions[]`
- optional `effects[]`
- optional `check`
- optional `tags[]`

## 2) Save JSON

Save mora sadržavati sve što treba za deterministički nastavak:
- game state snapshot
- active scenario + node
- transcript
- world flags / district state
- thought cabinet state
- active window layout (optional)
- RNG seed / roll history (debug)

## 3) Contacts JSON

Kontakt nije samo ime i avatar. Treba imati:
- communication profile
- relationship metrics
- trust thresholds
- faction ties
- hidden traits (za runtime checks)

## 4) World / District JSON

Open-world za tvoj žanr = district graph + state layers.
Minimalno:
- district nodes
- travel edges
- unlock conditions
- danger/attention levels
- available threads/scenarios

## 5) Thought Cabinet JSON (Disco-inspired, tvoj twist)

Thought Cabinet nije skill tree.
To su **internalized frameworks** koji mijenjaju:
- percepciju teksta
- check modifikatore
- available choices
- relation drift
- sanity/morale economy

Svaki thought ima lifecycle:
- discovered
- slotted/researching
- internalized
- forgotten/suppressed (future)

## Condition / Effect mini DSL (V1 pragmatic)

Nemoj odmah pisati full scripting language. Kreni s command list pristupom.

### Condition examples
- `flag_equals`
- `stat_gte`
- `skill_gte`
- `relationship_gte`
- `inventory_has`
- `thought_internalized`
- `district_unlocked`
- `time_between`

### Effect examples
- `set_flag`
- `delta_stat`
- `delta_relationship`
- `add_inventory`
- `remove_inventory`
- `unlock_thought`
- `start_thought_research`
- `internalize_thought`
- `unlock_district`
- `append_log`
- `add_heat`
- `advance_time`
- `queue_message`

## Schema strategy
- JSON Schema za strukturu
- custom semantic validator za:
  - `next` referenciranje
  - unreachable node warning
  - duplicate IDs
  - invalid effect targets
  - impossible checks (soft warning)
