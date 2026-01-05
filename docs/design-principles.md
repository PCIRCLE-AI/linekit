# Design Principles

## 1. Developer Experience First (DX)

- **Goal**: Zero configuration for 90% of use cases.
- **Example**: `createLineApp` sets up everything needed for a bot. `ctx.replyText` is a shortcut for `replyMessage` with a text object.

## 2. Explicit over Implicit

- **Goal**: No "magic" global state or hidden side effects.
- **Example**: Config is passed explicitly to factories. Handlers are explicit functions.

## 3. Modular & Composable

- **Goal**: Pay only for what you use.
- **Example**: If you only need Login, install `@linekit/login`. If you want to use Fastify instead of Express, swap the adapter. Core logic remains the same.

## 4. Framework Agnostic

- **Goal**: Core logic should not depend on `express`, `koa`, or `next`.
- **Implementation**: `@linekit/core` uses generic `req`/`res` patterns or pure functional logic where possible. Adapters bridge the gap.

## 5. Type Safety

- **Goal**: Full TypeScript support without manual casting.
- **Implementation**: All events and config are typed. Methods return typed Promises.
