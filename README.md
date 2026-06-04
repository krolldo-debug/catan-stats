# 🏝️ Catan Stats

Persönliche Statistik-App für das Catan-Trio **Dominic · Dante · Carl** — 1v1v1-Daten seit April 2025.

## Features

- **Dashboard** — Übersicht: Gesamtsiege, Siegraten, Serien, Linien- & Balkendiagramme
- **Spielabend-Historie** — Alle Abende chronologisch, neuen Eintrag hinzufügen, Einträge löschen
- **Duo-Listen** — Unabhängige Kopf-an-Kopf-Listen: Dome vs Carl & Dome vs Dante
- **Analyse** — Detaillierte Graphen: kumulativ, Torte, Monatstabelle, Form der letzten 10 Abende

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (dark, Catan-inspiriert), mobile-first mit Bottom-Tab-Bar
- **Recharts** für alle Diagramme
- **Vercel KV / Upstash Redis** als zentrale Cloud-Datenbank (Sync über alle Geräte)
- **localStorage** als Offline-Cache
- Schriftarten: **Cinzel** (Display) + **Crimson Pro** (Body) + **JetBrains Mono**

## Setup (lokal)

```bash
npm install
npm run dev
```

Lokal läuft die App ohne Cloud-Verbindung auf dem localStorage-Cache. Für echten
Sync wird die App auf Vercel deployed (siehe unten).

## Cloud-Datenbank einrichten (Vercel KV)

Damit alle Geräte dieselbe Liste sehen, braucht das Projekt einen KV-Store:

1. Vercel-Projekt öffnen → Tab **Storage** → **Create Database**
2. **Upstash Redis** (bzw. „KV") auswählen → erstellen
3. Den Store mit dem Projekt **verbinden** (Connect Project)
   → Vercel legt automatisch die Variablen `KV_REST_API_URL` und
   `KV_REST_API_TOKEN` an
4. Neu deployen (Push auf `master` oder „Redeploy" in Vercel)

Die App liest/schreibt dann über `/api/data` in die Cloud-DB.

> **Wichtig beim ersten Mal:** Nach dem Deploy zuerst das Gerät mit den
> **aktuellsten Daten** öffnen (z. B. den PC). Es lädt seine lokalen Daten
> einmalig in die noch leere Cloud. Erst danach die anderen Geräte öffnen –
> die ziehen sich dann automatisch dieselbe Liste.

## Architektur

- `api/data.js` — Serverless-Funktion: `GET` liest, `POST` speichert den
  kompletten Datensatz (`gameNights`, `duoCarl`, `duoDante`) in Redis
- `src/hooks/useGameData.js` — lädt beim Start aus der Cloud, zeigt sofort den
  lokalen Cache an und schreibt jede Änderung in Cloud + Cache zurück
- Eine kleine Statusanzeige oben rechts zeigt „Speichert…" bzw. „Offline"
