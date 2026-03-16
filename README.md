# HumanAI Trust Experiment Prototype

## Overview

This repo is a MVP for a human-AI trust experiment. The scope is intentionally minimal, but the internal structure is modular so it can grow into the broader experimentation engine described in the full HumanAI project brief.

I designed with the goal to keep the app small while making the core experiment pieces easy to replace, extend, and analyze.

## Home Page

![Home page](./img/homepage.png)

## System Design

The first step in approaching this project was to develop a comprehensive system design to ensure each deliverable will be met and so I can start developing with a long-term vision in mind.

```mermaid
flowchart LR
    subgraph Shared["Shared Layer"]
        direction TB
        SharedStack["Contracts + experiment configuration"]
        Types["types.ts<br/>shared TypeScript data contracts"]
        Conditions["conditions.ts<br/>cue definitions"]
        Tasks["tasks.ts<br/>task definitions"]

        SharedStack --- Types
        SharedStack --- Conditions
        SharedStack --- Tasks
    end

    subgraph Client["Client Layer"]
        direction TB
        ClientStack["Browser runtime<br/>Next.js + React + TypeScript"]
        Participant["participant"]
        Shell["ExperimentShell.tsx<br/>client state orchestration"]
        Session["participant.ts<br/>participant ID + localStorage assignment"]
        UI["DecisionTask / ConditionBanner / SubmissionState<br/>participant-facing interface"]
        LogClient["logger.ts<br/>fetch JSON to /api/log"]

        ClientStack --- Shell
        Participant -->|reads case + makes decision| UI
        Shell -->|renders + coordinates| UI
        Shell -.->|reads/writes session state| Session
        Shell -.->|loads cue config| Conditions
        Shell -.->|loads task config| Tasks
        Shell -.->|uses event types| Types
        UI -->|decision + latency_ms| LogClient
    end

    subgraph Server["Server Layer"]
        direction TB
        ServerStack["Next.js App Router<br/>Route Handler + Node.js"]
        Route["app/api/log/route.ts<br/>POST /api/log route handler"]
        Validate["validation.ts<br/>schema + field validation"]
        Storage["fileStorage.ts<br/>Node.js fs appendFile(JSONL)"]

        ServerStack --- Route
        LogClient -->|HTTP POST + JSON| Route
        Route -->|validate payload| Validate
        Route -.->|uses event types| Types
        Route -->|append valid event| Storage
    end

    subgraph Data["Data Layer"]
        direction TB
        DataStack["Local persistence + export / analysis"]
        RuntimeLog[("data/logs.jsonl<br/>append-only runtime log")]
        SampleJson["data/sample_output.jsonl<br/>sample event records"]
        CsvTools["exportCsv.ts + generate-sample-csv.ts<br/>CSV serialization utilities"]
        SampleCsv["data/sample_output.csv<br/>reviewable CSV output"]
        Notebook["notebooks/trust_analysis.ipynb<br/>analysis notebook"]

        DataStack --- RuntimeLog
        Storage -->|write JSONL line| RuntimeLog
        CsvTools -.->|uses event types| Types
        SampleJson -->|serialize to CSV| CsvTools
        CsvTools -->|generate sample artifact| SampleCsv
        SampleJson -->|load sample records| Notebook
        SampleCsv -->|tabular inspection| Notebook
    end
```

## Condition Logic

The experiment has two conditions that differ only in how the assistant is presented.

- Condition A uses a more system-like assistant label and a neutral, formal tone
- Condition B uses a more humanlike assistant name and a warmer, conversational tone
- the actual reccomendation content itself stays the same

## Logging Implementation

The client measures task-response latency with `performance.now()`, then submits a single decision event to `/api/log` as JSON.

On the server:

- `app/api/log/route.ts` receives the request
- `lib/validation.ts` validates the event schema
- `lib/fileStorage.ts` appends one JSON object per line to `data/logs.jsonl`

The logged schema includes `participant_id`, `condition`, `decision`, `timestamp`, and `latency_ms`, plus a few extra flat fields such as assistant name and task title.

## How to Run Locally

```bash
npm install
npm run dev
```

Open (condition A): [http://localhost:3000](http://localhost:3000).
Open (condition B): [http://localhost:3000/?condition=B](http://localhost:3000/?condition=B).

## Sample Output

The repository includes sample outputs in the same formats a reviewer would care about:

- `data/sample_output.jsonl`: sample of the runtime logs
- `data/sample_output.csv`: CSV export of the same records

`data/logs.jsonl` kept empty and is what is updated at runtime

## Design Decisions

This prototype was designed to fulfill the screening requirements while remaining easily extensible.

My implementation choices (listed below) are the result of balancing those two constraints.

### Config-driven cue manipulation

The full project emphasizes manipulation of a variety of cues while the screening only needed a simple A/B difference. So, I defined conditions declaratively in `lib/conditions.ts`

Reasoning:

- additional cue dimensions can be added later without rewriting the UI

### Easily extendable task list

The screening version only includes one task, but the task still lives in my `lib/tasks.ts` and is rendered from a typed config.

Reasoning:

- makes it straightforward to add more tasks or task variants later

### API boundary in front of local storage

The test only stated local logging, so this version uses append-only JSONL instead of a database. Even so, I decided to use `/api/log`, validation helpers, and file-storage helpers.

Reasoning:

- makes it easy to swap the storage layer later (for an eventual database)

