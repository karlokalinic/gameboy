# SignalDesk Engine - Step 1 Foundation (Deploy-Oriented)

Ovaj paket je **prvi ozbiljni korak** prema offline `.exe` narativnoj desktop igri / mini-engineu.
Nije "još jedan web demo", nego **spec + skeleton** za migraciju svega što je već dokazano u HTML/CSS/JS prototipu u **C# + raylib-cs** runtime.

## Što je unutra

- `docs/` — detaljna arhitektura, roadmap, mapping iz HTML prototipa, gameplay sustavi
- `schemas/` — JSON schema draftovi (scenario/save/contacts)
- `examples/` — primjer scenarija, thought cabinet i open-world district config
- `src/` — C# solution skeleton (projekti, osnovne klase, sučelja, TODO stubovi)
- `tasks/` — implementacijski task list za rad ovdje ili u Codexu

## Što ovaj korak rješava

- Zaključava **smjer** i sprječava kaotično širenje featurea
- Definira **data contracte** (save/scenario/contacts)
- Definira **module boundaries** (Core/UI/Data/Tools/App)
- Omogućuje da idući korak bude **stvarna implementacija**, ne ponovno izmišljanje sustava

## Što NE rješava još

- Full render/UI implementaciju u raylib-u
- Compiled `.exe`
- Potpun runtime svih scenarijskih efekata
- Audio, installer, patching, localization pipeline

## Kako koristiti paket

1. Pročitaj redom:
   - `docs/00_product_vision.md`
   - `docs/01_architecture_overview.md`
   - `docs/02_html_prototype_to_engine_mapping.md`
   - `docs/03_data_formats.md`
   - `docs/04_gameplay_systems_blueprint.md`
   - `docs/05_implementation_roadmap.md`
2. Otvori `src/SignalDesk.sln`
3. Kreni implementirati po `tasks/step2_runtime_bootstrap.md`
4. Kad zapneš s višefajlnim refaktorima, prebaci repo u Codex (tad ima smisla)

## Build / Compile / Run (novo)

Ako ti je prije falila uputa kako kompajlirati: bila je implicitna kroz `.sln`, ali **nije bila eksplicitno zapisana**. Ovdje su službene upute.

### Preduvjeti

- .NET SDK 8.0+
- Windows/Linux/macOS (raylib-cs radi cross-platform, target deploy ostaje Windows `.exe`)

Provjera alata:

```bash
dotnet --info
```

### Restore + Build

Iz roota ovog paketa (`signaldesk_step1/`):

```bash
cd src
dotnet restore SignalDesk.sln
dotnet build SignalDesk.sln -c Debug
```

### Pokretanje aplikacije

```bash
cd src/SignalDesk.App
dotnet run
```

Alternativno iz `src/`:

```bash
dotnet run --project SignalDesk.App/SignalDesk.App.csproj
```

### Release publish (Windows executable)

```bash
cd src/SignalDesk.App
dotnet publish -c Release -r win-x64 --self-contained false
```

Output će biti u `bin/Release/net8.0/win-x64/publish/`.

### Najčešće greške

- `dotnet: command not found` → instaliraj .NET SDK 8+
- `Unable to load shared library 'raylib'` → restore/build opet nakon čistog checkouta, i provjeri da se pokreće iz project contexta (`SignalDesk.App`)

## Zašto C# + raylib-cs

- Offline `.exe`
- Kontrola nad fileovima (`/data`, `/saves`, `/logs`)
- Lagan custom UI rendering (Orwell-like desktop)
- Nema Unity editor lock-ina, ali i dalje imaš brz development tempo

## Sljedeći korak (nakon ovog paketa)

**STEP 2: Runtime Bootstrap**

Minimalno isporučiti:
- raylib window + game loop
- scene switching (`Boot -> MainMenu -> Setup -> DesktopRuntime`)
- basic panel/window manager (drag/minimize/focus)
- save slot service (json file writes)
- loading jednog JSON scenarija i prikaz prve poruke

Kad to radi, tek onda ide puni scenario runtime i checks.
