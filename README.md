# Ashraf's HQ — Custom Booking Engine & Client Membership Portal

A full-stack web application, custom scheduling system, and gated client portal built as a digital transformation concept for Ashraf's HQ Barbershop in Northpine, Cape Town.

🔗 **Live Prototype:** See the repository's **About** section for the active Cloudflare deployment link.

## Architectural Overview & Key Features
Initially conceived as a static front-end concept linking to third-party scheduling (Setmore), this project was re-engineered into a standalone, full-stack application with custom booking logic and persistent state:

* **Custom Booking & Membership Engine:** Replaced third-party scheduling widgets with an in-house booking system and gated client membership portal, giving full control over the user journey, slot state, and account management.
* **Frontend Architecture:** Built with **TypeScript**, **React**, and **TanStack Start** (`Vite`) for fast, mobile-first rendering and type-safe routing.
* **Database & Edge Persistence:** Powered by **Cloudflare D1** and **Supabase** SQL migrations to handle relational data, preserve activated client login states across deployments, and manage gated authentication.

## AI-Assisted Engineering & Guardrails
This project was developed using AI-assisted coding workflows alongside strict architectural rules (`AGENTS.md`) to ensure production-grade reliability:

* **Context & Schema Management (`AGENTS.md`):** Maintained structured system instructions so AI coding agents respected database migrations, authentication states, and TypeScript interfaces across 37+ iterative commits.
* **Zero-Hallucination Guardrails:** Enforced strict prompting constraints during initial UI generation to prevent fabricated business metrics, unverified operating details, or fake customer testimonials.
* **Iterative Refactoring:** Directed the transition from a stateless landing page to a database-backed client portal while keeping deployment pipelines clean and reproducible.

## Local Development

Ensure you have **Bun** or **Node.js** installed locally.

```bash
# Clone the repository
git clone [https://github.com/Sevano-Forex/ashraf-s-hq-concept.git](https://github.com/Sevano-Forex/ashraf-s-hq-concept.git)
cd ashraf-s-hq-concept

# Install dependencies
bun install
# or: npm install

# Set up local environment variables
cp .env.example .env
cp .dev.vars.example .dev.vars

# Run the development server
npm run dev
