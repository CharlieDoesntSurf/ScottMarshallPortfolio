const munitions = [
  {
    "id": 1,
    "name": "LRASM / C-1",
    "kind": "Anti-ship cruise",
    "launch": [
      "Air"
    ],
    "km": 370,
    "rangeLabel": "230+ miles",
    "cost": "$3–5M",
    "status": "Operational",
    "model": "lrasm",
    "fullName": "AGM-158C LRASM / C-1",
    "platform": "Low-observable anti-ship cruise missile; B-1B and F/A-18E/F",
    "rangeNote": "230+ miles; actual maximum undisclosed",
    "costNote": "$3–5 million",
    "role": "Operational; explicitly designed for high-value, defended maritime targets."
  },
  {
    "id": 2,
    "name": "LRASM C-3",
    "kind": "Anti-ship cruise",
    "launch": [
      "Air"
    ],
    "km": null,
    "rangeLabel": "Undisclosed",
    "cost": "Not established",
    "status": "Emerging",
    "model": "lrasm",
    "fullName": "LRASM C-3",
    "platform": "Extended-range evolution of air-launched LRASM",
    "rangeNote": "Undisclosed",
    "costNote": "Not reliably established separately",
    "role": "Newer procurement/development variant; do not assume fleet-wide availability."
  },
  {
    "id": 3,
    "name": "Maritime Strike Tomahawk",
    "kind": "Anti-ship cruise",
    "launch": [
      "Sea"
    ],
    "km": null,
    "rangeLabel": "Va: undisclosed",
    "cost": "Several million",
    "status": "Variant caveat",
    "model": "tomahawk",
    "fullName": "Maritime Strike Tomahawk, Block Va",
    "platform": "Anti-ship cruise missile; naval launch platforms",
    "rangeNote": "Variant-specific range undisclosed; 1,000 miles is a Tomahawk-family reference, not a verified Va figure",
    "costNote": "Several million dollars; baseline Block V is about $3.64 million, before variant-specific differences",
    "role": "Maritime-strike variant; ordinary land-attack Tomahawks should not be treated as equivalent."
  },
  {
    "id": 4,
    "name": "Naval Strike Missile",
    "kind": "Anti-ship cruise",
    "launch": [
      "Sea"
    ],
    "km": 300,
    "rangeLabel": "186+ miles",
    "cost": "$2–3M",
    "status": "Operational",
    "model": null,
    "fullName": "Naval Strike Missile—ship-launched",
    "platform": "Passive-infrared-guided anti-ship cruise missile; surface ships",
    "rangeNote": "Manufacturer currently advertises 186+ miles; older configurations have lower published figures",
    "costNote": "$2–3 million",
    "role": "Operational anti-ship weapon; range depends on configuration."
  },
  {
    "id": 5,
    "name": "NSM / NMESIS",
    "kind": "Anti-ship cruise",
    "launch": [
      "Ground"
    ],
    "km": 300,
    "rangeLabel": "186+ miles",
    "cost": "$2–3M",
    "status": "Operational",
    "model": null,
    "fullName": "Naval Strike Missile—NMESIS",
    "platform": "Same missile family, launched from Marine Corps ground vehicles",
    "rangeNote": "Same configuration caveat as above",
    "costNote": "$2–3 million, missile only",
    "role": "Ground-based coastal anti-ship capability; not a separate missile design."
  },
  {
    "id": 6,
    "name": "Joint Strike Missile",
    "kind": "Dual-role cruise",
    "launch": [
      "Air"
    ],
    "km": 350,
    "rangeLabel": "217+ miles",
    "cost": "$2.7–3M",
    "status": "Procurement",
    "model": null,
    "fullName": "Joint Strike Missile—JSM",
    "platform": "Air-launched anti-ship/land-attack cruise missile; designed for internal F-35A/C carriage",
    "rangeNote": "Manufacturer advertises 217+ miles",
    "costNote": "$2.7–3 million",
    "role": "U.S. procurement underway; purchase and delivery do not by themselves establish operational integration."
  },
  {
    "id": 7,
    "name": "AGM-84 Harpoon",
    "kind": "Anti-ship cruise",
    "launch": [
      "Air"
    ],
    "km": 120,
    "rangeLabel": "75+ miles",
    "cost": "$1–2M",
    "status": "Established",
    "model": "harpoon",
    "fullName": "AGM-84 Harpoon, including Block II+",
    "platform": "Radar-guided anti-ship cruise missile; aircraft",
    "rangeNote": "Roughly 75+ miles, varying by version and launch conditions",
    "costNote": "$1–2 million indicative",
    "role": "Established air-launched anti-ship family; II+ adds targeting and communications improvements."
  },
  {
    "id": 8,
    "name": "RGM-84 Harpoon",
    "kind": "Anti-ship cruise",
    "launch": [
      "Sea"
    ],
    "km": 120,
    "rangeLabel": "75+ miles",
    "cost": "$1–2M",
    "status": "Established",
    "model": "harpoon",
    "fullName": "RGM-84 Harpoon",
    "platform": "Radar-guided anti-ship cruise missile; surface ships",
    "rangeNote": "Roughly 75+ miles, version dependent",
    "costNote": "$1–2 million indicative",
    "role": "Established surface-launched version of the same family."
  },
  {
    "id": 9,
    "name": "AGM-84K SLAM-ER",
    "kind": "Dual-role cruise",
    "launch": [
      "Air"
    ],
    "km": 280,
    "rangeLabel": "174+ miles",
    "cost": "$1–3M",
    "status": "Legacy",
    "model": null,
    "fullName": "AGM-84K SLAM-ER",
    "platform": "Precision land/sea-strike cruise missile; aircraft",
    "rangeNote": "174+ miles",
    "costNote": "$1–3 million, highly dependent on vintage and procurement basis",
    "role": "Legacy standoff weapon with publicly documented sea-target capability."
  },
  {
    "id": 10,
    "name": "SM-6",
    "kind": "Multipurpose",
    "launch": [
      "Sea"
    ],
    "km": null,
    "rangeLabel": "Anti-ship: undisclosed",
    "cost": "$4–6M",
    "status": "Operational",
    "model": null,
    "fullName": "SM-6, ship-launched",
    "platform": "Supersonic multipurpose missile; air defense and anti-surface roles",
    "rangeNote": "Anti-ship engagement range not publicly established",
    "costNote": "$4–6 million",
    "role": "Operational anti-surface capability; general range estimates should not be assumed to describe its ship-engagement envelope."
  },
  {
    "id": 11,
    "name": "PrSM Increment 2",
    "kind": "Precision strike",
    "launch": [
      "Ground"
    ],
    "km": 400,
    "rangeLabel": "249+ miles class",
    "cost": "Not established",
    "status": "Emerging",
    "model": null,
    "fullName": "PrSM Increment 2",
    "platform": "Ground-launched precision-strike missile with maritime seeker; HIMARS/M270",
    "rangeNote": "250+ miles class; first flight test covered 217 miles",
    "costNote": "Reliable Increment 2 unit price unavailable",
    "role": "Emerging capability: maritime tests and initial production contract in 2026; not equivalent to widely fielded inventory."
  },
  {
    "id": 12,
    "name": "Spike NLOS",
    "kind": "Precision strike",
    "launch": [
      "Air"
    ],
    "km": 32,
    "rangeLabel": "20 miles",
    "cost": "Not established",
    "status": "Limited fielding",
    "model": null,
    "fullName": "Spike NLOS",
    "platform": "Electro-optical guided missile; U.S. Army Apache",
    "rangeNote": "20 miles for the documented U.S. configuration",
    "costNote": "Reliable comparable U.S. unit price unavailable",
    "role": "Limited-fielding precision weapon; demonstrated against a stationary vessel. Not a large-warship standoff equivalent."
  },
  {
    "id": 13,
    "name": "AGM-65 Maverick",
    "kind": "Precision strike",
    "launch": [
      "Air"
    ],
    "km": 22,
    "rangeLabel": "~14 miles historical",
    "cost": "$0.1–0.3M historical",
    "status": "Legacy",
    "model": null,
    "fullName": "AGM-65 Maverick",
    "platform": "Tactical air-to-surface missile; aircraft",
    "rangeNote": "Historical public figure 14 miles; current USAF fact sheet lists range as classified",
    "costNote": "Historical acquisition roughly $0.1–0.3 million; not a current replacement quote",
    "role": "Legacy weapon with maritime applications; substantially shorter-ranged than dedicated anti-ship cruise missiles."
  },
  {
    "id": 14,
    "name": "AGM-114 Hellfire",
    "kind": "Precision strike",
    "launch": [
      "Air",
      "Sea"
    ],
    "km": 8,
    "rangeLabel": "~5 miles",
    "cost": "$0.1–0.2M",
    "status": "Small-craft role",
    "model": null,
    "fullName": "AGM-114 Hellfire",
    "platform": "Small precision missile; helicopters, drones, some naval installations",
    "rangeNote": "Typically 5 miles, variant dependent",
    "costNote": "$0.1–0.2 million",
    "role": "Relevant to small craft; not a credible substitute for long-range weapons against major defended warships."
  },
  {
    "id": 15,
    "name": "AGM-179 JAGM",
    "kind": "Precision strike",
    "launch": [
      "Air"
    ],
    "km": 8,
    "rangeLabel": "5 miles baseline",
    "cost": "$0.3–0.4M",
    "status": "Small-craft role",
    "model": null,
    "fullName": "AGM-179 JAGM",
    "platform": "Dual-mode-guided precision missile; attack helicopters",
    "rangeNote": "5 miles baseline",
    "costNote": "$0.3–0.4 million",
    "role": "Operational; maritime patrol craft are a stated target category. Extended-range developments are separate."
  }
];
