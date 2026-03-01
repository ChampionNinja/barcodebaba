# Barcode Baba – Know Your Bite

An intelligent barcode-based food safety analyzer that helps users make informed food decisions through personalized safety scoring for General users, Babies, and the Elderly.

---

## Problem

Food labels are difficult to interpret and not personalized to different risk groups.

Consumers often cannot easily determine:

- Whether a product is safe for babies
- Whether it poses risks for elderly individuals
- Whether it is highly processed
- Whether it contains excessive sugar, sodium, or harmful ingredients
- Whether it is vegetarian or vegan

Although nutritional data exists, it is not presented in a simple, actionable way.

---

## Solution

Barcode Baba allows users to scan a product barcode and instantly receive a safety analysis based on ingredients, processing level, and user mode.

The system provides:

- Safety score from 0 to 100
- Clear rating (SAFE, MODERATE, RISKY, AVOID)
- Ingredient-based risk warnings
- Mode-specific analysis (General, Baby, Elderly)
- Vegetarian and vegan status (when available)

If ingredients are not available, the system transparently informs the user and does not calculate a score.

---

## Features

### Barcode Scanning

- Camera scanning
- Image upload from gallery
- Manual barcode entry

### Safety Scoring Engine

Analyzes:

- Sugar levels
- Sodium levels
- Fat levels
- Ultra-processed indicators
- Ingredient complexity
- Mode-specific risk rules

### Personalized Modes

**General Mode**
- Balanced safety evaluation

**Baby Mode**
- Strict criteria suitable for infants

**Elderly Mode**
- Focus on heart and metabolic risks
- Voice narration support

---

## Architecture

                 ┌─────────────────────────┐
                 │        Frontend         │
                 │    React + TypeScript   │
                 │                         │
                 │  • Barcode scanning     │
                 │  • Mode selection       │
                 │  • Result display       │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │        Backend          │
                 │   Express + TypeScript  │
                 │                         │
                 │  • API routes           │
                 │  • Data processing      │
                 │  • Scoring engine       │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     Open Food Facts     │
                 │      Product Data       │
                 └─────────────────────────┘


---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- html5-qrcode
- React Query

### Backend

- Node.js
- Express
- TypeScript
- Zod

### Data Source

- Open Food Facts API

---

## Screenshots

### Home Page

![Home](screenshots/home.png)

### Scan Results

![Scan Result](screenshots/result.png)

### Baby Mode

![Baby Mode](screenshots/baby.png)

### Elderly Mode

![Elderly Mode](screenshots/elderly.png)

---

## Demo

**Live Demo:**  
https://your-demo-link.vercel.app

**Demo Video:**  
https://youtube.com/your-demo-video

---

## Scoring Logic

Barcode Baba calculates a safety score between 0 and 100 based on ingredient analysis and nutritional risk factors.

### Factors considered

**1. Sugar content**
- High sugar reduces score
- Especially strict penalties in Baby and Elderly modes

**2. Sodium content**
- High sodium reduces score significantly
- Higher penalties in Elderly mode due to cardiovascular risks

**3. Fat content**
- Excessive saturated fat reduces score

**4. Ingredient complexity**
- Large number of ingredients reduces score
- Highly complex formulations indicate ultra-processed food

**5. Ultra-processed indicators**
- Artificial additives, preservatives, emulsifiers, and flavor enhancers reduce score

**6. Mode-specific adjustments**

- **General mode:** Balanced scoring
- **Baby mode:** Strictest scoring thresholds
- **Elderly mode:** Additional penalties for sugar, sodium, and processed ingredients

### Score interpretation

| Score Range | Rating    |
|------------|-----------|
| 80–100     | SAFE      |
| 60–79      | MODERATE  |
| 40–59      | RISKY     |
| 0–39       | AVOID     |

---

## Project Structure


barcode-baba/
│
├── client/ # Frontend (React + TypeScript)
│ │
│ ├── src/
│ │ │
│ │ ├── components/ # Reusable UI components
│ │ │ ├── Scanner.tsx
│ │ │ ├── ScoreCard.tsx
│ │ │ ├── ProfileSetupModal.tsx
│ │ │ └── ui/ # Base UI components
│ │ │
│ │ ├── pages/ # Application pages
│ │ │ ├── Home.tsx # Mode selection page
│ │ │ └── Scan.tsx # Scan and result page
│ │ │
│ │ ├── hooks/ # Custom React hooks
│ │ │ ├── use-scan.ts
│ │ │ └── use-mode.ts
│ │ │
│ │ ├── lib/ # Utility functions
│ │ │
│ │ ├── App.tsx
│ │ └── main.tsx
│ │
│ └── index.html
│
├── server/ # Backend (Express + TypeScript)
│ │
│ ├── index.ts # Server entry point
│ ├── routes.ts # API route definitions
│ │
│ └── services/ # Core backend logic
│ ├── analyzer.ts # Safety scoring engine
│ └── openfoodfacts.ts # Open Food Facts API integration
│
├── shared/ # Shared schemas and types
│ └── schema.ts
│
├── package.json
├── tsconfig.json
└── README.md

---

## Future Improvements

- Baba assistant for interactive product queries and explanations  
- Product comparison to help users choose safer alternatives  
- Scan history with saved results and safety tracking  
- Mobile app version (Android and iOS)  
- Offline barcode scanning with local database caching  
- Faster analysis using optimized backend and caching  
- Region-specific safety recommendations based on local dietary guidelines  
- Expanded database coverage beyond Open Food Facts  
- Browser extension to analyze food products on shopping websites  
- Visual ingredient risk breakdown with detailed explanations  

---

## Team - La Amigos

- Arpan Sharma
- Falgun Kishore Sharma
- Shaurya Kochhar
- Tanishka Sharma

---