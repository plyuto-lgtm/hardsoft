---
name: hardsoft
description: Apply the hard and soft surfaces concept to a design system - a few master colors, one alpha scale, solid hard surfaces and transparent soft ones. Three actions - report (show what the system would win, change nothing), apply (plan, preview, then rebuild the tokens) and theme (add a dark mode, only when asked). Use when someone wants to audit, simplify, set up or refactor colors, grays, design tokens, a Tailwind theme, surface levels, hover colors or dark mode, has too many grays or shades, or says hardsoft, or hard and soft surfaces.
---

# hardsoft

Turn a design system's colors into a few master colors and one alpha scale, with one rule for when a surface is solid and when it is transparent.

The concept and its 30 rules are in [approach.md](approach.md). Read it before you map anything, and follow the rules by their numbers and their levels: strict, default, advice. The article behind it: https://plyuto.design/article/soft-and-hard-surfaces

You stand between the concept and someone's real system. Keep their colors, their file formats, their token names and their way of working. Change only what the colors are made from.

The project's own rules come first: its CLAUDE.md or AGENTS.md, its design source (like a Figma file whose variables match the tokens), and who is allowed to add or remove tokens. When a rule here clashes with one of them, follow the project and name the clash in the plan.

It is made for work inside a codebase with a coding agent (Claude Code, Cursor, Codex and others). It also works in a chat (Claude, ChatGPT), from the files, screenshots and links in the thread.

## The three actions

| Action | What it does | What it changes |
| --- | --- | --- |
| **report** | Finds the system, maps it, and shows what it would win. | Nothing. It writes the report and the preview. |
| **apply** | The report, then questions, a plan and a preview, a yes, the new tokens, and the report again with the real numbers. | The token layer only (rule 27). |
| **theme** | Adds a dark mode, or another theme, on top of masters and steps. | The theme's grays, and the few semantic tokens it needs. |

Pick the action from the request. "Audit", "check", "what would change", "is it worth it": report. "Apply", "refactor", "set up", "simplify", "do it": apply. "Add dark mode", "add a theme": theme. If you can't tell, do the report: it changes nothing, and it ends by offering apply.

Never start theme on your own, and never propose it (rule 21). If someone asks for a theme and the system is not on masters and steps yet, say that apply comes first and put both in one plan.

## The target

The article promises four things. The report measures the system against each of them, before and after, with numbers. This is what the user wins.

| Goal | How to count it |
| --- | --- |
| **Fewer colors** | Different solid colors in the system now. After: the masters plus the steps of the scale. |
| **Predictable contrast** | Surface colors that exist only to name a level of nesting or a state, like `surface-2` or `card-hover`. After: none, because a level is the same token again (rule 17). |
| **Quick tuning** | Values someone must edit to make all the grays a little warmer or lighter. After: one, the ink. |
| **Easy theme conversion** | Values a second theme has to redefine. After: the ink and the ground, plus the few things that must look the same in both themes (rule 20). |

Count honestly. If a number does not get better, say so. If the system already fits, say that there is little to win and stop there.

## The color math

Don't work the alphas out in your head. [scripts/hardsoft.mjs](scripts/hardsoft.mjs) does it, with Node 18 or newer and nothing to install. The path is from this skill's folder:

```bash
# One color: which alpha of the master is it, over the background it sits on?
node scripts/hardsoft.mjs alpha "#e8e8e8" --master "#111111" --on "#f3f3f3"

# The whole system: every color on a master and a step, both scales, what does not fit, the tint check
node scripts/hardsoft.mjs map system.json
node scripts/hardsoft.mjs map system.json --steps 5,10,20,40,60,80   # score a scale of your own
node scripts/hardsoft.mjs map system.json --json

# Text contrast over a stack of layers, the ground first. Offers the nearest step that passes
node scripts/hardsoft.mjs contrast --text "#111111@60" --on "#ffffff" "#111111@5" "#111111@5" --steps 5,10,20,40,60,80
```

`system.json` is a file you write from what you found. Keep it out of the project, or delete it when you are done:

```json
{
  "ground": "#ffffff",
  "ink": "gray-900",
  "masters": { "gray-900": "#111111", "blue-600": "#2563eb" },
  "colors": [
    { "name": "gray-100", "value": "#f3f3f3" },
    { "name": "card-nested", "value": "#e8e8e8", "on": "gray-100" },
    { "name": "slate-200", "value": "#dde3ec", "master": "gray-900" }
  ]
}
```

- `on` is the background the color really sits on: a color, or the name of another color in the list. A nested card sits on its parent card, not on the page. Leave it out for the ground.
- `master` fixes the master when the name or the use tells you the family, like a gray that happens to be close to a pale brand tint.
- A token used over several backgrounds: map it where it is used most, and note the others in the plan.

"Shift" is how far a color moves, as a distance in OKLab times 100. Under 2 the eye barely sees it. A color fits a master when its best alpha gives a shift of 2 or less. Past that it is not this master at a step (rule 23).

If you can't run code, do it by hand: alpha = (background − color) ÷ (background − master), for red, green and blue, then take the one alpha that fits all three best. `#f2f2f2` on white with a black ink is (255 − 242) ÷ (255 − 0), so it is the ink at 5%. Say in the report that the numbers were worked out by hand.

## How to work

### 1. Find the system

In a codebase, read the project's rules, the tokens, the theme, the Tailwind config, the CSS variables and the main components. Also look for:

