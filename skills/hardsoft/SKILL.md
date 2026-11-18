---
name: hardsoft
description: Apply the hard and soft surfaces approach to a design system - a few master colors, one alpha scale, solid hard surfaces and transparent soft ones. Use when someone wants to set up, audit, simplify or refactor colors, grays, design tokens, a Tailwind theme, surface levels, hover colors or dark mode, has too many grays or shades, or says hardsoft, or hard and soft surfaces.
---

# hardsoft

Turn a design system's colors into a few master colors and one alpha scale, with one rule for when a surface is solid and when it is transparent.

The approach is explained in full in [approach.md](approach.md). Read it before you map anything. The article behind it: https://plyuto.design/article/soft-and-hard-surfaces

You stand between the approach and someone's real system. Keep their colors, their file formats and their way of working. Change only how the colors are organized.

It works in a codebase (Claude Code, Cursor, Codex and other agents) and in a chat (Claude, ChatGPT). In a codebase you read and edit the project. In a chat you work from the files, screenshots and links in the thread.

## How to work

1. **Find the system.** In a codebase, read the tokens, the theme, the Tailwind config, the CSS variables and the main components. In a chat, use the files, screenshots and links in the thread. If there are none, ask for them.

2. **Map it.**
   - Pick the masters from the colors the system already has: its darkest gray, a middle gray, its brightest gray, its brand colors, and its error, success and warning colors.
   - Put every other color on a master and a step. To find the step of a gray, take one channel: alpha = (ground − color) ÷ (ground − darkest). `#f3f3f3` on white with a darkest gray of `#131416` is (255 − 243) ÷ (255 − 19) = 5%, so it is `gray-darkest-5`. Take the nearest step, and note it when the color moves enough to see.
   - Mark every surface as hard or soft.
   - List what does not fit: one-off grays, shades that are really steps, colors used only once, colors darker than their master.

3. **Ask once.** Ask only the 3 or 4 decisions you can't make from what you found, in one message, each with 2 or 3 options and your pick in one line. For example: which surfaces are hard, whether dark mode is needed, which brand colors stay masters, and whether to keep the old token names as aliases for now. If your environment has a question widget, use it.

4. **Show the plan and a preview, then wait.**
   - The plan is a table: each old token or value, its master and step, and what gets removed.
   - The preview shows the masters, the alpha scale with hovers, a card nested three levels deep with a button, an input and text, and a hard menu above it, in light and in dark.
   - In a codebase the preview is a new page in the app, like `/system`. In a chat it is an artifact, or a single HTML file where artifacts are not available.
   - The preview carries its own copy of the new tokens, so nothing else changes before the yes.

5. **Apply it after a yes.**
   - Write the tokens in the project's own format: a Tailwind 4 `@theme` block if it uses Tailwind ([templates/theme.css](templates/theme.css)), otherwise the format it already has ([templates/tokens.css](templates/tokens.css) for plain CSS variables). In a chat, write a `@theme` block.
   - Move the components onto the tokens, one group at a time.
   - Check the result: the project builds, and the preview and a few real screens look right in light and in dark.
   - Say what changed and what is left.

## Rules

- No new colors. A color that is not a master is a master at a step.
- The masters are the system's own colors. The values in the templates are samples.
- Start from the scale 80, 40, 20, 10, 5. Change a step only if the system clearly needs it, and say why.
- Name tokens by master and step, like `gray-darkest-20`, not by role. Where a step is used is its role.
- For any new element, ask one question: is it in the flow, or above it? In the flow is soft, above it is hard.
- Text must stay readable. Check the contrast of text on the deepest level of nesting, and say where it is too low.
- Leave alone what is not an interface color: photos, illustrations, charts and code highlighting. List them as left out.
- Use plain words. The first time you use a term, explain it in one sentence.
