# Gameplay Systems Blueprint (Disco-inspired, but your own)

## 1) Character Creator / Selection

### Goal
Dati igraču identitet koji mijenja gameplay i tekst od prve minute.

### V1 flow
1. Odabir **Archetype** (preset raspodjela)
2. Manual raspodjela **skill points**
3. Odabir **Signature Skill**
4. Odabir **Background Tag** (npr. ex-analyst / street fixer / forensic dropout)
5. Odabir **Starting Thought** (opcionalno, daje flavor + tradeoff)

### Archetype examples (V1)
- **Cold Analyst** (Logic/Composure/Interfacing)
- **Ghost Listener** (Empathy/Shivers/Inland-ish ekvivalent u tvom sistemu)
- **Operator** (Authority/Suggestion/Reaction)
- **Ruin Poet** (Conceptualization/Drama/Volition)
- **Field Animal** (Half Light/Endurance/Perception)

## 2) Skills and perception filters

Poanta nije samo check bonus. Skillovi mijenjaju:
- dodatne linije u porukama i dossierima
- drugačije označavanje rizika
- drugačiji prijedlog izbora u UI helper hintovima
- interpretaciju motiva kontakta

### Perception channels (tekstualni slojevi)
- `analytical`
- `emotional`
- `threat`
- `social-performance`
- `urban-ambient`
- `creative-symbolic`

Node/poruka može imati base tekst + optional overlays po channelu.
Runtime odlučuje koje overlaye ubaciti na temelju skill thresholda + thoughtova + stanja (sanity, stress).

## 3) Checks (actual consequence)

### Formula (V1)
`2d6 + skill + modifiers`

### Modifiers can come from
- inventory evidence
- transcript/log references
- memory flags
- relationship level
- district state
- thought cabinet buffs/debuffs
- sanity bands (npr. low sanity daje insight + noise)

### Result bands (važnije od success/fail)
- Critical Failure
- Failure
- Partial Success
- Success
- Strong Success

To omogućava više nijansi i manje binarnosti.

## 4) Inventory (Disco-inspired utility, ne loot spam)

Inventory služi kao:
- dokazni materijal
- alati / uređaji
- kompromitirajuće stvari
- farmaceutski/kemijski resursi (tradeoff sa sanity/health)
- simbolički predmeti koji otključavaju thoughtove ili dijalog ton

### Item categories (V1)
- `evidence`
- `tool`
- `consumable`
- `credential`
- `symbolic`

## 5) Memory system (player-known + character-known)

Razdvoji memoriju na:
- **Case Memory Flags** (fakti, što je otkriveno)
- **Emotional Memory Flags** (dojam/trauma/vezanost)
- **Social Memory** (što NPC misli da si rekao/učinio)

To omogućuje stvarno dobre posljedice bez kaosa.

## 6) Thought Cabinet (tvoja verzija)

### Zašto ga uključiti
To je savršen most između:
- build identiteta
- posljedica
- roleplaya
- sistemskih tradeoffa

### V1 model
- `ThoughtCapacity` (npr. 3 slota)
- `ResearchQueue` (1 active research)
- `Thoughts` sa statusima: `discovered`, `researching`, `internalized`

### Thought effect patterns
- +2 na social checks kad lažeš, -1 sincerity/relationship drift
- otključava posebne choiceve, ali diže heat
- smanjuje panic penalties, ali smanjuje empathy overlays
- pojačava world ambience overlays uz sanity strain

## 7) Open World (district graph, not full sandbox)

### V1 open-world definition
- 3-5 distrikata
- travel edges s uvjetima
- više aktivnih scenario threadova
- district state (heat, unrest, surveillance)
- vrijeme prolazi i mijenja dostupnost

### Why this works
Dobiješ osjećaj slobode i posljedica bez da radiš ogroman engine za kretanje po mapi.

## 8) Multiple endings (strukturno, ne samo 2 finalna gumba)

### Layered endings
- **Case Outcome** (riješen / krivo riješen / cover-up / escalation)
- **Character Outcome** (stabilizacija / raspad / kompromis / fanaticization)
- **World Outcome** (frakcija dobiva, district tone, collateral)
- **Relationship Outcome** (ključni kontakti)

Runtime na kraju sintetizira ending iz više varijabli, ne samo jednog flag-a.

## 9) Actual consequence principles (pravila pisanja i sistema)

1. Posljedice se vraćaju kasnije, ne odmah uvijek.
2. Ne kažnjavati svaki rizik jednako.
3. Fail može dati sadržaj i lead, ali s cijenom.
4. "Optimalno" rješenje ne smije biti očito u svakom buildu.
5. Skill identity mora proizvoditi različite priče, ne samo brojke.
