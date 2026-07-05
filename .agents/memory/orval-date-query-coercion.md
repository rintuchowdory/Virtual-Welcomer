---
name: Orval date query/param coercion
description: Why GET endpoints with date-format query/path params 400 with "Expected date, received string" after codegen, and the fix.
---

The default `orval.config.ts` coerce settings only include `boolean`, `number`, `string` for `query`/`param` (date coercion is only enabled for `body`/`response`). This means any OpenAPI query or path param with `type: string, format: date` generates a strict `zod.date()` schema that rejects the raw string Express puts on `req.query`/`req.params`, failing with "Expected date, received string".

**Why:** Express never parses query/path params into `Date` objects — they arrive as strings. Without `date` in the query/param coerce list, the generated Zod schema doesn't coerce them, so `safeParse` always fails for valid requests.

**How to apply:** If a new endpoint takes a date via query string or path param, add `'date'` to both `coerce.query` and `coerce.param` arrays in `lib/api-spec/orval.config.ts`, then rerun `pnpm --filter @workspace/api-spec run codegen` before wiring the route.
