<!-- hardsoft: the shape of the report. The same file is the report, then the plan, then the record of what was done.
     Keep the headings and the order. Leave a section out only when it is empty.
     <...> is a value to fill in. The part above "Details" is for a reader with two minutes: plain words, no rule numbers.
     The part below it is tables. -->

# hardsoft report: <project>

**<Report only: nothing has changed. | Plan: waiting for a yes. | Applied on <date>.>**

## In short

**<Worth it. | Some to win. | Little to win: the system already works this way.>** <One sentence: the biggest win, in the user's own words from the interview.>

| | Today | With hardsoft |
| --- | --- | --- |
| Colors with a value of their own | <n> | <n> |
| Solid colors | <n> | <n> masters and one scale of <n> steps |
| Colors that only name a level or a state | <n> | 0 |
| Values to edit to change all the grays | <n> | 1 |
| Values a second theme needs | <n> | <n> |

**It stays <n>% the same.** <n> of <n> colors look exactly as they do today. <The ones that move, by name, and how visibly.>

**What does not change:** your token names, your components, your brand colors, <anything else the interview protected>.

## Your answers

| Question | Answer |
| --- | --- |
| <the interview question, short> | <the answer, or "Assumed: <guess>"> |

## Decisions for you

<Numbered. Only what is really open. Each with its options and what each one costs. "None" if nothing is open.>
<A clash with a rule the project wrote for itself (a frozen value, "do not add a gray") always goes first here, never in Details.>

1. **<The decision, as a question.>** <One line of why it comes up.>
   - <Option>: <what happens, with the number>
   - <Option>: <what happens, with the number>

## What would change

<Three to six lines, in plain words, by what the user sees: "The 11 grays become one ink at 7 steps." "Cards at every level use one token." "The button hover is the ink laid over the brand color.">

## Found along the way

<Only when the audit turned up problems that are not about this approach: class names that point at tokens that do not exist, two tokens a hair apart, dead values. A table of file, what, and what happens. Not fixed here.>

---

## Details

### Masters

| Master | Value | Role |
| --- | --- | --- |
| <name> | <value> | <ink, ground, brand, negative...> |

### The scale

| Version | Steps | Biggest shift | Closeness |
| --- | --- | --- | --- |
| Same look | <n>: <list> | <shift> | <n>% |
| Fewer steps | <n>: <list> | <shift> | <n>% |
| Round steps | <n>: <list> | <shift> | <n>% |

<After the answer: "Chosen: <version>.">

Shift is how far a color moves. Under 2 the eye barely sees it. Closeness is the share of colors with a shift of 2 or less.

### Old to new

| Token | Was | Sits on | Now | Shift |
| --- | --- | --- | --- | --- |
| <name> | <value> | <background> | <master>-<step> | <shift> |

### Surfaces

| Surface | Hard or soft | Made of | Rule |
| --- | --- | --- | --- |
| <card, menu, sticky header...> | <hard, soft> | <token, or solid color with its edge> | <number> |

### Strokes

Each one measured over what it really lies on (rule 16).

| Stroke | Was | Lies on | Now | Move to the hairline |
| --- | --- | --- | --- | --- |
| <input border, divider...> | <value> | <the fill, the surface behind> | <token> | <yes, with the file, or no> |

### States

| Element | State | Was | Now |
| --- | --- | --- | --- |
| <button> | <hover, pressed, selected, disabled, focus> | <value> | <token or layer> |

### Does not fit

| Color | Where | Why | Options |
| --- | --- | --- | --- |
| <name and value> | <use> | <closest master and step, with the shift> | <keep, move to a step, new master, tint the ink> |

### Contrast

Measured against WCAG AA: 4.5 to 1 for normal text, 3 to 1 for large text.

| Text | On | Ratio | Was | Nearest step that passes |
| --- | --- | --- | --- | --- |
| <token> | <layers, deepest nesting> | <ratio> | <low before, became low> | <step> |

### Components with their own colors

Not edited (rule 27). Each one should use the token next to it.

| File | Color | Token to use |
| --- | --- | --- |
| <path:line> | <value> | <token> |

### Removable

Every old name still works (rule 26). These can go when the team chooses.

| Token | Why |
| --- | --- |
| <name> | <same as another token, unused, unused shade of a ramp> |

### Left out

<Gradients, photos, illustrations, charts, code highlighting, tool colors (rule 29). One line each.>

### Decisions made

| Decision | Choice | Who | Rule |
| --- | --- | --- | --- |
| <fewer steps or same look, tint, second master...> | <choice> | <you, or the skill> | <number> |

<Clashes with the project's own rules, if any: which rule lost and why.>

### Screens

<After applying. The same screens before and after, in each theme.>

| Screen | Elements that changed color | Biggest shift on screen | Anything else changed |
| --- | --- | --- | --- |
| <name> | <n> | <shift, and the element> | <none, or what> |

<How it was checked: census, screenshots, or the list of screens to check by eye.>

## What is left

<Short list: decisions still open, components to move, tokens to remove, who must update the design source.>
