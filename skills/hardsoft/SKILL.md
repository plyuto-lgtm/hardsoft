---
name: hardsoft
description: Apply the hard and soft surfaces concept to a design system - a few master colors, one alpha scale, solid hard surfaces and transparent soft ones. Use when someone wants to set up, audit, simplify or refactor colors, grays, design tokens, a Tailwind theme, surface levels, hover colors or dark mode, has too many grays or shades, or says hardsoft, or hard and soft surfaces.
---

# hardsoft

Turn a design system's colors into a few master colors and one alpha scale, with one rule for when a surface is solid and when it is transparent.

The concept and its 20 rules are in [approach.md](approach.md). Read it before you map anything, and follow the rules by their numbers. The article behind it: https://plyuto.design/article/soft-and-hard-surfaces

You stand between the concept and someone's real system. Keep their colors, their file formats, their token names and their way of working. Change only what the colors are made from.

The project's own rules come first: its CLAUDE.md or AGENTS.md, its design source (like a Figma file whose variables match the tokens), and who is allowed to add or remove tokens. When a rule here clashes with one of them, follow the project and name the clash in the plan.

It works in a codebase (Claude Code, Cursor, Codex and other agents) and in a chat (Claude, ChatGPT). In a codebase you read and edit the project. In a chat you work from the files, screenshots and links in the thread.

## How to work

1. **Find the system.** In a codebase, read the project's rules, the tokens, the theme, the Tailwind config, the CSS variables and the main components. Also look for code that reads the token file, like a Storybook page that parses it, so you don't break it. In a chat, use the files, screenshots and links in the thread. If there are none, ask for them.

2. **Map it.**
   - Sort what you found into the three layers: masters, transparent tokens, semantics.
   - Pick the masters from the colors the system already has (rules 1 to 3). The ink is the gray that text is made of. In a dark-first system it is the brightest gray: keep the project's names, and don't call it darkest.
   - Take the steps from the system (rule 5). To convert a solid color, find the alpha of its master over the background it sits on: alpha = (background − color) ÷ (background − master), for red, green and blue. `#f2f2f2` on white with a black ink is (255 − 242) ÷ (255 − 0), so it is the ink at 5%.
     - Take the one alpha that fits all three channels best (a least-squares fit), not a plain average. A channel where the master and the background are almost the same tells you nothing: leave it out.
     - Measure each color over the background it really sits on: a nested card over its parent card, not over the page.
     - A token used over several backgrounds gets the alpha that fits where it is used most. Note the others in the plan.
     - If no alpha fits within a small, barely visible difference, the color is not this master at a step.
   - Build two versions of the scale, fewer steps and the same look, with the number of steps in each (rule 6).
   - Mark every surface as hard or soft (rules 8 to 10).
   - List what does not fit: one-off grays, colors used only once, colors that are not a master at any step.
   - List what must look the same in both themes, like text on a color, tooltips, overlays and shadows (rule 15).
   - Note what counts as unused only after the theme decision: a token that one theme doesn't use may be the ink of the other.

3. **Ask once.** Ask only the 3 or 4 decisions you can't make from what you found, in one message, each with 2 or 3 options and your pick in one line. For example: fewer steps or the same look, which surfaces are hard, whether dark mode is needed, which brand colors stay masters. If your environment has a question widget, use it. Write down the smaller choices you make on your own, and list them in the plan. If something you find later changes an answer, say so in the plan.

4. **Show the plan and a preview, then wait.**
   - The plan is a table: each old token or value, its master and step, how far the color moves, and what gets removed.
   - The preview shows the masters, the alpha scale with hovers, a card nested three levels deep with a button, an input and text, and a hard menu above it, in light and in dark.
   - In a codebase the preview goes where the project already shows its system, like a `/system` page or Storybook, if its rules allow it. Otherwise it is a new page in the app, or a single HTML file in the project. In a chat it is an artifact, or a single HTML file where artifacts are not available.
   - The preview carries its own copy of the new tokens, so nothing else changes before the yes.

5. **Apply it after a yes.**
   - Write the tokens in the format the project already has: where they live, how they are mixed and how they are named. The templates show the shape only: [templates/theme.css](templates/theme.css) for Tailwind 4 `@theme`, [templates/tokens.css](templates/tokens.css) for plain CSS variables. Use `@theme` when a Tailwind project has no color tokens yet, and in a chat.
   - The templates are patterns with no colors. Every color, step and name you write comes from the system.
   - Write only the steps each master really uses, not every master at every step.
   - Point the semantic tokens at the new tokens, if the project has them (rule 18). Otherwise move the components onto the new tokens, one group at a time.
   - Check the result: the project builds, its own checks pass, and the preview and a few real screens look right in light and in dark.
   - Say what changed and what is left.

## How to talk

- Use plain words. The first time you use a term, explain it in one sentence.
- When you make a choice, name the rule behind it.
- When something in the system does not fit the rules, say so and ask. Don't bend the system to fit.
