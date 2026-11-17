# Ashraf's HQ — Membership Lab & Client Portal Concept

A full-stack web application and gated client portal prototype designed as a speculative digital transformation concept for Ashraf's HQ Barbershop in Northpine, Cape Town.

🔗 **Live Prototype:** [ashraf-membership-lab.ascend-web...](https://ashrafshqbarbershop.setmore.com/) *(See repository link for deployed Cloudflare preview)*

## Architectural Overview & Features
What started as a responsive front-end pitch concept was expanded into a full-stack architecture featuring persistent state and gated client authentication:
* **Frontend Framework:** Built with **TypeScript**, **React**, and **TanStack Start** (`Vite`) for fast, mobile-first rendering.
* **Database & Edge Persistence:** Integrated **Cloudflare D1** and **Supabase** SQL migrations to support a gated client portal and preserve activated login settings across deployments.
* **External Booking Integration:** Connects seamlessly with existing Setmore scheduling endpoints while maintaining a custom branded user experience.

## AI-Assisted Engineering & Guardrails
This project was accelerated using AI development workflows (Lovable & custom `AGENTS.md` rules) with strict engineering constraints applied during prompting and iteration:
* **Zero-Hallucination Guardrails:** Strictly constrained generation to prevent fabricated business data (no invented service prices, operating hours, customer testimonials, or unverified address details), routing dynamic pricing lookups directly to verified Setmore endpoints.
* **Ethical Transparency:** Built-in UI disclaimers clearly label the deployment as an unofficial speculative concept to prevent user misrepresentation.
* **Agentic Workflow (`AGENTS.md`):** Defined clear repository context and architectural boundaries so AI coding assistants maintain database schema consistency across 37+ iterative commits.

## Local Development

Ensure you have **Node.js** or **Bun** installed locally.

```bash
# Clone the repository
git clone [https://github.com/Sevano-Forex/ashraf-s-hq-concept.git](https://github.com/Sevano-Forex/ashraf-s-hq-concept.git)
cd ashraf-s-hq-concept

# Install dependencies
bun install
# or: npm install

# Copy environment variables template
cp .env.example .env

# Run the development server
npm run dev
