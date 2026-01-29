# Admin 500 / MODULE_NOT_FOUND & Prisma Generate

## 1. Prisma: "Unknown command generate."

You ran `npx prisma generate.` **with a trailing period**. Prisma treats that as the command `generate.`, which doesn’t exist.

**Use (no period):**
```bash
npx prisma generate
```

---

## 2. Admin 500 + MODULE_NOT_FOUND + 404 on chunks

**Symptoms:**
- `MODULE_NOT_FOUND` in `setup-dev-bundler` / `_document` chain
- `GET /admin/` → 500
- `main-app.js`, `app-pages-internals.js`, etc. → 404 (then HTML 404 returned as “JS”, causing MIME errors)

This usually means a broken or stale dev build (`.next` / `node_modules`).

**Fix: clean reinstall and rebuild**

Run in the project root:

```bash
# 1. Stop the dev server (Ctrl+C)

# 2. Remove cache and dependencies
rm -rf .next node_modules

# 3. Reinstall
npm install

# 4. Regenerate Prisma Client (no trailing period)
npx prisma generate

# 5. Start dev again
npm run dev
```

Then hard-refresh `http://localhost:3001/admin/` (Cmd+Shift+R or Ctrl+Shift+R).

---

## 3. Turbopack (recommended for dev)

The `deployment-id.js` ENOENT and `next-flight-client-entry-loader` errors come from Next’s **webpack** dev setup. Using **Turbopack** for dev avoids that pipeline.

The dev script has been updated to:
```json
"dev": "next dev -p 3001 --turbo"
```
Run `npm run dev` as usual. Production `next build` still uses webpack.

If you hit Turbopack-specific issues, revert to:
```json
"dev": "next dev -p 3001"
```
and use the other steps below.

## 4. If it still fails

- **Node version:** Use Node 18.20+ or 20.x LTS.  
  `node -v`

- **Port in use:** If 3001 is taken, use another port, e.g.:
  ```bash
  npx next dev -p 3002 --turbo
  ```

- **Path with spaces:** The project path contains `Local Sites`. If problems persist, try moving the project to a path without spaces (e.g. `~/dev/stylish-website`) and run `npm install && npm run dev` again.
