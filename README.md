# 🏝️ Catan Stats

Persönliche Statistik-App für das Catan-Trio **Dominic · Dante · Carl** — 1v1v1-Daten seit April 2025.

## Features

- **Dashboard** — Übersicht: Gesamtsiege, Siegraten, Serien, Linien- & Balkendiagramme
- **Spielabend-Historie** — Alle Abende chronologisch, neuen Eintrag hinzufügen, Einträge löschen
- **Duo-Listen** — Unabhängige Kopf-an-Kopf-Listen: Dome vs Carl & Dome vs Dante
- **Analyse** — Detaillierte Graphen: kumulativ, Torte, Monatstabelle, Form der letzten 10 Abende

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (dark, Catan-inspiriert)
- **Recharts** für alle Diagramme
- **localStorage** für Datenpersistenz (kein Backend nötig)
- Schriftarten: **Cinzel** (Display) + **Crimson Pro** (Body) + **JetBrains Mono**

## Setup

```bash
npm install
npm run dev
```

Dann `http://localhost:5173` aufrufen.

## Daten

Alle Spieldaten liegen in `localStorage` im Browser. Die Seed-Daten (April 2025 – Juni 2026) werden beim ersten Aufruf automatisch geladen. Neue Einträge bleiben dauerhaft gespeichert.