- Code that reads the token file, like a Storybook page that parses it, so you don't break it.
- Colors written directly in components: hex values, `rgb()`, one-off grays, arbitrary Tailwind values. You will list them, not edit them (rule 27).
- How each state is shown: hover, pressed, selected, disabled, focus (rules 18 and 19).
- Shadows and gradients (rules 22 and 29).

In a chat, use the files, screenshots and links in the thread. If there are none, ask for them.

### 2. Map it

- Sort what you found into the three layers: masters, transparent tokens, semantics.
- Pick the masters from the colors the system already has (rules 1 to 3). The ink is the gray that text is made of. In a dark-first system it is the brightest gray: keep the project's names, and don't call it darkest.
- A ramp, like blue 50 to 900, is one master and its tints (rule 5). Note which shades the interface really uses.
- Write `system.json` and run `map`. It gives every color its master and step, the two scales (rule 8), what does not fit, and the tint check (rule 4).
- Mark every surface as hard or soft (rules 10 to 13). The cases people get wrong:

  | Element | It is |
  | --- | --- |
  | Card, button, input, divider, a sidebar beside the content | Soft |
  | Menu, modal, tooltip, toast, popover | Hard |
  | Sticky header, sticky column or bottom bar that content scrolls under | Hard (rule 12) |
  | Stacked avatars, a badge on a card corner: anything that covers a neighbor | Hard (rule 12) |
  | A button on a brand banner | Soft, the banner is its ground (rule 13) |
  | A button or a label on a photo, a video or a gradient | Hard (rule 13) |

- Run `contrast` for text at the deepest nesting, for text on every solid color, and for the hovers of solid colors (rule 28).
- List what does not fit, what is left out (rule 29), the components with their own colors (rule 27), and what becomes removable (rule 26).
- Note what counts as unused only after the theme decision: a token that one theme doesn't use may be the ink of the other.
- Count the four goals of the target, now and after.

### 3. Write the report

Fill [templates/report.md](templates/report.md) and save it as `hardsoft-report.md` where the project keeps its documents, or in its root. In a chat, give it as a file or an artifact.

Draw the preview from [templates/preview.html](templates/preview.html): copy the file, fill in the `system` object at its top and change nothing else, so every project gets the same page. For a report, use the same-look scale, so nothing in it has moved. It goes where the project already shows its system, like a `/system` page or Storybook, if its rules allow it. Otherwise it is a single HTML file next to the report. In a chat it is an artifact, or the HTML file.

**The report action ends here.** Say in two or three lines what the system would win, link the report and the preview, and offer apply. Ask nothing else.

### 4. Ask once (apply and theme)

Ask only the decisions you can't make from what you found, in one message, each with 2 or 3 options. If your environment has a question widget, use it. The usual ones:

- Fewer steps or the same look. Show both with their numbers of steps and biggest shifts, and don't recommend one (rule 8).
- A tinted ink, when the tint check finds one (rule 4). Give both sides: how many tinted grays then fit, and how far the other grays move.
- A second master, when the interface uses a shade darker than its master (rule 5).
- Each color that fits nothing: keep it as it is, or move it to the closest step, with the shift (rule 23).
- Each weak text contrast, with the nearest stronger step (rule 28).
- Which surfaces are hard, only where you could not tell.

For everything else, choose on your own, write the choice and its rule in the plan, and move on. If something you find later changes an answer, say so in the plan.

### 5. Show the plan and the preview, then wait

The plan is the same report, updated with the answers: the chosen scale, the old-to-new table, what is kept, what is listed. Update the preview to the chosen scale. Then stop and wait for a yes (rule 30).

### 6. Apply after a yes

- Write the tokens in the format the project already has: where they live, how they are mixed and how they are named. [formats.md](formats.md) shows the pattern in each format: Tailwind 4, Tailwind 3, CSS variables, Sass, JS or TS, and JSON tokens. Use Tailwind 4 `@theme` when a Tailwind project has no color tokens yet, and in a chat.
- The templates are patterns with no colors. Every color, step and name you write comes from the system.
- Write only the steps each master really uses, not every master at every step.
- Every old name keeps working, pointed at a master or a transparent token (rule 26). Point the semantic tokens the same way (rule 25).
- Don't edit components (rule 27). They keep working because the names do.
- Keep the design of every state, and rebuild only its color (rules 18 and 19).
- Check the result: the project builds and its own checks pass.
- Take before and after screenshots of two or three real screens, the same screens at the same size, in each theme. Pick screens with nesting, a form and a menu. If you can't run the app, name the screens for the user to look at, and say that you could not check them.
- Finish the report: the real numbers, the screenshots, what is left. Tell the user what changed and what is left in a few lines, with the link.

### Theme

Only when asked (rule 21). The system must be on masters and steps first.

- Start from the light pair swapped: the light ground becomes the ink, the light ink becomes the ground. If the project has its own dark grays, use them.
- The scale, the names and the other masters stay (rule 20).
- Find what must look the same in both themes: text on a color, tooltips, the dim layer under a modal, shadows (rules 20 and 22). Each goes through a semantic token that points at the other gray in the dark theme.
- Run `contrast` on the dark ground. Tune the steps that read too weak or too strong through their semantic tokens. Change a brand or system color only if it is hard to read.
- The preview shows both themes side by side. Then the plan, the yes, and the same finish as apply.

## How to talk

- Use plain words. The first time you use a term, explain it in one sentence.
- Be brief. Lead with the numbers of the target.
- When you make a choice, name the rule behind it.
- When something in the system does not fit the rules, say so and ask. Don't bend the system to fit.
