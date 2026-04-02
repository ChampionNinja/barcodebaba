# BarcodeBaba

**Tagline:** Smart choice vahi, jo scan kare sahi

BarcodeBaba is a production-ready Next.js application that helps users scan food barcodes and evaluate food safety using personalized health profiles and Open Food Facts nutrition data.

## Tech Stack

- Next.js 14+ (App Router)
- React + TypeScript
- Tailwind CSS
- Next.js API Routes
- Local Storage for profile + mode persistence
- Open Food Facts API
- `html5-qrcode` for camera-based barcode scanning

## Environment Requirements

- Node.js 18.17+ (Node 20 recommended)
- npm 9+

## Setup & Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Deploy on Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. Keep default build settings (`npm run build`).
4. Deploy.

No environment variables are required for this version.

## Project Architecture

```text
barcodebaba/
├── app/
│   ├── layout.tsx                # Root layout + metadata + global styles
│   ├── page.tsx                  # Landing page with profile modal and mode selection
│   ├── scan/page.tsx             # Camera/manual barcode scan and results
│   └── api/
│       └── food/route.ts         # POST endpoint for barcode -> normalized product data
├── components/
│   ├── ProfileModal.tsx          # User profile modal
│   ├── ModeSelector.tsx          # Baby/General/Elderly mode cards
│   ├── BarcodeScanner.tsx        # HTML5-QRCode scanner component
│   ├── ManualBarcodeInput.tsx    # Fallback barcode entry
│   └── SafetyScoreCard.tsx       # Product insights and final score
├── lib/
│   ├── openFoodFacts.ts          # Open Food Facts fetch/transform layer
│   ├── safetyScore.ts            # Personalized health scoring engine
│   └── storage.ts                # Browser localStorage helpers
├── types/
│   └── profile.ts                # Shared domain types
├── styles/
│   └── globals.css               # Tailwind base styles
├── public/
├── tailwind.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## Feature Summary

- Profile modal with validation for name, allergies, dietary preference, and health conditions.
- Auto-load/saving profile and selected mode using localStorage.
- Live camera scanning via `html5-qrcode` with graceful manual entry fallback.
- API route (`/api/food`) to fetch and normalize Open Food Facts product payload.
- Scoring system (`0-100`) that combines:
  - General nutrition quality (60%)
  - Profile-based and mode-based risk adjustments (40%)
- Responsive mobile-first UI with Tailwind.
- Error, loading, and empty states across key flows.

