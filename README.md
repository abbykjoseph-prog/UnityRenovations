# Unity Renovations website

Marketing site for Unity Renovations Inc. Built with Next.js 14 (App Router), TypeScript and Tailwind CSS, and deployed to Vercel from `main`.

## Editing content

| What | Where |
| --- | --- |
| Phone, email, founder, founded year, service area, hours, Instagram | `lib/site.ts` |
| Service descriptions and "what's included" lists | `lib/services.ts` (names in `lib/service-list.ts`) |
| Core promises and the five-step process | `lib/content.ts` |
| Project photos, captions and categories | `lib/photos.ts`, images in `public/images/` |
| Contact steps: project types, budget ranges, timelines, validation | `lib/inquiry.ts` (server schema in `lib/inquiry-schema.ts`) |

- **Testimonials:** add real reviews to `lib/testimonials.ts`. The home page section stays hidden while that list is empty.

## Contact form

The contact page is a step-by-step module (`components/contact/InquiryStepper.tsx`). Link to `/contact?path=project` to open it on the project questions (add `&type=kitchen` etc. to preselect a project type). `app/api/contact/route.ts` validates submissions with zod, filters spam (honeypot plus minimum fill time) and emails each submission through Resend (HTML with a plain-text fallback), using `RESEND_API_KEY`, `FROM_EMAIL` and `CONTACT_TO_EMAIL`. See `.env.example`.

## Development

```bash
npm install
npm run dev
```

`npm run build` must pass with no type or lint errors before you push.

Setting `NEXT_DIST_DIR` writes build output to a different folder, so a second dev server or a test build doesn't overwrite the main `.next` folder:

```bash
NEXT_DIST_DIR=.next-build npm run build
```
