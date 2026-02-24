# Implementation Roadmap (from prototype to offline EXE)

## Phase 0 - This package (DONE)
- Architecture locked
- Data contracts drafted
- Skeleton projects created
- Feature mapping documented

## Phase 1 - Runtime Bootstrap (NEXT)
**Goal:** app opens as desktop shell and can load one scenario node.

### Deliverables
- raylib window boots
- scene manager works
- main menu + setup placeholder + desktop placeholder
- window manager (drag/focus/minimize)
- save slot file service (JSON read/write)
- scenario file loader + validator stub
- transcript panel shows first scenario message

### Exit criteria
- Start app -> choose slot -> start scenario -> see first message in window -> save/load works

## Phase 2 - Declarative Scenario Runtime
**Goal:** choices, checks, conditions/effects, branching actually run from JSON.

### Deliverables
- node executor
- check resolver (2d6 + mods)
- conditions/effects engine
- transcript analyzer basic modifiers
- relationship/inventory/memory updates
- autosave hooks

### Exit criteria
- At least 2 scenarios fully playable from JSON with different endings

## Phase 3 - Systems Depth (Disco-inspired identity)
**Goal:** build identity and perception layers matter.

### Deliverables
- character creator (archetype + points + signature)
- thought cabinet V1
- perception overlay channels in messages
- consequence bands (crit fail/partial/etc.)
- ending synthesizer

### Exit criteria
- same scenario feels different in at least 3 builds

## Phase 4 - Open World Structure (district graph)
**Goal:** non-linear campaign progression.

### Deliverables
- district graph panel / travel panel
- world clock + district state
- thread availability rules
- cross-scenario consequences

### Exit criteria
- campaign with 3-5 districts, multiple route order, multiple endings

## Phase 5 - Authoring + Debug Integrated
**Goal:** app becomes mini-engine/editor.

### Deliverables
- scenario editor panel (json text + form assists)
- validator panel with semantic issues list
- graph debug panel
- state inspector/hacker mode
- export session/package logs

### Exit criteria
- create/validate/play simple scenario without touching source code

## Phase 6 - Production Polish / Deploy
**Goal:** release-ready Windows build.

### Deliverables
- installer/publish script
- crash logging and recovery
- save migration handling
- settings menu
- audio pass
- visual polish pass
- release docs

### Exit criteria
- can hand `.exe` to another person and they can play without terminal/SDK
