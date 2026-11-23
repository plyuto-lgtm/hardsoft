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
| **report** | Finds the system, maps it, asks a short interview, and shows what it would win. | Nothing. It writes the report and the preview. |
| **apply** | The report with its interview, then the open decisions, a plan and a preview, a yes, the new tokens, and the report again with the real numbers. | The token layer only (rule 27). |
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

The report opens with two short benchmarks, both from `map`:

- **Independent tokens**, before and after. An independent token has a value of its own. A dependent one is made from another token. After, the independent ones are the masters, the solid grays of hard surfaces, and any color kept as it is.
- **Closeness**: the share of the colors that still look the way they did, as a percent. A color looks the same when its shift is 2 or less. Give it with the average and the biggest shift.

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
- `"hard": true` marks a solid gray that belongs to a hard surface, like a menu or a raised panel. It stays solid (rule 14).
- A token used over several backgrounds: map it where it is used most, and note the others in the plan.

"Shift" is how far a color moves, as a distance in OKLab times 100. Under 2 the eye barely sees it. A color fits a master when its best alpha gives a shift of 2 or less. Past that it is not this master at a step (rule 23).

```bash
# One element on screen: its old color against its new layer, over what is under it
node scripts/hardsoft.mjs shift "#e8e8e8" --now "#1111110d" --on "#ffffff" "#1111110d"
```

If you can't run code, do it by hand: alpha = (background − color) ÷ (background − master), for red, green and blue, then take the one alpha that fits all three best. `#f2f2f2` on white with a black ink is (255 − 242) ÷ (255 − 0), so it is the ink at 5%. Say in the report that the numbers were worked out by hand.

## Seeing the real screens

