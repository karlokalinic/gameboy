# Coding Conventions and Rules (to avoid self-sabotage)

## Architectural rules
1. UI layer **ne smije** direktno pisati save file.
2. UI layer **ne smije** direktno evaluirati conditions/effects.
3. Runtime layer ne smije znati za raylib drawing API.
4. Data layer ne smije mutirati `GameState` (samo load/save/validate).
5. Tool panels koriste iste runtime/data servise kao igra (nema paralelnog fake sustava).

## Naming
- IDs u JSON: `snake_case`
- C# klase: `PascalCase`
- privatna polja: `_camelCase`
- methods: glagolski (`LoadScenario`, `ApplyEffects`, `AdvanceTime`)

## Save compatibility policy
- svaki save ima `version`
- promjena modela -> napiši migration
- nikad ne briši staro polje bez fallbacka dok ne uvedeš migrator

## Logging policy
Logiraj ovo:
- scene transitions
- scenario start/end
- node transitions
- choice selections
- checks (dice, mods, result band)
- save/load results
- exceptions

Ne logiraj bezveze svaki frame. Nisi rudnik tekstualnog šuma.
