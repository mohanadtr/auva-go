# Contributing

Thanks for your interest in improving Auva Go.

## Local setup

1. Install dependencies: `npm install`
2. Create env file from example: copy `.env.example` to `.env.local`
3. Start dev server: `npm run dev`

## Development guidelines

- Keep changes focused and small.
- Follow existing TypeScript and Next.js patterns.
- Add or update validation when changing request payloads.
- Avoid introducing tracking or personal data collection.

## Pull request checklist

- `npm run build` passes.
- No secrets are committed.
- README/docs are updated if behavior changed.
- Screenshots included for major UI changes.
