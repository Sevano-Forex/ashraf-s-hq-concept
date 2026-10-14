<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the speculative site as one frontend-only index route with anchor navigation; no data collection or server logic is needed.
- Define presentation tokens and responsive layouts in src/styles.css and use the shared Button for interactive controls to keep the concept consistent.
- Treat generated barber imagery as illustrative moodboard material and label it where displayed so it cannot be confused with verified shop photography.
- Keep public business data in src/lib/barbershop.ts and the third-party booking panel in src/components/booking-embed.tsx so menu/contact facts and embed failure handling remain independently maintainable.
- Route all booking CTAs to the index booking anchor; use the real Setmore iframe with an external fallback only after an iframe error or user-reported loading failure, because cross-origin iframe load events cannot prove booking success.
