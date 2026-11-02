# Kdesign Design System — Two Decisions Needed

**Prepared:** 2026-10-28

## Meeting agenda (suggested 30 mins)

### Decision 1 — ADR-002: ThemeContext export path (15 mins)

**Current state:**

- `useTheme` and `ThemeContext` are exported from both `@klearnow/kdesign/components` **and** `@klearnow/kdesign/utils`.
- The `utils` path is undocumented and inherited from the Kdesign rename.
- Removing it without warning would be a **breaking change** for any consumer using it.

**Options:**

- **A:** Keep both paths; document `utils` as officially supported.
- **B:** Deprecate `utils` path in next minor; remove in v13 with codemod.
- **C:** Move to dedicated `@klearnow/kdesign/provider` subpath export.

**Recommendation:** Option B, then C  
**Decision needed by:** _[team to set]_  
**Owner:** _[name]_

---

### Decision 2 — ADR-008: v13 timing and scope (15 mins)

**Current state:**

- Library is at **v12.x** (`12.130.0` in `package.json`).
- Breaking changes are ready or pending: ThemeContext path (ADR-002), shim retirement (ADR-001).
- No agreed scope or timeline for v13.

**What would go in v13:**

- ThemeContext moved to `/provider` subpath (if ADR-002 Option B/C).
- `useIconProps` shim fully deleted (ADR-001).
- Any other breaking changes agreed in this meeting.

**Recommendation:** Cut v13 after ADR-002 is decided and shim migration is complete.  
**Decision needed by:** _[team to set]_  
**Owner:** _[name]_

---

## Related items (no decision in this meeting)

| Item | Status |
|------|--------|
| ADR-006 focus ring token | Audit complete — `docs/focus-states-audit.md`; **design approval required** before code |
| ADR-007 JSDoc enforcement | Gap report + partial prop docs; **eslint-plugin-jsdoc** not yet in monorepo — approve before CI gate |
| React.memo (performance-notes) | Deferred until production profiling |
