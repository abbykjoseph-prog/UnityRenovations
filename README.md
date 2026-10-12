# Unity Renovations website

Marketing site for Unity Renovations Inc. Built with Next.js 14 (App Router), TypeScript and Tailwind CSS, and deployed to Vercel from `main`.

## Editing content

| What | Where |
| --- | --- |
| Phone, email, service area, hours, address, social links, testimonials | `lib/site.ts` |
| Service descriptions and "what's included" lists | `lib/services.ts` (names in `lib/service-list.ts`) |
| Core promises and the five-step process | `lib/content.ts` |
| Project photos, captions and categories | `lib/photos.ts`, images in `public/images/` |
| Quote form options (budget ranges, timelines) | `lib/quote.ts` |

Search the codebase for `[ADD:` to find every placeholder that still needs real information.

- **Testimonials:** the home page section stays hidden until at least one entry is added to `site.testimonials`.
- **Social links:** footer icons appear once `site.social` has entries.
- **Structured data:** placeholder values are left out of the JSON-LD automatically.

## Contact form

`app/api/contact/route.ts` validates submissions, filters spam (honeypot plus minimum fill time) and logs each request to the server logs. There's a `TODO(email)` in that file with the steps for sending through Resend.

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