The token file does not show everything. What a color really lies on, which states exist, where a stroke overlaps a fill, which components carry their own colors: these are on the screen. [Census](https://github.com/leonidstern/census) reads a running page in the browser and writes every fill, text color, line and state as text, with the element and its place. It needs Node 22 or newer, Chrome, and the app running. It is a separate tool that `npx` downloads, so use it only where the project's rules allow that.

```bash
# Before any change: two or three real screens with nesting, a form and a menu
npx @leonidstern/census capture --out census-before home=http://localhost:3000/ orders=http://localhost:3000/orders

# After applying: the same screens, then what changed
npx @leonidstern/census capture --out census-after home=http://localhost:3000/ orders=http://localhost:3000/orders
npx @leonidstern/census diff census-before/census.json census-after/census.json
```

- **When you find and map the system**, read the capture. A fill inside another fill tells you the `on` of a color. `states` shows the real hovers. `line` shows the strokes and the elements they sit on. A value marked `near` another is a one-off gray. The number of values in `fill`, `text` and `line` is the honest count of colors on screen.
- **After applying**, read the diff. Every changed element is listed with its old and new value. A new value is written with its alpha, like `#1111110d`, so run `shift` on each changed element, with what is under it, to see how far it moved on screen. This catches what the token table can't: muted text that now sits on a darker nested card, a stroke doubled over a fill, a hover that changed.
- Anything in the diff that is not a color, like a size, a radius or a layout change, is a mistake of yours. Fix it.
- Keep the captures out of the project, or delete them when you are done.

If census can't run, use screenshots of the same screens, and say so in the report.

## How to work

### 1. Find the system

In a codebase, read the project's rules, the tokens, the theme, the Tailwind config, the CSS variables and the main components. Also look for:

- Code that reads the token file, like a Storybook page that parses it, so you don't break it.
- Colors written directly in components: hex values, `rgb()`, one-off grays, arbitrary Tailwind values. You will list them, not edit them (rule 27).
- How each state is shown: hover, pressed, selected, disabled, focus (rules 18 and 19).
- Strokes: every border, outline and divider, and what each one lies on (rule 16).
- Solid grays that only hard surfaces use, like a menu or a raised panel (rule 14).
- Shadows and gradients (rules 22 and 29).

**Read the whole design system, not the part one page uses.** Every color token of every family goes into `system.json`: the grays, the brand, the second and third brand colors, the status colors, tags, charts, syntax, the semantic names, both themes. The screens the user picks decide what you look at first. They never decide which colors are counted. A color you leave out of the file is a color the user thinks you deleted.

In a chat, use the files, screenshots and links in the thread. If there are none, ask for them.

### 2. Map it

- Sort what you found into the three layers: masters, transparent tokens, semantics.
- Pick the masters from the colors the system already has (rules 1 to 3). The ink is the gray that text is made of: the system's own darkest color, as it is, usually very dark and not black. Never use `#000` unless the system does. In a dark-first system it is the brightest gray: keep the project's names, and don't call it darkest.
- A ramp, like blue 50 to 900, is one master and its tints (rule 5). Note which shades the interface really uses.
- Every family keeps its key color as a master, also the second and third brand colors and each status color. Never drop a family because it is rare, decorative or used in gradients. Only the user can put a family out of this. Then its colors are marked `"untouched": true` with a `"why"`, and they are still counted and still shown, unchanged.
- Give each color a `"group"` when its name does not show its family (`surface-card` goes to "surface"). Put the second theme in `"dark"`: its ground, the dark value of each master, and the dark value each token has today.
- Write `system.json` and run `map`. It gives every color its master and step, the three scales: same look, fewer steps, and the fewer steps moved to round numbers (rule 8), what does not fit, and the tint check (rule 4).
- Mark every surface as hard or soft (rules 10 to 13). The cases people get wrong:

  | Element | It is |
  | --- | --- |
  | Card, button, input, divider, a sidebar beside the content | Soft |
  | Menu, modal, tooltip, toast, popover | Hard. It may have a solid gray of its own (rule 14) |
  | Sticky header, sticky column or bottom bar that content scrolls under | Hard (rule 12) |
  | Stacked avatars, a badge on a card corner: anything that covers a neighbor | Hard (rule 12) |
  | A button on a brand banner | Soft, the banner is its ground (rule 13) |
  | A button or a label on a photo, a video or a gradient | Hard (rule 13) |

- Transfer the strokes with care (rule 16). A transparent stroke lies over the fill of its own shape, or over the surface behind it, or over both. Give it the `on` it really has, not the page. Offer one hairline token, a shadow with spread and no blur, that can be added to any other shadow, and list the borders that should move to it.
- Keep the solid grays of hard surfaces solid (rule 14). The scale is built from the three grays. A hard surface may still have a gray of its own.
- Run `contrast` for text at the deepest nesting, for text on every solid color, and for the hovers of solid colors (rule 28).
- List what does not fit, what is untouched (rule 29), the components with their own colors (rule 27), and what becomes removable (rule 26).
- Note what counts as unused only after the theme decision: a token that one theme doesn't use may be the ink of the other.
- Count the four goals of the target, now and after, and take the two benchmarks from `map`.

### 3. Interview

A report built only from the files is a guess about what matters. Before you write it, ask the user a short series of questions. This is the part that makes the report theirs.

How to ask:

- Ask after you have found and mapped the system, never before. Every question and every option uses the real names you found: their tokens, their screens, their components.
- Use your environment's question tool, the one that shows a question with options to pick: `AskUserQuestion` in Claude Code, the ask tool in Codex, a question card in a chat. One question at a time where the tool allows it. Without such a tool, ask in plain messages, one question each.
- Each question has 2 to 4 options, short, with one line on what each leads to. The user can always answer in their own words.
- 3 to 6 questions. Never ask what the code already answers. Skip a question when the system leaves nothing open in it.
- If the user says skip, or does not answer, go on with your best guess and mark it "Assumed" in the report.

The questions, in this order:

| # | Ask | Options come from | It decides |
| --- | --- | --- | --- |
| 1 | What bothers you most about the colors today? | Too many grays. Nesting and states need new colors. Themes are painful. Nothing, just curious. | What the summary leads with |
| 2 | Which screens do you want to see before and after? | The 3 or 4 routes or pages you found with the most nesting, forms and menus | The screens the preview compares, and the ones you read and check (see "Seeing the real screens"). Never which colors are counted |
| 2a | How can I see them running? | Only when you cannot open them yourself (a sign-in, no dev server). A localhost that is already running. Storybook or a component page. Read the code only. | Whether the screens are measured or read from code. Say which in the report's first line |
| 3 | How close must it stay to today's look? | Exactly the same. Small shifts are fine for fewer steps. Free to clean up. | Which scale the report leads with. It still shows all three (rule 8) |
| 4 | Which of these float above the page, or have content passing under them? | Only the surfaces you could not classify, by name | Hard or soft (rules 10 to 13) |
| 5 | These grays share a tint. On purpose, or left over? | Only when the tint check found some, by name | Tint the ink, or list them (rule 4) |
| 6 | Where is the source of truth for colors? | The token file. A Figma file. Both, kept in sync by hand. | Who must change what, in "What is left" |

Don't ask about a new theme (rule 21). If the system already has a second theme, ask which one is the main one.

### 4. Write the report

Fill [templates/report.md](templates/report.md) and save it as `hardsoft-report.md` where the project keeps its documents, or in its root. In a chat, give it as a file or an artifact.

The report is read by a designer or a design engineer who has two minutes. So:

- The first screen answers three things: is it worth it, what do I win, what stays the same.
- Then what needs their decision, each with options.
- Everything else is detail, below a line, in tables.
- No rule numbers in the summary. Plain words first, the rule in the details.
- A term is explained once, the first time it is used.

Make the preview with the calculator, never by hand, so no color can be dropped and the numbers match the map:

```bash
node scripts/hardsoft.mjs preview system.json --scale fewer --out hardsoft-preview.html
```

The page proves one thing: the same app, with fewer values. It shows, in this order: how many colors had a value of their own and how many do now, the colors that stay exactly as they are, the real screens before and after with a slider, which solid colors each key color at a step replaces, and every color of the system in every theme, today next to with hardsoft. Light and dark are drawn side by side from the same tokens, so they always show the same list. Use the scale the user's answer points to (`fewer`, `round`, `same`, or `given` with `--steps`), or `same` if they skipped. The numbers in the report's summary are the ones this page shows.

**The screens the user picked in the interview must be in it, before and after.** That is what they expect to see. Without applying anything:

1. Write the new token values to a stylesheet of their own, outside the project's files, like `hardsoft-preview.css`: the same token names, the new values, nothing else.
2. Open each picked screen in the running app and take a screenshot. Add the stylesheet to the page (a `<link>` or `page.addStyleTag` in the browser tool you have), and take the same screenshot again. Same size, same scroll, same state. Do this for each theme.
3. List them in `system.json` as `"screens": [{ "name", "before", "after" }]`. The calculator puts the images inside the page.

If the app cannot be opened even after question 2a, build the picked screen's main parts from its real component code and real token names in one static HTML file, draw it with both stylesheets, and say in the report's first line that the screens are rebuilt, not captured. Never ship a preview with no screen in it.

The preview goes where the project already shows its system, like a `/system` page or Storybook, if its rules allow it. Otherwise it is a single HTML file next to the report. In a chat it is an artifact, or the HTML file.

**The report action ends here.** Say in two or three lines what the system would win, link the report and the preview, and offer apply.

### 5. Ask once (apply and theme)

The interview has already answered some of these. Ask only the decisions that are still open, the same way as the interview, each with 2 or 3 options. The usual ones:

- Fewer steps, round steps or the same look. Show all three with their numbers of steps, biggest shifts and closeness, and don't recommend one (rule 8).
- A tinted ink, when the tint check finds one (rule 4). Give both sides: how many tinted grays then fit, and how far the other grays move.
- A second master, when the interface uses a shade darker than its master (rule 5).
- Each color that fits nothing: keep it as it is, or move it to the closest step, with the shift (rule 23).
- Each weak text contrast, with the nearest stronger step (rule 28).
- Which surfaces are hard, only where you could not tell.

For everything else, choose on your own, write the choice and its rule in the plan, and move on. If something you find later changes an answer, say so in the plan.

### 6. Show the plan and the preview, then wait

The plan is the same report, updated with the answers: the chosen scale, the old-to-new table, what is kept, what is listed. Update the preview to the chosen scale. Then stop and wait for a yes (rule 30).

### 7. Apply after a yes

- Write the tokens in the format the project already has: where they live, how they are mixed and how they are named. [formats.md](formats.md) shows the pattern in each format: Tailwind 4, Tailwind 3, CSS variables, Sass, JS or TS, and JSON tokens. Use Tailwind 4 `@theme` when a Tailwind project has no color tokens yet, and in a chat.
- The templates are patterns with no colors. Every color, step and name you write comes from the system.
- Write only the steps each master really uses, not every master at every step.
- Every old name keeps working, pointed at a master or a transparent token (rule 26). Point the semantic tokens the same way (rule 25).
- Don't edit components (rule 27). They keep working because the names do.
- Keep the design of every state, and rebuild only its color (rules 18 and 19).
- Check the result: the project builds and its own checks pass.
- Check two or three real screens, the same ones before and after, in each theme: with census where it can run (see above), and with screenshots at the same size for the user to look at. Pick screens with nesting, a form and a menu. If you can't run the app, name the screens for the user to look at, and say that you could not check them.
- Finish the report: the real numbers, what changed on the real screens, the screenshots, what is left. Tell the user what changed and what is left in a few lines, with the link.

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
