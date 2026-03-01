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

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/barcode-baba
cd barcode-baba
npm install