# About opening and archive audit

Date: 2026-08-19

## Scope

Reviewed the opening montage, archive television interaction, transition into leadership, and handoff into the towel-history section at desktop (1440px) and compact (900px) widths.

## Walkthrough

1. Open the About page and enter the archive montage.
2. Read the television introduction before selecting a story.
3. Select photographs from the archive wall and verify that the television updates.
4. Navigate the archive with a keyboard.
5. Continue through the leadership portraits and into the towel-history section.

## What works

- The desktop montage fills the opening viewport with a strong editorial composition.
- The television and archive wall remain visually coherent at the compact breakpoint.
- The exit through leadership and into the towel-history section has a clear visual rhythm.
- The existing photos, typography, colors, and page structure did not need a visual redesign.

## Issues found

### P1 — Archive changed stories without user action

The television replaced its heading and announced a new story after a delay while the user was reading. This could interrupt reading and create unexpected screen-reader announcements.

Resolution: removed automatic story cycling. Stories now change only after a photograph or television dial is activated.

### P1 — Archive wall created 28 consecutive tab stops

Every visible photograph was independently tabbable, making keyboard navigation unnecessarily long.

Resolution: implemented a roving tab stop. One photograph is in the tab order; arrow keys move and tune, while Home and End jump to the first and last visible photographs.

## Verification target

- The introduction remains unchanged without user input.
- Exactly one visible archive photograph is in the tab order.
- Arrow keys change focus and tune the matching story.
- Photograph clicks and the television dial continue to work.
- Desktop and compact composition remains visually unchanged.
