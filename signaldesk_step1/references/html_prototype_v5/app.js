(() => {
  'use strict';

  const APP_VERSION = '2.0.0';
  const STORAGE_KEY = 'signalDeskNarrativeDemoV2';
  const STORAGE_AUTOSAVE_KEY = 'signalDeskNarrativeDemoV2:auto';
  const SETUP_POINTS = 10;

  const SKILLS = {
    logic: { label: 'Logic', group: 'Intellect', blurb: 'Deduction and contradiction mapping.' },
    encyclopedia: { label: 'Encyclopedia', group: 'Intellect', blurb: 'Lore and context recall.' },
    rhetoric: { label: 'Rhetoric', group: 'Intellect', blurb: 'Argument framing and debate.' },
    drama: { label: 'Drama', group: 'Intellect', blurb: 'Lie detection and performance.' },
    conceptualization: { label: 'Conceptualization', group: 'Intellect', blurb: 'Symbolic and artistic interpretation.' },
    visualCalculus: { label: 'Visual Calculus', group: 'Intellect', blurb: 'Forensic scene reconstruction.' },

    volition: { label: 'Volition', group: 'Psyche', blurb: 'Self-control and mental anchoring.' },
    inlandEmpire: { label: 'Inland Empire', group: 'Psyche', blurb: 'Intuition and surreal association.' },
    empathy: { label: 'Empathy', group: 'Psyche', blurb: 'Reading emotional states.' },
    authority: { label: 'Authority', group: 'Psyche', blurb: 'Command presence and pressure.' },
    espritDeCorps: { label: 'Esprit de Corps', group: 'Psyche', blurb: 'Institutional and team instinct.' },
    suggestion: { label: 'Suggestion', group: 'Psyche', blurb: 'Soft influence and manipulation.' },

    endurance: { label: 'Endurance', group: 'Physique', blurb: 'Body resilience and health.' },
    painThreshold: { label: 'Pain Threshold', group: 'Physique', blurb: 'Tolerance under damage.' },
    physicalInstrument: { label: 'Physical Instrument', group: 'Physique', blurb: 'Strength and brute force.' },
    electrochemistry: { label: 'Electrochemistry', group: 'Physique', blurb: 'Urges, chemicals, appetite.' },
    shivers: { label: 'Shivers', group: 'Physique', blurb: 'Urban atmospheric intuition.' },
    halfLight: { label: 'Half Light', group: 'Physique', blurb: 'Threat sense and adrenaline.' },

    handEyeCoordination: { label: 'Hand/Eye', group: 'Motorics', blurb: 'Aim and coordinated precision.' },
    perception: { label: 'Perception', group: 'Motorics', blurb: 'Noticing details and signals.' },
    reactionSpeed: { label: 'Reaction Speed', group: 'Motorics', blurb: 'Timing and snap decisions.' },
    savoirFaire: { label: 'Savoir Faire', group: 'Motorics', blurb: 'Balance, agility, style.' },
    interfacing: { label: 'Interfacing', group: 'Motorics', blurb: 'Tools, locks, technical handling.' },
    composure: { label: 'Composure', group: 'Motorics', blurb: 'Posture, poker face, restraint.' }
  };

  const SKILL_KEYS = Object.keys(SKILLS);
  const GROUP_ORDER = ['Intellect', 'Psyche', 'Physique', 'Motorics'];

  const ARCHETYPES = [
    {
      id: 'analyst',
      name: 'Cold Analyst',
      desc: 'Reads patterns first, people second. Very useful, socially cursed.',
      skills: skillSpread({ logic: 4, encyclopedia: 3, rhetoric: 3, visualCalculus: 4, perception: 3, composure: 3, volition: 2, empathy: 1 })
    },
    {
      id: 'interrogator',
      name: 'Street Interrogator',
      desc: 'Talks, pressures, improvises. Strong in social control and real-time pivots.',
      skills: skillSpread({ empathy: 4, authority: 4, suggestion: 4, drama: 3, reactionSpeed: 3, composure: 3, logic: 2, halfLight: 2 })
    },
    {
      id: 'wraith',
      name: 'Signal Wraith',
      desc: 'Feels the city in the wires. Intuitive, unstable, weirdly effective.',
      skills: skillSpread({ inlandEmpire: 4, shivers: 4, conceptualization: 4, empathy: 3, electrochemistry: 2, perception: 3, volition: 2, drama: 2 })
    },
    {
      id: 'operator',
      name: 'Field Operator',
      desc: 'Practical, durable, competent under pressure. Less poetry, more surviving.',
      skills: skillSpread({ endurance: 4, painThreshold: 3, physicalInstrument: 3, handEyeCoordination: 3, interfacing: 4, reactionSpeed: 3, composure: 2, volition: 2 })
    }
  ];

  function skillSpread(overrides) {
    const base = {};
    SKILL_KEYS.forEach(k => base[k] = 1);
    for (const [k, v] of Object.entries(overrides)) base[k] = v;
    return base;
  }

  // ---- Scenario engine data ----
  const SCENARIOS = {
    warehouseSweep: {
      id: 'warehouseSweep',
      title: 'Delta Warehouse Sweep',
      tone: 'Industrial paranoia',
      desc: 'Guide Mira through a live sweep inside a bonded logistics depot while you read incoming comms, infer routes, and decide what matters more: evidence or extraction.',
      tags: ['Surveillance', 'Infiltration', 'Evidence Chain'],
      worldSeed: {
        district: 'Delta Freight Corridor',
        weather: 'Cold drizzle, signal scatter high',
        lineSecurity: 'Private contractor + municipal overlap',
        doctrine: 'Quiet compliance preferred over public force'
      },
      relationsSeed: { Mira: 50, SupervisorIlex: 34, PublicSystems: 41 },
      inventorySeed: { spoofToken: 1, painkillers: 1, lockshim: 1 },
      memorySeed: { watchedCameraLoop: false, noticedTimeGap: false, suspectsContractorLeak: false, foundLedger: false },
      startNode: 'intro',
      nodes: {
        intro: {
          label: 'Inbound chatter and first breach',
          summary: 'Mira enters the depot edge while your console fills with internal dispatch chatter.',
          incoming: [
            msg('system', 'Desk', 'Connection stable. Field relay synced to Mira channel. Delay: 280ms.'),
            msg('npc', 'Mira', 'At the east fence. Motion lights are lazy. Either broken or staged.'),
            msg('alert', 'Security', 'Shift sweep moved forward fourteen minutes. All units ping in.')
          ],
          choices: [
            choice('Cross-check timing anomaly against incoming logs before answering', 'Read the room before acting. Gains transcript context if you catch the pattern.', {
              check: { skill: 'logic', difficulty: 10, type: 'white', label: 'LOGIC CHECK' },
              resolve: (s, ctx) => {
                const gapBonus = transcriptKeywordCount(s, ['minutes', 'delay', 'forward']) >= 2 ? 1 : 0;
                if (ctx.result.success || gapBonus) {
                  s.memory.noticedTimeGap = true;
                  pushEngineLog('debug', 'Timing inconsistency flagged from transcript patterns.');
                  return {
                    followups: [
                      tline('system', 'You mark a timing gap between dispatch cadence and fence relay clocks.'),
                      tline('npc', 'Mira', 'Good catch. Someone fast-tracked the sweep, but not the cameras.')
                    ],
                    next: 'hallway'
                  };
                }
                harm(s, { sanity: -2 });
                return {
                  followups: [tline('system', 'You overfit noise. Mira moves without a clean read.')],
                  next: 'hallway'
                };
              },
              mods: (s) => [mod('Transcript pattern', transcriptKeywordCount(s, ['delay', 'minutes']) > 0 ? 1 : 0)]
            }),
            choice('Tell Mira to move immediately through the loading hall shadow', 'Fast reaction. Useful if you trust your instincts or need momentum.', {
              check: { skill: 'reactionSpeed', difficulty: 9, type: 'white', label: 'REACTION CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  bump(s, { progress: +8 });
                  return { followups: [tline('npc', 'Mira', 'Moving. Keeping low. Forklifts make enough cover.')] , next: 'hallway'};
                }
                bump(s, { heat: +6 });
                return { followups: [tline('alert', 'Security', 'Zone E-2 motion ping. Manual verify.')], next: 'hallway' };
              }
            }),
            choice('Feed Mira a calm, precise step-by-step entry to reduce panic drift', 'Safer human-centric opener. Trades speed for stability.', {
              check: { skill: 'empathy', difficulty: 8, type: 'white', label: 'EMPATHY CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  bump(s, { relation: { Mira: +4 }, sanity: +1 });
                  return { followups: [tline('npc', 'Mira', 'Copy. Breathing. Counting. Entering on your mark.')], next: 'hallway' };
                }
                bump(s, { relation: { Mira: -2 } });
                return { followups: [tline('npc', 'Mira', 'You sound calm because you are not the one inside.')], next: 'hallway' };
              }
            })
          ]
        },

        hallway: {
          label: 'Control hall split',
          summary: 'Two routes. One likely leads to manifests, the other to the sealed ledger room.',
          incoming: [
            msg('npc', 'Mira', 'Forklift hall split ahead. Left smells like coolant. Right has office glass and card readers.'),
            msg('trace', 'Dispatch', 'Contractor Team C rerouted. Supervisor authorization pending.')
          ],
          choices: [
            choice('Route right and spoof a badge on the office card reader', 'Uses inventory and technical skill. Good for clean evidence path.', {
              requires: (s) => hasItem(s, 'spoofToken'),
              check: { skill: 'interfacing', difficulty: 11, type: 'white', label: 'INTERFACING CHECK' },
              resolve: (s, ctx) => {
                consumeItem(s, 'spoofToken', 1);
                if (ctx.result.success) {
                  s.memory.watchedCameraLoop = true;
                  bump(s, { progress: +12 });
                  return {
                    followups: [
                      tline('system', 'Spoof token accepted for 23 seconds. Camera loop repeats frames 102-105.'),
                      tline('npc', 'Mira', 'Office lane open. I can see a manifest terminal.')
                    ],
                    next: 'records'
                  };
                }
                bump(s, { heat: +9, sanity: -2 });
                return {
                  followups: [tline('alert', 'Security', 'Card error on office east. Send manual check.')],
                  next: 'records'
                };
              },
              mods: (s) => [mod('Spoof token', 1)]
            }),
            choice('Route left and read ambient danger before moving deeper', 'Atmospheric intuition over direct evidence. Often weirdly correct.', {
              check: { skill: 'shivers', difficulty: 10, type: 'white', label: 'SHIVERS CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.memory.suspectsContractorLeak = true;
                  return {
                    followups: [
                      tline('system', 'The corridor hum changes. Sweep teams are hunting a report, not a person.'),
                      tline('npc', 'Mira', 'You just saved me from stepping under a rotating camera.')
                    ],
                    next: 'records'
                  };
                }
                bump(s, { sanity: -3 });
                return {
                  followups: [tline('system', 'Static. Too much static. You give Mira a vague answer and waste seconds.')],
                  next: 'records'
                };
              }
            }),
            choice('Tell Mira to plant a false voice ping in the wrong room', 'Deception and performance. Can buy space or make everything worse.', {
              check: { skill: 'drama', difficulty: 12, type: 'red', label: 'DRAMA CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  bump(s, { heat: -6, progress: +5 });
                  return {
                    followups: [tline('trace', 'System', 'Playback accepted: “Vent alarm East-2”. Sweep split confirmed.')],
                    next: 'records'
                  };
                }
                bump(s, { heat: +10, sanity: -2 });
                return { followups: [tline('alert', 'Security', 'Playback source mismatch. Search for relay injection.')], next: 'records' };
              }
            })
          ]
        },

        records: {
          label: 'Record room and human pressure',
          summary: 'Evidence is close. So is panic. Mira wants a clear answer now.',
          incoming: [
            msg('npc', 'Mira', 'Manifest terminal is here. Ledger room farther in. I can take one cleanly, maybe both.'),
            msg('system', 'Relay jitter increasing. Voice compression artifacts detected.')
          ],
          choices: [
            choice('Take quick manifest photo, skip deeper ledger room, preserve extraction window', 'Conservative path. Good if heat is high or Mira trust is low.', {
              check: { skill: 'composure', difficulty: 9, type: 'white', label: 'COMPOSURE CHECK' },
              resolve: (s, ctx) => {
                addItem(s, 'manifestSnap', 1);
                s.memory.foundLedger = false;
                if (ctx.result.success) {
                  bump(s, { relation: { Mira: +2 }, progress: +10 });
                } else {
                  bump(s, { relation: { Mira: -2 }, heat: +4 });
                }
                return { followups: [tline('npc', 'Mira', 'Manifest captured. Pulling back before I get greedy.')], next: 'exit' };
              }
            }),
            choice('Push for sealed ledger despite sweep pressure', 'Greedy evidence path. Powerful if you read Mira well and keep nerves intact.', {
              check: { skill: 'volition', difficulty: 12, type: 'white', label: 'VOLITION CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  addItem(s, 'sealedLedger', 1);
                  s.memory.foundLedger = true;
                  bump(s, { sanity: +1, progress: +14 });
                  return {
                    followups: [
                      tline('npc', 'Mira', 'Door open. Ledger is physical. Who even prints crime anymore?'),
                      tline('system', 'You hear gloves on paper over static. Some details still need the object.')
                    ],
                    next: 'exit'
                  };
                }
                bump(s, { sanity: -4, relation: { Mira: -4 }, heat: +8 });
                return { followups: [tline('npc', 'Mira', 'No. I am not dying because you got ambitious over paper.')], next: 'exit' };
              },
              mods: (s) => [mod('Mira trust', s.relations.Mira >= 55 ? 1 : 0), mod('Heat penalty', s.stats.heat >= 60 ? -1 : 0)]
            }),
            choice('Force Mira to challenge a guard with forged authority tone', 'Aggressive social power move. Can create a clean lane or a blood incident.', {
              check: { skill: 'authority', difficulty: 13, type: 'red', label: 'AUTHORITY CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  bump(s, { relation: { Mira: -1 }, progress: +9, heat: -4 });
                  addItem(s, 'guardPasscodeSnippet', 1);
                  return { followups: [tline('npc', 'Mira', 'He flinched and stepped aside. I hate that this worked.')], next: 'exit' };
                }
                bump(s, { relation: { Mira: -8 }, health: -2, heat: +10 });
                return { followups: [tline('npc', 'Mira', 'He grabbed me. I broke loose. I am bleeding, keep talking.')], next: 'exit' };
              }
            })
          ]
        },

        exit: {
          label: 'Extraction and consequence framing',
          summary: 'Choose what kind of win you want. The case and the person are not the same thing.',
          incoming: [
            msg('alert', 'Security', 'Manual sweep converging on office lane and loading hall.'),
            msg('npc', 'Mira', 'I need a route now, not philosophy.')
          ],
          choices: [
            choice('Evidence exit through blind camera seam', 'Best case path if you actually did the prep.', {
              check: { skill: 'perception', difficulty: 11, type: 'white', label: 'PERCEPTION CHECK' },
              resolve: (s, ctx) => {
                const evidence = (hasItem(s, 'sealedLedger') ? 2 : 0) + (hasItem(s, 'manifestSnap') ? 1 : 0);
                const prep = (s.memory.watchedCameraLoop ? 1 : 0) + (s.memory.noticedTimeGap ? 1 : 0);
                if (ctx.result.success && evidence + prep >= 3) {
                  s.outcome = 'Breakthrough evidence chain, Mira extracted';
                  bump(s, { relation: { Mira: +4 }, sanity: +2, progress: +15 });
                  return { followups: [tline('system', 'Route matched the loop seam. Mira exits with evidence intact.')], end: true };
                }
                s.outcome = 'Partial extraction, compromised trail';
                bump(s, { relation: { Mira: +1 }, health: -1, sanity: -2 });
                return { followups: [tline('npc', 'Mira', 'I got out. Evidence did not all make it. Pick what to mourn later.')], end: true };
              },
              mods: (s) => [mod('Camera loop memory', s.memory.watchedCameraLoop ? 1 : 0), mod('Ledger weight', hasItem(s, 'sealedLedger') ? 1 : 0)]
            }),
            choice('Clean extraction, dump evidence if needed', 'Human-first ending. Case quality drops, relationship usually rises.', {
              check: { skill: 'empathy', difficulty: 9, type: 'white', label: 'EMPATHY CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.outcome = 'Mira safe, case weakened';
                  delete s.inventory.sealedLedger;
                  delete s.inventory.manifestSnap;
                  bump(s, { relation: { Mira: +8 }, sanity: +4, progress: +6 });
                } else {
                  s.outcome = 'Delayed extraction, emotional fracture';
                  bump(s, { relation: { Mira: -5 }, morale: -1, sanity: -3, health: -1 });
                }
                return { followups: [tline('system', `Outcome recorded: ${s.outcome}`)], end: true };
              }
            }),
            choice('Trigger blackout relay and run in the chaos', 'Loud, reckless, sometimes effective. Leaves political smoke everywhere.', {
              check: { skill: 'electrochemistry', difficulty: 12, type: 'red', label: 'ELECTROCHEMISTRY CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.outcome = 'Chaotic escape, public systems fallout';
                  s.world.lineSecurity = 'Corridor blackout incident under review';
                  bump(s, { relation: { Mira: -1, PublicSystems: -10 }, sanity: -2, heat: +12 });
                  return { followups: [tline('alert', 'Grid', 'Relay overload in Delta corridor. Fire shutters engaged.')], end: true };
                }
                s.outcome = 'Self-sabotage spiral';
                bump(s, { relation: { Mira: -8 }, health: -3, morale: -2, sanity: -6, heat: +14 });
                return { followups: [tline('system', 'No blackout. Maximum noise, minimal plan. Classic.')], end: true };
              }
            })
          ]
        }
      }
    },

    embassyLeak: {
      id: 'embassyLeak',
      title: 'Embassy Leak / Midnight Window',
      tone: 'Diplomatic pressure cooker',
      desc: 'A junior attaché wants to leak proof of an off-book rendition handoff. You monitor internal comms, parse etiquette, and decide whether to save a source, the story, or the state narrative.',
      tags: ['Diplomacy', 'Leak', 'Source Protection'],
      worldSeed: {
        district: 'Old Harbor Diplomatic Quarter',
        weather: 'Wind across stone facades',
        lineSecurity: 'Embassy guards + host police liaison',
        doctrine: 'Contain scandal, deny urgency'
      },
      relationsSeed: { Ana: 46, PressDesk: 40, HostPolice: 52 },
      inventorySeed: { burnerPhone: 1, forgedPressPass: 1, archiveKey: 1 },
      memorySeed: { codePhraseMatched: false, sourceShaking: false, pressWindowOpen: false, archiveCopied: false },
      startNode: 'intro',
      nodes: {
        intro: {
          label: 'Leaking line opens',
          summary: 'Ana reaches a utility annex and starts feeding fragments while official channels deny everything.',
          incoming: [
            msg('npc', 'Ana', 'Utility annex unlocked. I have fifteen minutes before the night rotation notices.'),
            msg('system', 'Press chatter rising. Three outlets asking the same question, same wording.'),
            msg('trace', 'Embassy Internal', 'Protocol note: “Window remains sealed unless phrase validated.”')
          ],
          choices: [
            choice('Ask Ana to confirm the exact code phrase before anything else', 'Trust protocol over adrenaline. Sets up cleaner archive access.', {
              check: { skill: 'rhetoric', difficulty: 10, type: 'white', label: 'RHETORIC CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.memory.codePhraseMatched = true;
                  return { followups: [tline('npc', 'Ana', 'Phrase is “glass remembers rain.” Writing it down was stupid, but I did.')], next: 'corridor' };
                }
                s.memory.sourceShaking = true;
                bump(s, { relation: { Ana: -2 }, sanity: -2 });
                return { followups: [tline('npc', 'Ana', 'Stop quizzing me and help me move. I am shaking.')] , next: 'corridor'};
              }
            }),
            choice('Send forged press ping to create a false media arrival at the front gate', 'Buys time by weaponizing bureaucracy.', {
              requires: (s) => hasItem(s, 'forgedPressPass'),
              check: { skill: 'drama', difficulty: 11, type: 'red', label: 'DRAMA CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.memory.pressWindowOpen = true;
                  bump(s, { heat: -4, progress: +6 });
                  return { followups: [tline('system', 'Front gate protocol diverted to media verification spiral.')], next: 'corridor' };
                }
                bump(s, { heat: +8 });
                return { followups: [tline('alert', 'Embassy', 'Spoofed media credential detected. Internal lockdown threshold lowered.')], next: 'corridor' };
              },
              mods: (s) => [mod('Forged press pass', 1)]
            }),
            choice('Calm Ana and slow her breathing before data extraction', 'Human-first stabilizer. Helps later trust checks.', {
              check: { skill: 'empathy', difficulty: 8, type: 'white', label: 'EMPATHY CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  bump(s, { relation: { Ana: +5 }, sanity: +2 });
                } else {
                  s.memory.sourceShaking = true;
                  bump(s, { relation: { Ana: -1 } });
                }
                return { followups: [tline('npc', 'Ana', 'Okay. Okay. I can type now. Keep talking.')] , next: 'corridor'};
              }
            })
          ]
        },
        corridor: {
          label: 'Archive corridor',
          summary: 'The annex opens into an archive corridor with badge locks and a host police patrol nearby.',
          incoming: [
            msg('trace', 'Host Police', 'Liaison patrol checking side corridor after “media alert”.'),
            msg('npc', 'Ana', 'Archive room has a brass key backup. Who still does this?')
          ],
          choices: [
            choice('Use archive key and copy only the index pages first', 'Low risk evidence strategy. Less explosive but harder to dispute later.', {
              requires: (s) => hasItem(s, 'archiveKey'),
              check: { skill: 'interfacing', difficulty: 10, type: 'white', label: 'INTERFACING CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  addItem(s, 'archiveIndexCopy', 1);
                  s.memory.archiveCopied = true;
                  bump(s, { progress: +10 });
                } else {
                  bump(s, { heat: +6, sanity: -1 });
                }
                return { followups: [tline('system', 'Archive index pages captured. Enough to prove records exist.')], next: 'decision' };
              }
            }),
            choice('Have Ana impersonate night records staff and walk past the patrol', 'Terrible plan unless composure and suggestion are decent.', {
              check: { skill: 'suggestion', difficulty: 12, type: 'red', label: 'SUGGESTION CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  bump(s, { relation: { Ana: +2 }, heat: -5, progress: +8 });
                  return { followups: [tline('npc', 'Ana', 'He barely looked at me. I hate uniforms for how much they trust uniforms.')] , next: 'decision'};
                }
                bump(s, { relation: { Ana: -6 }, health: -1, heat: +11 });
                return { followups: [tline('alert', 'Host Police', 'Stop. ID check.')], next: 'decision' };
              },
              mods: (s) => [mod('Ana trust', s.relations.Ana >= 50 ? 1 : 0), mod('Source shaking', s.memory.sourceShaking ? -1 : 0)]
            }),
            choice('Listen to the corridor and wait for the patrol rhythm to repeat', 'Pattern reading over action hero nonsense.', {
              check: { skill: 'perception', difficulty: 9, type: 'white', label: 'PERCEPTION CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.memory.pressWindowOpen = true;
                  bump(s, { progress: +5 });
                  return { followups: [tline('system', 'Patrol pauses every 47 seconds near radiator hiss. Window mapped.')] , next: 'decision'};
                }
                bump(s, { sanity: -2 });
                return { followups: [tline('system', 'You wait, then keep waiting, then realize you lost the count.')] , next: 'decision'};
              }
            })
          ]
        },
        decision: {
          label: 'What to publish, what to protect',
          summary: 'Ana can push full documents, metadata, or flee. Each choice shapes survivability and legitimacy.',
          incoming: [
            msg('npc', 'Ana', 'I can push the files raw, sanitize them, or leave now. Pick the sin you prefer.'),
            msg('system', 'Press desk requesting confirmation within six minutes.')
          ],
          choices: [
            choice('Push metadata + index proof to press desk, preserve source anonymity', 'Slower story, stronger source protection.', {
              check: { skill: 'volition', difficulty: 10, type: 'white', label: 'VOLITION CHECK' },
              resolve: (s, ctx) => {
                s.outcome = ctx.result.success ? 'Protected source, slower story' : 'Hesitation, narrower window';
                if (ctx.result.success) {
                  addItem(s, 'pressPacketMeta', 1);
                  bump(s, { relation: { Ana: +6, PressDesk: +2 }, sanity: +3 });
                } else {
                  bump(s, { relation: { PressDesk: -4 }, heat: +4, sanity: -2 });
                }
                return { followups: [tline('system', `Outcome recorded: ${s.outcome}`)], end: true };
              }
            }),
            choice('Push raw files immediately and let chaos create cover', 'Big reveal, high collateral. You know, media hero fantasy.', {
              check: { skill: 'electrochemistry', difficulty: 12, type: 'red', label: 'ELECTROCHEMISTRY CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.outcome = 'Explosive leak, source exposed risk high';
                  bump(s, { relation: { PressDesk: +8, Ana: -3 }, heat: +14, progress: +16 });
                } else {
                  s.outcome = 'Upload failed halfway, both story and source compromised';
                  bump(s, { relation: { Ana: -9, PressDesk: -6 }, health: -2, morale: -2, sanity: -5, heat: +16 });
                }
                return { followups: [tline('alert', 'Network', 'Outbound filter spike in embassy segment.')], end: true };
              }
            }),
            choice('Abort leak, extract Ana, archive proof for later verified release', 'Human + long game path. Can feel like cowardice, often is strategy.', {
              check: { skill: 'composure', difficulty: 9, type: 'white', label: 'COMPOSURE CHECK' },
              resolve: (s, ctx) => {
                if (ctx.result.success) {
                  s.outcome = 'Source preserved, delayed operation';
                  bump(s, { relation: { Ana: +7 }, sanity: +4, progress: +5 });
                } else {
                  s.outcome = 'Late abort, trust fracture';
                  bump(s, { relation: { Ana: -4 }, sanity: -2, heat: +5 });
                }
                return { followups: [tline('npc', 'Ana', `Understood. ${ctx.result.success ? 'Running now.' : 'Should have said that earlier.'}`)], end: true };
              },
              mods: (s) => [mod('Code phrase matched', s.memory.codePhraseMatched ? 1 : 0)]
            })
          ]
        }
      }
    }
  };

  function msg(kind, author, text, tags = []) { return { kind, author, text, tags }; }
  function tline(kind, a, textMaybe) {
    if (textMaybe === undefined) return { kind, text: a };
    return { kind, author: a, text: textMaybe };
  }
  function choice(idOrTitle, maybeDesc, maybeConfig) {
    const isLegacy = typeof maybeConfig === 'undefined';
    if (isLegacy) return { id: slugify(idOrTitle), title: idOrTitle, desc: '', ...maybeDesc };
    return { id: slugify(idOrTitle), title: idOrTitle, desc: maybeDesc, ...maybeConfig };
  }
  function mod(label, value) { return { label, value }; }

  // ---- App state ----
  const ui = {};
  const app = {
    setup: {
      selectedScenarioId: Object.keys(SCENARIOS)[0],
      selectedArchetypeId: ARCHETYPES[0].id,
      signatureSkill: 'logic',
      skills: {},
      pointsLeft: SETUP_POINTS
    },
    runtime: {
      showPerceptionVoices: true,
      currentTab: 'messages',
      waitingForChoice: false,
      running: false,
      paused: false,
      showcaseRunning: false,
      autosaveTimer: null,
      pendingMessageTimer: null
    },
    state: null,
    fileViewPath: 'session://transcript.log',
    graphReflowSeed: 0
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheUi();
    initSetupState();
    bindEvents();
    renderEverything();
    pushEngineLog('info', `App booted v${APP_VERSION}`);
    updateMetaBar();
  }

  function cacheUi() {
    const ids = [
      'incomingFeed','feedCount','timeline','choiceArea','scenarioHeader','logsContent','logCount',
      'meterStrip','quickRelations','activeFlags','statsContent','skillsContent','inventoryContent','relationsContent',
      'memoryContent','worldContent','perceptionSummary','signatureSummary','fileTree','activeFilePath','fileViewer',
      'debugStateView','branchGraph','graphLegend','metaScenario','metaStatus','metaAutosave','setupOverlay','hackerOverlay',
      'scenarioPicker','scenarioPreview','archetypeCards','archetypePreview','skillAllocation','signatureChoices','pointsLeftBadge',
      'btnStart','btnQuickBalanced','btnLoadIntoSetup','btnSave','btnLoad','btnClearSave','btnExportJson','btnShowcase','btnReset',
      'btnCopyFile','btnHacker','btnCloseHacker','btnApplyHacker','btnTogglePerception','btnToggleAllStats','btnGraphLayout','btnExportGraph',
      'hackerCore','hackerSkills','hackMemoryJson','hackInventoryJson','hackRelationsJson','hackerTabBtns', 'dockNav'
    ];
    ids.forEach(id => ui[id] = document.getElementById(id));
  }

  function bindEvents() {
    // Tabs
    document.querySelectorAll('.dock-btn').forEach(btn => btn.addEventListener('click', () => setTab(btn.dataset.tab)));
    // Setup
    ui.btnQuickBalanced.addEventListener('click', quickBalancedBuild);
    ui.btnStart.addEventListener('click', startScenarioFromSetup);
    ui.btnLoadIntoSetup.addEventListener('click', loadSaveIntoSetup);
    // Top actions
    ui.btnSave.addEventListener('click', () => manualSave('manual'));
    ui.btnLoad.addEventListener('click', loadFromStorageAndResume);
    ui.btnClearSave.addEventListener('click', clearSavedState);
    ui.btnExportJson.addEventListener('click', exportSessionJson);
    ui.btnReset.addEventListener('click', resetApplication);
    ui.btnShowcase.addEventListener('click', startAutoplayShowcase);
    // Messages controls
    ui.btnHacker.addEventListener('click', openHackerMode);
    ui.btnCloseHacker.addEventListener('click', closeHackerMode);
    ui.btnApplyHacker.addEventListener('click', applyHackerChanges);
    ui.btnTogglePerception.addEventListener('click', () => {
      app.runtime.showPerceptionVoices = !app.runtime.showPerceptionVoices;
      ui.btnTogglePerception.textContent = app.runtime.showPerceptionVoices ? 'Hide Voices' : 'Show Voices';
      renderTimeline();
    });
    // File explorer
    ui.btnCopyFile.addEventListener('click', copyActiveFileToClipboard);
    // Stats accordion
    document.querySelectorAll('.accordion-head').forEach(head => head.addEventListener('click', () => head.parentElement.classList.toggle('collapsed')));
    ui.btnToggleAllStats.addEventListener('click', toggleAllAccordions);
    // Debug
    ui.btnGraphLayout.addEventListener('click', () => { app.graphReflowSeed++; renderBranchGraph(); });
    ui.btnExportGraph.addEventListener('click', exportGraphJson);
    // Hacker tabs
    ui.hackerTabBtns?.querySelectorAll('[data-hacker-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        ui.hackerTabBtns.querySelectorAll('[data-hacker-tab]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.hacker-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const paneId = `hacker${capitalize(btn.dataset.hackerTab)}`;
        document.getElementById(paneId).classList.add('active');
      });
    });
    // Load autosave if present? keep explicit to avoid hijacking current session.
  }

  function initSetupState() {
    const archetype = ARCHETYPES[0];
    app.setup.selectedArchetypeId = archetype.id;
    app.setup.selectedScenarioId = Object.keys(SCENARIOS)[0];
    app.setup.signatureSkill = 'logic';
    app.setup.skills = structuredClone(archetype.skills);
    app.setup.pointsLeft = SETUP_POINTS;
  }

  function renderEverything() {
    renderSetup();
    renderScenarioHeader();
    renderFeed();
    renderTimeline();
    renderChoices();
    renderMeters();
    renderQuickRelations();
    renderActiveFlags();
    renderStatsPanels();
    renderLogs();
    renderFileTree();
    renderFileView();
    renderContextPanels();
    renderPerceptionPanels();
    renderDebugPanels();
    renderBranchGraph();
    updateMetaBar();
  }

  // ---------- Setup rendering ----------
  function renderSetup() {
    renderScenarioPicker();
    renderScenarioPreview();
    renderArchetypeCards();
    renderArchetypePreview();
    renderSkillAllocation();
    renderSignatureChoices();
    ui.pointsLeftBadge.textContent = `${app.setup.pointsLeft} left`;
    ui.btnStart.disabled = app.setup.pointsLeft !== 0;
  }

  function renderScenarioPicker() {
    ui.scenarioPicker.innerHTML = '';
    Object.values(SCENARIOS).forEach(sc => {
      const card = el('button', { className: `scenario-card ${sc.id === app.setup.selectedScenarioId ? 'active' : ''}` });
      card.innerHTML = `
        <div class="title">${esc(sc.title)}</div>
        <div class="desc">${esc(sc.desc)}</div>
        <div class="meta">${sc.tags.map(t => `<span class="tiny-tag">${esc(t)}</span>`).join('')}</div>`;
      card.addEventListener('click', () => {
        app.setup.selectedScenarioId = sc.id;
        renderSetup();
      });
      ui.scenarioPicker.appendChild(card);
    });
  }

  function renderScenarioPreview() {
    const sc = getSelectedScenario();
    ui.scenarioPreview.innerHTML = `
      <h4>${esc(sc.title)} <span class="badge">${esc(sc.tone)}</span></h4>
      <p>${esc(sc.desc)}</p>
      <p class="kicker">Nodes: ${Object.keys(sc.nodes).length} · Tags: ${sc.tags.map(esc).join(', ')}</p>`;
  }

  function renderArchetypeCards() {
    ui.archetypeCards.innerHTML = '';
    ARCHETYPES.forEach(a => {
      const card = el('button', { className: `archetype-card ${a.id === app.setup.selectedArchetypeId ? 'active' : ''}` });
      const topSkills = topSkillEntries(a.skills, 4).map(([k, v]) => `${SKILLS[k].label} ${v}`).join(' · ');
      card.innerHTML = `<div class="title">${esc(a.name)}</div><div class="desc">${esc(a.desc)}</div><div class="meta"><span class="tiny-tag">${esc(topSkills)}</span></div>`;
      card.addEventListener('click', () => {
        app.setup.selectedArchetypeId = a.id;
        app.setup.skills = structuredClone(a.skills);
        app.setup.pointsLeft = SETUP_POINTS;
        if (!app.setup.skills[app.setup.signatureSkill]) app.setup.signatureSkill = 'logic';
        renderSetup();
      });
      ui.archetypeCards.appendChild(card);
    });
  }

  function renderArchetypePreview() {
    const a = ARCHETYPES.find(x => x.id === app.setup.selectedArchetypeId);
    const grouped = groupSkillPairs(a.skills);
    ui.archetypePreview.innerHTML = `<h4>${esc(a.name)}</h4><p>${esc(a.desc)}</p>${GROUP_ORDER.map(g => `<p class="kicker"><strong>${g}:</strong> ${grouped[g].slice(0,3).map(([k,v])=>`${esc(SKILLS[k].label)} ${v}`).join(', ')}</p>`).join('')}`;
  }

  function renderSkillAllocation() {
    const grouped = GROUP_ORDER.flatMap(group => SKILL_KEYS.filter(k => SKILLS[k].group === group));
    ui.skillAllocation.innerHTML = '';
    grouped.forEach(key => {
      const row = el('div', { className: 'alloc-row' });
      const label = el('div', { className: 'label' });
      label.innerHTML = `<strong>${esc(SKILLS[key].label)}</strong><small>${esc(SKILLS[key].group)} · ${esc(SKILLS[key].blurb)}</small>`;
      const minus = el('button', { className: 'btn tiny subtle alloc-btn', text: '−' });
      const val = el('div', { className: 'alloc-val mono', text: String(app.setup.skills[key]) });
      const plus = el('button', { className: 'btn tiny alloc-btn', text: '+' });
      minus.addEventListener('click', () => adjustSetupSkill(key, -1));
      plus.addEventListener('click', () => adjustSetupSkill(key, +1));
      row.append(label, minus, val, plus);
      ui.skillAllocation.appendChild(row);
    });
  }

  function adjustSetupSkill(key, delta) {
    const min = 1;
    const max = 6;
    const current = app.setup.skills[key];
    if (delta > 0) {
      if (app.setup.pointsLeft <= 0 || current >= max) return;
      app.setup.skills[key] += 1;
      app.setup.pointsLeft -= 1;
    } else {
      const archetypeBase = ARCHETYPES.find(a => a.id === app.setup.selectedArchetypeId).skills[key] || 1;
      if (current <= archetypeBase || current <= min) return;
      app.setup.skills[key] -= 1;
      app.setup.pointsLeft += 1;
    }
    renderSetup();
  }

  function renderSignatureChoices() {
    ui.signatureChoices.innerHTML = '';
    SKILL_KEYS.forEach(key => {
      const btn = el('button', { className: `sig-btn ${app.setup.signatureSkill === key ? 'active' : ''}` });
      btn.innerHTML = `${esc(SKILLS[key].label)}<small>${esc(SKILLS[key].group)}</small>`;
      btn.addEventListener('click', () => { app.setup.signatureSkill = key; renderSetup(); });
      ui.signatureChoices.appendChild(btn);
    });
  }

  function quickBalancedBuild() {
    const arch = ARCHETYPES.find(a => a.id === app.setup.selectedArchetypeId);
    app.setup.skills = structuredClone(arch.skills);
    app.setup.pointsLeft = SETUP_POINTS;
    const priority = ['volition','perception','empathy','logic','reactionSpeed', app.setup.signatureSkill];
    for (const k of priority) {
      if (app.setup.pointsLeft <= 0) break;
      const current = app.setup.skills[k];
      if (current < 6) {
        app.setup.skills[k] += 1;
        app.setup.pointsLeft -= 1;
      }
    }
    let i = 0;
    while (app.setup.pointsLeft > 0 && i < SKILL_KEYS.length * 2) {
      const k = SKILL_KEYS[i % SKILL_KEYS.length];
      if (app.setup.skills[k] < 6) {
        app.setup.skills[k] += 1;
        app.setup.pointsLeft -= 1;
      }
      i++;
    }
    renderSetup();
  }

  function getSelectedScenario() { return SCENARIOS[app.setup.selectedScenarioId]; }

  // ---------- Session lifecycle ----------
  function startScenarioFromSetup() {
    if (app.setup.pointsLeft !== 0) {
      pushEngineLog('warn', 'Cannot start. Spend all setup points first.');
      return;
    }
    const scenario = getSelectedScenario();
    app.state = createInitialState(scenario);
    app.runtime.running = true;
    app.runtime.waitingForChoice = false;
    app.runtime.showcaseRunning = false;
    clearRuntimeTimers();
    ui.setupOverlay.classList.remove('visible');
    pushEngineLog('info', `Session started: ${scenario.title}`);
    setTab('messages');
    renderEverything();
    queueNodeStart(scenario.startNode);
    scheduleAutosave('session-start');
  }

  function createInitialState(scenario) {
    const now = new Date().toISOString();
    const state = {
      appVersion: APP_VERSION,
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      scenarioId: scenario.id,
      currentNodeId: null,
      visitedNodes: [],
      branchHistory: [],
      pendingChoices: [],
      transcript: [],
      timeline: [],
      logs: [],
      stats: { health: 6, morale: 5, sanity: 58, heat: 22, progress: 0 },
      skills: structuredClone(app.setup.skills),
      signatureSkill: app.setup.signatureSkill,
      inventory: structuredClone(scenario.inventorySeed),
      memory: structuredClone(scenario.memorySeed),
      relations: structuredClone(scenario.relationsSeed),
      world: structuredClone(scenario.worldSeed),
      outcome: null,
      ended: false,
      choiceCounter: 0,
      lastCheck: null
    };
    return state;
  }

  function resetApplication() {
    clearRuntimeTimers();
    app.runtime.running = false;
    app.runtime.waitingForChoice = false;
    app.runtime.showcaseRunning = false;
    app.state = null;
    app.fileViewPath = 'session://transcript.log';
    ui.setupOverlay.classList.add('visible');
    initSetupState();
    renderEverything();
    updateMetaBar();
  }

  function queueNodeStart(nodeId) {
    const state = app.state;
    if (!state || state.ended) return;
    const scenario = SCENARIOS[state.scenarioId];
    const node = scenario.nodes[nodeId];
    if (!node) {
      pushEngineLog('error', `Node missing: ${nodeId}`);
      return;
    }
    state.currentNodeId = nodeId;
    if (!state.visitedNodes.includes(nodeId)) state.visitedNodes.push(nodeId);
    state.pendingChoices = [];
    app.runtime.waitingForChoice = false;

    const incomingMsgs = node.incoming || [];
    let idx = 0;
    addTimelineEntry({ kind: 'system', author: 'Node', text: `Entered node: ${node.label}` });
    renderEverything();

    const pushNext = () => {
      if (idx >= incomingMsgs.length) {
        presentChoices(nodeId);
        return;
      }
      const m = incomingMsgs[idx++];
      addIncoming(m);
      addTimelineEntry(m);
      renderEverything();
      const delay = app.runtime.showcaseRunning ? 180 : 550;
      app.runtime.pendingMessageTimer = setTimeout(pushNext, delay);
    };
    pushNext();
  }

  function presentChoices(nodeId) {
    const state = app.state;
    const scenario = SCENARIOS[state.scenarioId];
    const node = scenario.nodes[nodeId];
    const choices = (node.choices || []).filter(ch => !ch.requires || ch.requires(state));
    state.pendingChoices = choices;
    app.runtime.waitingForChoice = true;
    renderChoices();
    renderBranchGraph();
    if (app.runtime.showcaseRunning) scheduleAutoplayChoice();
  }

  function selectChoice(index) {
    const state = app.state;
    if (!state || !app.runtime.waitingForChoice || !state.pendingChoices[index]) return;
    const nodeId = state.currentNodeId;
    const choiceObj = state.pendingChoices[index];
    app.runtime.waitingForChoice = false;
    state.pendingChoices = [];
    state.choiceCounter += 1;

    addTimelineEntry({ kind: 'player', author: 'Operator', text: choiceObj.title });
    addTranscript('Operator', choiceObj.title, ['choice']);

    let checkResult = null;
    if (choiceObj.check) {
      checkResult = runCheck(choiceObj.check, choiceObj.mods ? choiceObj.mods(state) : [], choiceObj.title);
      state.lastCheck = checkResult;
      addTimelineEntry({
        kind: checkResult.success ? 'check-success' : 'check-fail',
        author: choiceObj.check.label || 'CHECK',
        text: `${checkResult.success ? 'SUCCESS' : 'FAIL'} · ${checkResult.rolls.join('+')} + ${checkResult.skillValue} ${fmtModSum(checkResult.mods)} = ${checkResult.total} vs ${checkResult.difficulty}`
      });
    }

    let transition = { next: null, end: false, followups: [] };
    try {
      if (choiceObj.resolve) {
        transition = choiceObj.resolve(state, { result: checkResult, choice: choiceObj }) || transition;
      } else {
        transition.next = choiceObj.next || null;
      }
    } catch (err) {
      pushEngineLog('error', `Choice resolve error: ${err.message}`);
      transition = { followups: [tline('system', 'Engine caught an error and limped forward.')] };
    }

    recordBranchHistory({ nodeId, choiceId: choiceObj.id, title: choiceObj.title, success: checkResult ? !!checkResult.success : null, next: transition.next || null, end: !!transition.end });

    for (const f of transition.followups || []) {
      addIncoming(f, true);
      addTimelineEntry(f);
    }

    if (transition.end) {
      endSession();
      return;
    }

    if (transition.next) {
      renderEverything();
      const delay = app.runtime.showcaseRunning ? 220 : 700;
      app.runtime.pendingMessageTimer = setTimeout(() => queueNodeStart(transition.next), delay);
    } else {
      app.runtime.waitingForChoice = true;
      renderEverything();
    }

    scheduleAutosave('choice');
  }

  function runCheck(check, extraMods, label) {
    const s = app.state;
    const skillValue = s.skills[check.skill] || 0;
    const dynamicMods = normalizeMods(extraMods);
    const logMods = computeLogBasedMods(check.skill);
    const allMods = [...dynamicMods, ...logMods];
    const rolls = [d6(), d6()];
    const totalMods = allMods.reduce((a, m) => a + m.value, 0);
    const total = rolls[0] + rolls[1] + skillValue + totalMods;
    const difficulty = check.difficulty || 10;
    const success = total >= difficulty;
    const result = { check, label, skill: check.skill, rolls, skillValue, mods: allMods, total, difficulty, success };
    pushEngineLog(success ? 'info' : 'warn', `${check.label || 'CHECK'} ${success ? 'PASS' : 'FAIL'}: ${rolls.join('+')} + ${skillValue}${fmtModSum(allMods)} = ${total} vs ${difficulty}`);
    return result;
  }

  function computeLogBasedMods(skillKey) {
    const s = app.state;
    if (!s) return [];
    const mods = [];
    const transcriptText = s.transcript.map(t => t.text.toLowerCase()).join(' ');
    const hitsTiming = countKeywordsInText(transcriptText, ['delay','minutes','window','clock','seconds']);
    const hitsThreat = countKeywordsInText(transcriptText, ['alert','sweep','manual','check','lockdown']);
    const hitsSocial = countKeywordsInText(transcriptText, ['calm','breathing','trust','voice','please']);

    if (['logic','perception','reactionSpeed','visualCalculus'].includes(skillKey) && hitsTiming >= 2) mods.push(mod('Log timing pattern', +1));
    if (['halfLight','authority','composure'].includes(skillKey) && hitsThreat >= 3) mods.push(mod('Threat read from chatter', +1));
    if (['empathy','suggestion','drama'].includes(skillKey) && hitsSocial >= 2) mods.push(mod('Voice stress in transcript', +1));
    if (s.memory.noticedTimeGap && ['logic','perception','rhetoric'].includes(skillKey)) mods.push(mod('Memory: time gap', +1));
    if (s.memory.watchedCameraLoop && ['perception','interfacing','shivers'].includes(skillKey)) mods.push(mod('Memory: camera loop', +1));
    if ((s.stats.sanity ?? 0) < 35 && ['logic','composure','volition'].includes(skillKey)) mods.push(mod('Low sanity penalty', -1));
    if ((s.stats.heat ?? 0) >= 70 && ['composure','savoirFaire','reactionSpeed'].includes(skillKey)) mods.push(mod('High heat pressure', -1));
    return mods;
  }

  function endSession() {
    const s = app.state;
    if (!s) return;
    s.ended = true;
    app.runtime.running = false;
    app.runtime.waitingForChoice = false;
    addTimelineEntry({ kind: 'system', author: 'Session', text: `Session ended. ${s.outcome || 'No formal outcome recorded.'}` });
    pushEngineLog('info', `Session ended. Outcome: ${s.outcome || 'n/a'}`);
    renderEverything();
    scheduleAutosave('session-end');
  }

  // ---------- Mutators ----------
  function bump(s, patch) {
    if (!s || !patch) return;
    if (patch.health) s.stats.health = clamp((s.stats.health || 0) + patch.health, 0, 12);
    if (patch.morale) s.stats.morale = clamp((s.stats.morale || 0) + patch.morale, 0, 12);
    if (patch.sanity) s.stats.sanity = clamp((s.stats.sanity || 0) + patch.sanity, 0, 100);
    if (patch.heat) s.stats.heat = clamp((s.stats.heat || 0) + patch.heat, 0, 100);
    if (patch.progress) s.stats.progress = clamp((s.stats.progress || 0) + patch.progress, 0, 100);
    if (patch.relation) {
      for (const [name, delta] of Object.entries(patch.relation)) {
        s.relations[name] = clamp((s.relations[name] || 0) + delta, 0, 100);
      }
    }
    s.updatedAt = new Date().toISOString();
  }
  function harm(s, delta) { bump(s, delta); }

  function addItem(s, key, qty = 1) { s.inventory[key] = (s.inventory[key] || 0) + qty; }
  function hasItem(s, key) { return (s.inventory[key] || 0) > 0; }
  function consumeItem(s, key, qty = 1) { if (!s.inventory[key]) return false; s.inventory[key] = Math.max(0, s.inventory[key] - qty); if (s.inventory[key] <= 0) delete s.inventory[key]; return true; }

  // ---------- Logs / transcript / timeline ----------
  function addIncoming(message, silentKind = false) {
    addTranscript(message.author || 'System', message.text, message.tags || []);
    if (!silentKind && message.kind === 'alert') bump(app.state, { heat: +1 });
  }

  function addTranscript(author, text, tags = []) {
    if (!app.state) return;
    app.state.transcript.push({ ts: new Date().toISOString(), author, text, tags });
    app.state.updatedAt = new Date().toISOString();
  }

  function addTimelineEntry(entry) {
    if (!app.state) return;
    const item = { id: `tl_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, ts: new Date().toISOString(), ...entry };
    app.state.timeline.push(item);
    app.state.updatedAt = new Date().toISOString();
  }

  function pushEngineLog(level, message, data = null) {
    const target = app.state?.logs || (app._bootLogs ||= []);
    target.push({ id: `log_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, ts: new Date().toISOString(), level, message, data });
    if (target.length > 300) target.splice(0, target.length - 300);
    renderLogs();
    updateMetaBar();
  }

  function flushBootLogsIntoSession() {
    if (!app.state) return;
    if (app._bootLogs?.length) {
      app.state.logs.unshift(...app._bootLogs.splice(0));
      app.state.logs = app.state.logs.slice(-300);
    }
  }

  // ---------- Rendering main views ----------
  function renderScenarioHeader() {
    const s = app.state;
    const html = [];
    if (!s) {
      html.push(pillHtml('Scenario', 'Not started'));
      html.push(pillHtml('Mode', 'Setup'));
      ui.scenarioHeader.innerHTML = html.join('');
      return;
    }
    const sc = SCENARIOS[s.scenarioId];
    html.push(pillHtml('Scenario', sc.title));
    html.push(pillHtml('Node', sc.nodes[s.currentNodeId]?.label || 'Pending'));
    html.push(pillHtml('Signature', SKILLS[s.signatureSkill]?.label || s.signatureSkill));
    html.push(pillHtml('Outcome', s.outcome || (s.ended ? 'Ended' : 'In progress')));
    ui.scenarioHeader.innerHTML = html.join('');
  }

  function renderFeed() {
    ui.incomingFeed.innerHTML = '';
    const transcript = app.state?.transcript || [];
    transcript.slice(-100).forEach(item => {
      const kind = inferFeedKind(item);
      const div = el('div', { className: `feed-item ${kind}` });
      div.innerHTML = `
        <div class="meta"><span>${fmtTime(item.ts)} · ${esc(item.author)}</span><span>${item.tags?.length ? item.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('') : ''}</span></div>
        <div>${esc(item.text)}</div>`;
      ui.incomingFeed.appendChild(div);
    });
    ui.feedCount.textContent = String(transcript.length);
    scrollToBottom(ui.incomingFeed);
  }

  function renderTimeline() {
    ui.timeline.innerHTML = '';
    const entries = app.state?.timeline || [];
    entries.forEach(entry => {
      const card = el('div', { className: `entry ${entry.kind || 'system'}` });
      const voiceHtml = app.runtime.showPerceptionVoices && app.state ? renderVoiceLinesForEntry(entry) : '';
      card.innerHTML = `
        <div class="entry-head"><span>${fmtTime(entry.ts)} · ${esc(entry.author || 'System')}</span><span>${esc((entry.kind || 'event').replace('-', ' '))}</span></div>
        <div class="entry-body">${esc(entry.text || '')}</div>
        ${voiceHtml}`;
      ui.timeline.appendChild(card);
    });
    scrollToBottom(ui.timeline);
  }

  function renderVoiceLinesForEntry(entry) {
    if (!app.state || !entry?.text) return '';
    const voices = derivePerceptionVoices(app.state, entry);
    if (!voices.length) return '';
    return `<div class="voice">${voices.map(v => `<div class="voice-line"><div class="voice-label">${esc(v.label)}</div><div>${esc(v.text)}</div></div>`).join('')}</div>`;
  }

  function derivePerceptionVoices(state, entry) {
    const text = (entry.text || '').toLowerCase();
    const skills = state.skills;
    const voices = [];
    const sig = state.signatureSkill;

    if (skills.logic >= 4 && /(delay|minutes|seconds|clock|repeat|loop)/.test(text)) {
      voices.push({ label: 'Logic', text: 'Time markers don\'t align. Someone changed schedule language before changing systems.' });
    }
    if (skills.empathy >= 4 && /(breathing|shaking|calm|waited|hate|voice)/.test(text)) {
      voices.push({ label: 'Empathy', text: 'Stress leaks through word choice. The human variable is becoming the clock.' });
    }
    if (skills.shivers >= 4 && /(corridor|rain|hum|static|city|drizzle|stone)/.test(text)) {
      voices.push({ label: 'Shivers', text: 'The place itself is speaking in vents, weather, and bad wiring. Listen to the building.' });
    }
    if (skills.drama >= 4 && /(playback|spoof|credential|uniform|phrase)/.test(text)) {
      voices.push({ label: 'Drama', text: 'Everyone here is acting. Some of them just have better costumes.' });
    }
    if (skills.inlandEmpire >= 4 && /(paper|glass|static|rain|sealed|blackout)/.test(text)) {
      voices.push({ label: 'Inland Empire', text: 'Objects are carrying memory tonight. The paper matters because hands touched it in fear.' });
    }
    if (skills.halfLight >= 4 && /(alert|manual sweep|lockdown|grabbed|blood)/.test(text)) {
      voices.push({ label: 'Half Light', text: 'Threat rising. Stop narrating and reduce angles now.' });
    }
    if (sig && !voices.some(v => v.label === SKILLS[sig].label) && Math.random() < 0.15) {
      voices.push({ label: `Signature: ${SKILLS[sig].label}`, text: 'Your main lens keeps pulling the interpretation in its preferred direction.' });
    }
    return voices.slice(0, 2);
  }

  function renderChoices() {
    const s = app.state;
    ui.choiceArea.innerHTML = '';
    if (!s) {
      ui.choiceArea.innerHTML = `<div class="choice-prompt">Configure a build and start a scenario.</div>`;
      return;
    }
    if (s.ended) {
      ui.choiceArea.innerHTML = `<div class="choice-prompt">Session complete. Outcome: <strong>${esc(s.outcome || '—')}</strong></div>`;
      return;
    }
    if (!app.runtime.waitingForChoice) {
      ui.choiceArea.innerHTML = `<div class="choice-prompt">Receiving messages <span class="typing" aria-hidden="true"><span></span><span></span><span></span></span></div>`;
      return;
    }
    const list = el('div', { className: 'choice-list' });
    ui.choiceArea.innerHTML = `<div class="choice-prompt">Select a response. Checks use 2d6 + skill + situational modifiers (including transcript/log reads).</div>`;
    (s.pendingChoices || []).forEach((ch, idx) => {
      const btn = el('button', { className: 'choice-btn' });
      const checkText = ch.check ? `${ch.check.label} · ${SKILLS[ch.check.skill]?.label || ch.check.skill} · DC ${ch.check.difficulty}` : 'No check';
      const mods = ch.mods ? normalizeMods(ch.mods(s)).filter(m=>m.value!==0) : [];
      btn.innerHTML = `<div class="title">${esc(ch.title)}</div><div class="desc">${esc(ch.desc || '')}</div><div class="mini">${esc(checkText)}${mods.length ? ' · setup mods: ' + esc(mods.map(m => `${m.label} ${m.value>=0?'+':''}${m.value}`).join(', ')) : ''}</div>`;
      btn.addEventListener('click', () => selectChoice(idx));
      list.appendChild(btn);
    });
    ui.choiceArea.appendChild(list);
  }

  function renderMeters() {
    const s = app.state;
    const rows = [
      ['Health', s?.stats.health ?? 0, 12],
      ['Morale', s?.stats.morale ?? 0, 12],
      ['Sanity', s?.stats.sanity ?? 0, 100],
      ['Heat', s?.stats.heat ?? 0, 100],
      ['Progress', s?.stats.progress ?? 0, 100]
    ];
    ui.meterStrip.innerHTML = rows.map(([label, val, max]) => meterHtml(label, val, max)).join('');
  }

  function meterHtml(label, value, max) {
    const pct = clamp(Math.round((value / max) * 100), 0, 100);
    const mode = label === 'Heat' ? (pct >= 70 ? 'danger' : pct >= 45 ? 'warn' : '') : (label === 'Sanity' && pct <= 35 ? 'danger' : (label === 'Sanity' && pct <= 55 ? 'warn' : ''));
    const cls = mode ? `meter-fill ${mode}` : 'meter-fill';
    return `<div class="meter"><div class="meter-head"><span>${esc(label)}</span><span class="mono">${value}/${max}</span></div><div class="meter-track"><div class="${cls}" style="width:${pct}%"></div></div></div>`;
  }

  function renderQuickRelations() {
    const rels = app.state?.relations || {};
    const entries = Object.entries(rels).sort((a,b)=>b[1]-a[1]);
    ui.quickRelations.innerHTML = `<div class="muted small">Relationships</div><div class="chip-line">${entries.length ? entries.map(([k,v]) => `<span class="chip ${v>=55?'good':v<=40?'bad':''}">${esc(k)} ${v}</span>`).join('') : '<span class="empty">No data</span>'}</div>`;
  }

  function renderActiveFlags() {
    const mem = app.state?.memory || {};
    const trueFlags = Object.keys(mem).filter(k => !!mem[k]);
    ui.activeFlags.innerHTML = `<div class="muted small">Active memory flags</div><div class="chip-line">${trueFlags.length ? trueFlags.map(k=>`<span class="chip">${esc(k)}</span>`).join('') : '<span class="empty">None set yet</span>'}</div>`;
  }

  function renderStatsPanels() {
    const s = app.state;
    if (!s) {
      ui.statsContent.innerHTML = ui.skillsContent.innerHTML = ui.inventoryContent.innerHTML = ui.relationsContent.innerHTML = '<div class="empty">Start a session.</div>';
      return;
    }
    ui.statsContent.innerHTML = `
      <div class="kv-grid">
        <div class="kv-row"><div class="label">Session ID</div><div class="mono">${esc(s.sessionId)}</div></div>
        <div class="kv-row"><div class="label">Scenario</div><div>${esc(SCENARIOS[s.scenarioId].title)}</div></div>
        <div class="kv-row"><div class="label">Current Node</div><div>${esc(SCENARIOS[s.scenarioId].nodes[s.currentNodeId]?.label || 'Pending')}</div></div>
        <div class="kv-row"><div class="label">Outcome</div><div>${esc(s.outcome || '—')}</div></div>
        <div class="kv-row"><div class="label">Vitals</div><div>${['health','morale','sanity','heat','progress'].map(k=>`<span class="stat-badge">${esc(k)} <strong>${esc(String(s.stats[k]))}</strong></span>`).join(' ')}</div></div>
      </div>`;

    const groupedSkills = GROUP_ORDER.map(group => {
      const keys = SKILL_KEYS.filter(k => SKILLS[k].group === group);
      return `<div class="skill-group"><div class="kicker"><strong>${group}</strong></div><div class="skill-grid">${keys.map(k => skillRowHtml(s, k)).join('')}</div></div>`;
    }).join('<div class="divider"></div>');
    ui.skillsContent.innerHTML = groupedSkills;

    const invEntries = Object.entries(s.inventory);
    ui.inventoryContent.innerHTML = invEntries.length ? `<div class="table-list">${invEntries.map(([k,v])=>`<div class="table-row"><span>${esc(k)}</span><span class="mono">x${v}</span></div>`).join('')}</div>` : '<div class="empty">Inventory empty.</div>';

    const relEntries = Object.entries(s.relations).sort((a,b)=>b[1]-a[1]);
    ui.relationsContent.innerHTML = relEntries.length ? `<div class="table-list">${relEntries.map(([k,v])=>`<div class="table-row"><span>${esc(k)}</span><span class="mono">${v}</span></div>`).join('')}</div>` : '<div class="empty">No relationship data.</div>';
  }

  function skillRowHtml(state, key) {
    const value = state.skills[key] ?? 0;
    const tags = [];
    if (state.signatureSkill === key) tags.push('signature');
    if (value >= 5) tags.push('high');
    if (['logic','empathy','perception','volition'].includes(key)) tags.push('core');
    return `<div class="skill-row"><div class="skill-name"><div>${esc(SKILLS[key].label)}</div><small>${esc(SKILLS[key].blurb)}</small></div><div class="skill-tags">${tags.map(t => `<span class="tiny-tag">${esc(t)}</span>`).join('')}</div><div class="skill-value">${value}</div></div>`;
  }

  function renderContextPanels() {
    const s = app.state;
    if (!s) {
      ui.memoryContent.innerHTML = ui.worldContent.innerHTML = '<div class="empty">Start a session.</div>';
      return;
    }
    ui.memoryContent.innerHTML = `<div class="table-list">${Object.entries(s.memory).map(([k,v])=>`<div class="table-row"><span>${esc(k)}</span><span class="mono">${esc(String(v))}</span></div>`).join('')}</div>`;
    ui.worldContent.innerHTML = `<div class="kv-grid">${Object.entries(s.world).map(([k,v])=>`<div class="kv-row"><div class="label">${esc(k)}</div><div>${esc(String(v))}</div></div>`).join('')}</div>`;
  }

  function renderPerceptionPanels() {
    const s = app.state;
    if (!s) {
      ui.perceptionSummary.innerHTML = ui.signatureSummary.innerHTML = '<div class="empty">No active operator.</div>';
      return;
    }
    const top = topSkillEntries(s.skills, 6);
    ui.perceptionSummary.innerHTML = `
      <div class="muted small">Top skills shape passive interpretation and available checks.</div>
      <div class="table-list" style="margin-top:8px">${top.map(([k,v])=>`<div class="table-row"><span>${esc(SKILLS[k].label)} <span class="muted">(${esc(SKILLS[k].group)})</span></span><span class="mono">${v}</span></div>`).join('')}</div>`;
    const sig = s.signatureSkill;
    ui.signatureSummary.innerHTML = `
      <div class="muted small">Signature Skill</div>
      <h3 style="margin:6px 0 4px">${esc(SKILLS[sig].label)}</h3>
      <div class="muted">${esc(SKILLS[sig].blurb)}</div>
      <div class="kicker">This lens injects flavor into the timeline voices and slightly biases player interpretation.</div>`;
  }

  function renderLogs() {
    const logs = app.state?.logs || app._bootLogs || [];
    ui.logsContent.innerHTML = '';
    logs.slice(-200).forEach(l => {
      const div = el('div', { className: `log-entry ${l.level}` });
      div.innerHTML = `<div class="log-meta"><span>${fmtTime(l.ts)} · ${esc(l.level.toUpperCase())}</span><span>${esc(l.id.slice(-4))}</span></div><div>${esc(l.message)}</div>${l.data ? `<div class="muted" style="margin-top:4px">${esc(JSON.stringify(l.data))}</div>` : ''}`;
      ui.logsContent.appendChild(div);
    });
    ui.logCount.textContent = String(logs.length);
    scrollToBottom(ui.logsContent);
  }

  // ---------- File explorer ----------
  function buildVirtualFiles() {
    const s = app.state;
    const files = {
      'session://transcript.log': (s?.transcript || []).map(x => `[${x.ts}] ${x.author}: ${x.text}`).join('\n') || 'No transcript yet.',
      'session://engine.log': (s?.logs || app._bootLogs || []).map(l => `[${l.ts}] ${l.level.toUpperCase()} ${l.message}`).join('\n') || 'No engine logs yet.',
      'session://timeline.log': (s?.timeline || []).map(t => `[${t.ts}] ${t.author || 'System'} (${t.kind}): ${t.text}`).join('\n') || 'No timeline yet.',
      'session://memory.json': JSON.stringify(s?.memory || {}, null, 2),
      'session://inventory.json': JSON.stringify(s?.inventory || {}, null, 2),
      'session://relations.json': JSON.stringify(s?.relations || {}, null, 2),
      'session://world.json': JSON.stringify(s?.world || {}, null, 2),
      'session://state-debug.json': JSON.stringify(debugStateSnapshot(), null, 2),
      'save://autosave.json': localStorage.getItem(STORAGE_AUTOSAVE_KEY) || 'No autosave saved yet.',
      'save://manual.json': localStorage.getItem(STORAGE_KEY) || 'No manual save saved yet.'
    };
    return files;
  }

  function renderFileTree() {
    const files = buildVirtualFiles();
    const grouped = {};
    Object.keys(files).forEach(path => {
      const [root, rest] = path.split('://');
      grouped[root] ||= [];
      grouped[root].push(rest);
    });
    ui.fileTree.innerHTML = '';
    Object.entries(grouped).forEach(([root, entries]) => {
      const folder = el('div');
      folder.innerHTML = `<button class="tree-folder">📁 ${esc(root)}://</button>`;
      const indent = el('div', { className: 'tree-indent' });
      entries.sort().forEach(name => {
        const path = `${root}://${name}`;
        const btn = el('button', { className: `tree-file ${app.fileViewPath === path ? 'active' : ''}`, text: `📄 ${name}` });
        btn.addEventListener('click', () => {
          app.fileViewPath = path;
          renderFileTree();
          renderFileView();
        });
        indent.appendChild(btn);
      });
      folder.appendChild(indent);
      ui.fileTree.appendChild(folder);
    });
    if (!files[app.fileViewPath]) app.fileViewPath = Object.keys(files)[0];
  }

  function renderFileView() {
    const files = buildVirtualFiles();
    ui.activeFilePath.textContent = app.fileViewPath;
    ui.fileViewer.textContent = files[app.fileViewPath] || 'File not found.';
  }

  async function copyActiveFileToClipboard() {
    try {
      await navigator.clipboard.writeText(ui.fileViewer.textContent || '');
      pushEngineLog('info', `Copied ${app.fileViewPath}`);
    } catch (e) {
      pushEngineLog('warn', `Clipboard unavailable: ${e.message}`);
    }
  }

  // ---------- Debug ----------
  function renderDebugPanels() {
    ui.debugStateView.textContent = JSON.stringify(debugStateSnapshot(), null, 2);
  }

  function debugStateSnapshot() {
    const s = app.state;
    return {
      appVersion: APP_VERSION,
      running: app.runtime.running,
      waitingForChoice: app.runtime.waitingForChoice,
      showcaseRunning: app.runtime.showcaseRunning,
      stateSummary: s ? {
        sessionId: s.sessionId,
        scenarioId: s.scenarioId,
        currentNodeId: s.currentNodeId,
        ended: s.ended,
        outcome: s.outcome,
        stats: s.stats,
        pendingChoices: (s.pendingChoices || []).map(c => ({ id: c.id, title: c.title }))
      } : null
    };
  }

  function renderBranchGraph() {
    const s = app.state;
    if (!s) {
      ui.graphLegend.innerHTML = `<span class="tiny-tag">No session</span>`;
      ui.branchGraph.innerHTML = '<div class="empty">Start a scenario to inspect graph branches.</div>';
      return;
    }
    const sc = SCENARIOS[s.scenarioId];
    const visited = new Set(s.visitedNodes || []);
    const branchHits = new Map((s.branchHistory || []).map(b => [`${b.nodeId}::${b.choiceId}`, b]));
    const nodes = Object.entries(sc.nodes);
    // light reflow by deterministic shuffle seed
    const ordered = [...nodes].sort((a,b) => (hash(a[0] + app.graphReflowSeed) - hash(b[0] + app.graphReflowSeed)));

    ui.graphLegend.innerHTML = [
      '<span class="tiny-tag">current = green</span>',
      '<span class="tiny-tag">visited = blue</span>',
      '<span class="tiny-tag">end choices = purple edge markers</span>',
      '<span class="tiny-tag">hit edge = highlighted</span>'
    ].join('');

    ui.branchGraph.innerHTML = ordered.map(([nodeId, node]) => {
      const nodeClasses = ['graph-node'];
      if (visited.has(nodeId)) nodeClasses.push('visited');
      if (s.currentNodeId === nodeId && !s.ended) nodeClasses.push('current');
      const edgeHtml = (node.choices || []).map(ch => {
        const hit = branchHits.get(`${nodeId}::${ch.id}`);
        const cls = ['edge-item'];
        if (hit) cls.push(hit.success === false ? 'fail' : 'hit');
        const targetInfo = hit?.end ? 'END' : (hit?.next || ch.next || '?');
        const checkLabel = ch.check ? `${SKILLS[ch.check.skill]?.label || ch.check.skill} DC${ch.check.difficulty}` : 'no check';
        return `<div class="${cls.join(' ')}"><div><strong>${esc(ch.title)}</strong></div><div class="muted">${esc(checkLabel)} → ${esc(targetInfo)}</div></div>`;
      }).join('');
      return `<article class="${nodeClasses.join(' ')}"><h4>${esc(node.label)}</h4><p>${esc(node.summary || '')}</p><div class="edge-list">${edgeHtml || '<div class="empty">No edges</div>'}</div></article>`;
    }).join('');
  }

  function exportGraphJson() {
    const s = app.state;
    if (!s) return;
    const sc = SCENARIOS[s.scenarioId];
    const graph = {
      scenarioId: sc.id,
      nodes: Object.entries(sc.nodes).map(([id, n]) => ({
        id,
        label: n.label,
        summary: n.summary,
        edges: (n.choices || []).map(ch => ({ id: ch.id, title: ch.title, check: ch.check || null }))
      })),
      branchHistory: s.branchHistory
    };
    downloadJson(graph, `signal-desk-branch-graph-${sc.id}.json`);
    pushEngineLog('info', 'Branch graph exported to JSON');
  }

  // ---------- Hacker mode ----------
  function openHackerMode() {
    if (!app.state) return;
    buildHackerFields();
    ui.hackerOverlay.classList.add('visible');
  }
  function closeHackerMode() { ui.hackerOverlay.classList.remove('visible'); }

  function buildHackerFields() {
    const s = app.state;
    if (!s) return;
    ui.hackerCore.innerHTML = '';
    ui.hackerSkills.innerHTML = '';

    const core = el('div', { className: 'hacker-grid' });
    const coreFields = [
      ['health', s.stats.health], ['morale', s.stats.morale], ['sanity', s.stats.sanity], ['heat', s.stats.heat], ['progress', s.stats.progress],
      ['outcome', s.outcome || ''], ['currentNodeId', s.currentNodeId || ''], ['signatureSkill', s.signatureSkill]
    ];
    coreFields.forEach(([k, v]) => core.appendChild(fieldInput(`hack_core_${k}`, k, v)));
    ui.hackerCore.appendChild(core);

    const skillGrid = el('div', { className: 'hacker-grid' });
    SKILL_KEYS.forEach(k => skillGrid.appendChild(fieldInput(`hack_skill_${k}`, SKILLS[k].label, s.skills[k])));
    ui.hackerSkills.appendChild(skillGrid);

    ui.hackMemoryJson.value = JSON.stringify(s.memory, null, 2);
    ui.hackInventoryJson.value = JSON.stringify(s.inventory, null, 2);
    ui.hackRelationsJson.value = JSON.stringify(s.relations, null, 2);
  }

  function fieldInput(id, label, value) {
    const wrap = el('label', { className: 'field' });
    wrap.innerHTML = `<span class="field-label">${esc(label)}</span><input id="${esc(id)}" class="text-input" value="${esc(String(value))}" />`;
    return wrap;
  }

  function applyHackerChanges() {
    const s = app.state;
    if (!s) return;
    try {
      ['health','morale','sanity','heat','progress'].forEach(k => {
        const v = Number(document.getElementById(`hack_core_${k}`).value);
        if (!Number.isNaN(v)) s.stats[k] = clamp(Math.round(v), 0, k === 'sanity' || k === 'heat' || k === 'progress' ? 100 : 12);
      });
      s.outcome = document.getElementById('hack_core_outcome').value || null;
      const nodeCandidate = document.getElementById('hack_core_currentNodeId').value.trim();
      if (nodeCandidate && SCENARIOS[s.scenarioId].nodes[nodeCandidate]) s.currentNodeId = nodeCandidate;
      const sig = document.getElementById('hack_core_signatureSkill').value.trim();
      if (SKILLS[sig]) s.signatureSkill = sig;
      SKILL_KEYS.forEach(k => {
        const v = Number(document.getElementById(`hack_skill_${k}`).value);
        if (!Number.isNaN(v)) s.skills[k] = clamp(Math.round(v), 0, 20);
      });
      s.memory = safeParseJson(ui.hackMemoryJson.value, s.memory, 'memory JSON');
      s.inventory = safeParseJson(ui.hackInventoryJson.value, s.inventory, 'inventory JSON');
      s.relations = safeParseJson(ui.hackRelationsJson.value, s.relations, 'relations JSON');
      s.updatedAt = new Date().toISOString();
      pushEngineLog('info', 'Hacker mode applied changes');
      renderEverything();
      scheduleAutosave('hacker');
      closeHackerMode();
    } catch (e) {
      pushEngineLog('error', `Hacker apply failed: ${e.message}`);
      alert(`Hacker apply failed: ${e.message}`);
    }
  }

  function safeParseJson(text, fallback, label) {
    try { return JSON.parse(text); }
    catch (e) { throw new Error(`${label} invalid JSON (${e.message})`); }
  }

  // ---------- Save / Load / Export ----------
  function serializeAppSnapshot(kind = 'manual') {
    return {
      savedAt: new Date().toISOString(),
      kind,
      appVersion: APP_VERSION,
      setup: app.setup,
      runtimeUi: {
        currentTab: app.runtime.currentTab,
        showPerceptionVoices: app.runtime.showPerceptionVoices,
        fileViewPath: app.fileViewPath
      },
      state: app.state
    };
  }

  function manualSave(kind = 'manual') {
    const payload = serializeAppSnapshot(kind);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setAutosaveMeta('Saved (manual)');
    pushEngineLog('info', 'Manual save written to localStorage');
    renderFileTree(); renderFileView();
  }

  function scheduleAutosave(reason) {
    if (app.runtime.autosaveTimer) clearTimeout(app.runtime.autosaveTimer);
    setAutosaveMeta(`Queued (${reason})`);
    app.runtime.autosaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_AUTOSAVE_KEY, JSON.stringify(serializeAppSnapshot('autosave')));
        setAutosaveMeta('Autosaved');
      } catch (e) {
        setAutosaveMeta('Autosave failed');
        pushEngineLog('error', `Autosave failed: ${e.message}`);
      }
      renderFileTree(); renderFileView();
    }, 250);
  }

  function loadFromStorageAndResume() {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_AUTOSAVE_KEY);
    if (!raw) {
      pushEngineLog('warn', 'No save found in localStorage');
      return;
    }
    let data;
    try { data = JSON.parse(raw); } catch (e) { pushEngineLog('error', `Save parse failed: ${e.message}`); return; }
    restoreFromSnapshot(data, { resume: true });
    pushEngineLog('info', `Loaded save (${data.kind || 'unknown'})`);
  }

  function loadSaveIntoSetup() {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_AUTOSAVE_KEY);
    if (!raw) {
      pushEngineLog('warn', 'No save present to load into setup');
      return;
    }
    let data;
    try { data = JSON.parse(raw); } catch (e) { pushEngineLog('error', `Save parse failed: ${e.message}`); return; }
    if (data.setup) {
      app.setup = sanitizeSetup(data.setup);
      renderSetup();
      pushEngineLog('info', 'Loaded build config into setup overlay');
    }
  }

  function restoreFromSnapshot(data, { resume = true } = {}) {
    if (data.setup) app.setup = sanitizeSetup(data.setup);
    app.state = data.state ? sanitizeState(data.state) : null;
    if (data.runtimeUi) {
      app.runtime.currentTab = ['messages','files','stats','context','debug'].includes(data.runtimeUi.currentTab) ? data.runtimeUi.currentTab : 'messages';
      app.runtime.showPerceptionVoices = data.runtimeUi.showPerceptionVoices !== false;
      app.fileViewPath = data.runtimeUi.fileViewPath || 'session://transcript.log';
    }
    if (app.state) flushBootLogsIntoSession();
    app.runtime.running = !!(app.state && !app.state.ended);
    app.runtime.waitingForChoice = !!(app.state && app.state.pendingChoices && app.state.pendingChoices.length);
    if (resume && app.state) ui.setupOverlay.classList.remove('visible');
    else ui.setupOverlay.classList.add('visible');
    setTab(app.runtime.currentTab || 'messages');
    renderEverything();
    setAutosaveMeta(`Loaded ${data.kind || 'save'}`);
  }

  function sanitizeSetup(setup) {
    const fallback = structuredClone(app.setup);
    const out = {
      selectedScenarioId: SCENARIOS[setup.selectedScenarioId] ? setup.selectedScenarioId : fallback.selectedScenarioId,
      selectedArchetypeId: ARCHETYPES.some(a=>a.id===setup.selectedArchetypeId) ? setup.selectedArchetypeId : fallback.selectedArchetypeId,
      signatureSkill: SKILLS[setup.signatureSkill] ? setup.signatureSkill : fallback.signatureSkill,
      skills: {},
      pointsLeft: clamp(Number(setup.pointsLeft) || 0, 0, SETUP_POINTS)
    };
    SKILL_KEYS.forEach(k => out.skills[k] = clamp(Number(setup.skills?.[k]) || 1, 1, 6));
    return out;
  }

  function sanitizeState(state) {
    const sc = SCENARIOS[state.scenarioId] ? SCENARIOS[state.scenarioId] : getSelectedScenario();
    const fresh = createInitialState(sc);
    const out = { ...fresh, ...state };
    out.stats = {
      health: clamp(Number(state.stats?.health ?? fresh.stats.health), 0, 12),
      morale: clamp(Number(state.stats?.morale ?? fresh.stats.morale), 0, 12),
      sanity: clamp(Number(state.stats?.sanity ?? fresh.stats.sanity), 0, 100),
      heat: clamp(Number(state.stats?.heat ?? fresh.stats.heat), 0, 100),
      progress: clamp(Number(state.stats?.progress ?? fresh.stats.progress), 0, 100)
    };
    out.skills = {};
    SKILL_KEYS.forEach(k => out.skills[k] = clamp(Number(state.skills?.[k] ?? fresh.skills[k]), 0, 20));
    out.signatureSkill = SKILLS[state.signatureSkill] ? state.signatureSkill : fresh.signatureSkill;
    out.inventory = typeof state.inventory === 'object' && state.inventory ? state.inventory : fresh.inventory;
    out.memory = typeof state.memory === 'object' && state.memory ? state.memory : fresh.memory;
    out.relations = typeof state.relations === 'object' && state.relations ? state.relations : fresh.relations;
    out.world = typeof state.world === 'object' && state.world ? state.world : fresh.world;
    out.transcript = Array.isArray(state.transcript) ? state.transcript : [];
    out.timeline = Array.isArray(state.timeline) ? state.timeline : [];
    out.logs = Array.isArray(state.logs) ? state.logs : [];
    out.visitedNodes = Array.isArray(state.visitedNodes) ? state.visitedNodes : [];
    out.branchHistory = Array.isArray(state.branchHistory) ? state.branchHistory : [];
    out.pendingChoices = [];
    if (!out.ended && out.currentNodeId && sc.nodes[out.currentNodeId]) {
      const nodeChoices = (sc.nodes[out.currentNodeId].choices || []).filter(ch => !ch.requires || ch.requires(out));
      const unresolved = !out.branchHistory.some(b => b.nodeId === out.currentNodeId && (b.end || b.next || true));
      if (unresolved) out.pendingChoices = nodeChoices;
      else if (state.pendingChoices?.length) out.pendingChoices = nodeChoices;
    }
    return out;
  }

  function clearSavedState() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_AUTOSAVE_KEY);
    setAutosaveMeta('Cleared');
    pushEngineLog('info', 'Cleared localStorage saves');
    renderFileTree(); renderFileView();
  }

  function exportSessionJson() {
    if (!app.state) {
      pushEngineLog('warn', 'No active session to export');
      return;
    }
    downloadJson(serializeAppSnapshot('export'), `signal-desk-session-${app.state.sessionId}.json`);
    pushEngineLog('info', 'Exported session JSON');
  }

  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Autoplay ----------
  function startAutoplayShowcase() {
    if (!app.state) {
      if (ui.setupOverlay.classList.contains('visible')) {
        quickBalancedBuild();
        app.setup.selectedScenarioId = app.setup.selectedScenarioId || Object.keys(SCENARIOS)[0];
        if (app.setup.pointsLeft !== 0) {
          // spend remaining on useful mixed set
          while (app.setup.pointsLeft > 0) {
            for (const k of ['perception','logic','empathy','interfacing','composure','volition','shivers','reactionSpeed']) {
              if (app.setup.pointsLeft <= 0) break;
              if (app.setup.skills[k] < 6) {
                app.setup.skills[k] += 1;
                app.setup.pointsLeft -= 1;
              }
            }
          }
        }
        renderSetup();
        app.runtime.showcaseRunning = true;
        startScenarioFromSetup();
        return;
      }
      return;
    }
    app.runtime.showcaseRunning = true;
    pushEngineLog('info', 'Autoplay showcase enabled');
    if (app.runtime.waitingForChoice) scheduleAutoplayChoice();
  }

  function scheduleAutoplayChoice() {
    clearTimeout(app._showcaseChoiceTimer);
    app._showcaseChoiceTimer = setTimeout(() => {
      if (!app.state || !app.runtime.waitingForChoice || app.state.ended) return;
      const choices = app.state.pendingChoices || [];
      if (!choices.length) return;
      const bestIdx = pickAutoplayChoiceIndex(choices);
      selectChoice(bestIdx);
    }, 380);
  }

  function pickAutoplayChoiceIndex(choices) {
    const s = app.state;
    let best = 0;
    let bestScore = -Infinity;
    choices.forEach((ch, i) => {
      let score = 0;
      if (ch.check) score += (s.skills[ch.check.skill] || 0) * 2 - ch.check.difficulty;
      if (/evidence|manifest|ledger|archive|index/i.test(ch.title)) score += 2;
      if (s.stats.heat > 65 && /blackout|force|burn/i.test(ch.title)) score -= 3;
      if (s.relations.Mira && s.relations.Mira < 45 && /push|force/i.test(ch.title)) score -= 4;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  }

  // ---------- UI helpers ----------
  function setTab(tab) {
    app.runtime.currentTab = tab;
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-page').forEach(p => p.classList.toggle('active', p.dataset.tabPage === tab));
    updateMetaBar();
  }

  function toggleAllAccordions() {
    const items = [...document.querySelectorAll('.accordion-item')];
    const allCollapsed = items.every(i => i.classList.contains('collapsed'));
    items.forEach(i => i.classList.toggle('collapsed', !allCollapsed));
  }

  function updateMetaBar() {
    ui.metaScenario.textContent = app.state ? SCENARIOS[app.state.scenarioId].title : getSelectedScenario().title;
    ui.metaStatus.textContent = app.state ? (app.state.ended ? 'Ended' : app.runtime.waitingForChoice ? 'Awaiting choice' : 'Processing') : 'Setup';
  }

  function setAutosaveMeta(text) { ui.metaAutosave.textContent = text; }

  function recordBranchHistory(entry) {
    if (!app.state) return;
    app.state.branchHistory.push({ ts: new Date().toISOString(), ...entry });
    app.state.updatedAt = new Date().toISOString();
  }

  function inferFeedKind(item) {
    const txt = (item.text || '').toLowerCase();
    if (/alert|lockdown|blood|manual/.test(txt)) return 'alert';
    if (/system|relay|connection|outcome|route/.test(txt)) return 'system';
    if (/protocol|dispatch|trace|internal/.test(txt)) return 'trace';
    return item.author === 'Operator' ? 'system' : 'npc';
  }

  function pillHtml(label, value) { return `<span class="pill"><span>${esc(label)}:</span> <strong>${esc(String(value))}</strong></span>`; }

  function el(tag, opts = {}) {
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text !== undefined) node.textContent = opts.text;
    return node;
  }

  function topSkillEntries(skillMap, n) {
    return Object.entries(skillMap).sort((a,b)=>b[1]-a[1] || SKILLS[a[0]].label.localeCompare(SKILLS[b[0]].label)).slice(0, n);
  }
  function groupSkillPairs(skillMap) {
    const grouped = {};
    GROUP_ORDER.forEach(g => grouped[g] = []);
    Object.entries(skillMap).forEach(([k,v]) => grouped[SKILLS[k].group].push([k,v]));
    GROUP_ORDER.forEach(g => grouped[g].sort((a,b)=>b[1]-a[1]));
    return grouped;
  }

  function normalizeMods(mods) {
    if (!mods) return [];
    return mods.map(m => ({ label: m.label || 'mod', value: Number(m.value) || 0 }));
  }

  function transcriptKeywordCount(state, keywords) {
    const text = (state.transcript || []).map(t => t.text.toLowerCase()).join(' ');
    return countKeywordsInText(text, keywords);
  }

  function countKeywordsInText(text, keywords) {
    let count = 0;
    for (const k of keywords) if (text.includes(k.toLowerCase())) count++;
    return count;
  }

  function fmtModSum(mods) {
    const sum = (mods || []).reduce((a,m)=>a+(m.value||0),0);
    return sum === 0 ? '' : ` ${sum >= 0 ? '+' : '-'} ${Math.abs(sum)}`;
  }

  function d6() { return Math.floor(Math.random() * 6) + 1; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function fmtTime(ts) {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  }
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function hash(s) { let h = 0; for (let i=0;i<s.length;i++) h = ((h<<5)-h)+s.charCodeAt(i) | 0; return h; }
  function scrollToBottom(node) { if (!node) return; node.scrollTop = node.scrollHeight; }

  function clearRuntimeTimers() {
    clearTimeout(app.runtime.pendingMessageTimer);
    clearTimeout(app._showcaseChoiceTimer);
    clearTimeout(app.runtime.autosaveTimer);
  }

  // ---- Resume pending choices after load ----
  const originalRenderEverything = renderEverything;
  renderEverything = function patchedRenderEverything() {
    if (app.state) flushBootLogsIntoSession();
    originalRenderEverything();
  };

})();
