# Product Vision

## Working title
**SignalDesk** (narrative desktop investigation RPG / mini-engine)

## Core fantasy
Igrač ne "hoda mapom" kao u klasičnom RPG-u nego upravlja **operativnim desktopom** (poruke, logovi, datoteke, dossieri, map overlays, system alerts) i kroz to donosi odluke koje imaju **stvarne, kumulativne posljedice**.

Spoj koji ciljaš:
- *Orwell* UI / desktop framing
- *Disco Elysium* unutarnji skillovi, psihologija, checks, build identitet
- vlastiti systems-heavy pristup: logs, memory flags, world context, relationship economy

## Product pillars (ne smiješ ih izdati)

### 1) Character-driven systemic narrative
Lik nije samo avatar. Build definira **kako svijet izgleda**.
- isti event, različit tekst/percepcija ovisno o skillovima / stanju / thought cabinetu
- fail stateovi nisu samo kazna nego druga vrsta sadržaja

### 2) Actual consequences
Odabiri moraju ostati u sustavu i vraćati se kasnije kroz:
- odnose
- world state
- dostupne informacije
- reputaciju/frakcije
- ending setove

### 3) Tool-like desktop play
Igra mora imati osjećaj stvarnog radnog sučelja, ali stiliziranog.
- prozori, taskbar, inbox, file explorer, dossieri, map/codex, debug/authoring opcije
- početni ekran minimalistički, onboarding bez overloada

### 4) Offline-first, file-based, moddable-ish
Bez interneta. Sve živi lokalno.
- `data/` za scenarije i kontakte
- `saves/` za slotove
- `logs/` za runtime/crash
- mogućnost kasnije za community scenarije

### 5) Runtime + Authoring in one app (postupno)
Igra je ujedno mini-engine/editor.
- runtime mode za igrača
- authoring/debug mode za tebe (i kasnije power usere)

## V1 target (realan)
Ne radi odmah "open world full sim". V1 mora dokazati:
- više scenarija
- deklarativni JSON scenario runtime
- checks + posljedice + save/load + slotovi
- desktop windows UX
- bar jedan mini "district travel" loop i više mogućih endinga
- thought cabinet (minimal implementation)

## V2+ target (ambiciozan)
- veći open-world district graph
- faction simulation tickovi
- schedule/time pressure
- contact agendas
- dynamic rumor propagation
- mod loading
- campaign editor
