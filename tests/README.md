# Tests

Unit tests for the pure helpers in `lib/` (`text.ts`, `video-format.ts`,
`categories.ts`, `video-language.ts`). They cover title casing, duration
and view-count formatting, category localisation, and the UI-locale to
video-language mapping — no database, no network, no extra dependencies.

Run them with Node.js 22.6+ (uses built-in type stripping, no build step):

```bash
node --test tests/lib.test.ts
```

Imports use explicit `.ts` extensions, which Node's type stripping
requires — `tsconfig.json` has `allowImportingTsExtensions` enabled
for that (compatible with the project's `noEmit` setup).

Add a test next to the helper it covers whenever a new pure function
lands in `lib/`.
