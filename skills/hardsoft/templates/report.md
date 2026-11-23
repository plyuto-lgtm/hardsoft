<!-- hardsoft: the shape of the report. The same file is the report, then the plan, then the record of what was done.
     Keep the headings and the order. Leave a section out only when it is empty, and say "None" under "Does not fit".
     <...> is a value to fill in. No long explanations: numbers, tables, short lines. -->

# hardsoft report: <project>

**<Report only: nothing has changed. | Plan: waiting for a yes. | Applied on <date>.>**

<Two or three lines: what the system wins, in numbers.>

## Benchmarks

| | Before | After |
| --- | --- | --- |
| Independent tokens | <n> | <n>: <n> masters, <n> solid grays of hard surfaces, <n> kept as they are |
| Dependent tokens | <n> | <n> |

**Closeness: <n>%.** <n> of <n> colors look the same. Average shift <n>, biggest <n>.

An independent token has a value of its own. A dependent one is made from another token. A color looks the same when its shift is 2 or less.

## What you win

| Goal | Now | After |
| --- | --- | --- |
| Fewer colors | <n> solid colors | <n> masters and <n> steps |
| Predictable contrast | <n> colors that only name a level or a state | 0: a level is the same token again |
| Quick tuning | <n> values to edit to change the grays | 1: the ink |
| Easy theme conversion | <n> values for a second theme | <n>: the ink, the ground and <what must look the same> |

## Masters

| Master | Value | Role |
| --- | --- | --- |
| <name> | <value> | <ink, ground, brand, negative...> |

## The scale

| Version | Steps | Biggest shift |
| --- | --- | --- |
| Same look | <n>: <list> | <shift> |
| Fewer steps | <n>: <list> | <shift> |

<After the answer: "Chosen: <version>." Before it: no recommendation (rule 8).>

Shift is how far a color moves. Under 2 the eye barely sees it.

## Old to new

| Token | Was | Sits on | Now | Shift |
| --- | --- | --- | --- | --- |
| <name> | <value> | <background> | <master>-<step> | <shift> |

## Surfaces

| Surface | Hard or soft | Made of | Rule |
| --- | --- | --- | --- |
| <card, menu, sticky header...> | <hard, soft> | <token, or solid color with its edge> | <number> |

## Strokes

Each one measured over what it really lies on (rule 16).

| Stroke | Was | Lies on | Now | Move to the hairline |
| --- | --- | --- | --- | --- |
| <input border, divider...> | <value> | <the fill, the surface behind> | <token> | <yes, with the file, or no> |

## States

| Element | State | Was | Now |
| --- | --- | --- | --- |
| <button> | <hover, pressed, selected, disabled, focus> | <value> | <token or layer> |

## Does not fit

| Color | Where | Why | Options |
| --- | --- | --- | --- |
| <name and value> | <use> | <closest master and step, with the shift> | <keep, move to a step, new master, tint the ink> |

## Contrast

Measured against WCAG AA: 4.5 to 1 for normal text, 3 to 1 for large text.

| Text | On | Ratio | Was | Nearest step that passes |
| --- | --- | --- | --- | --- |
| <token> | <layers, deepest nesting> | <ratio> | <low before, became low> | <step> |

## Components with their own colors

Not edited (rule 27). Each one should use the token next to it.

| File | Color | Token to use |
| --- | --- | --- |
| <path:line> | <value> | <token> |

## Removable

Every old name still works (rule 26). These can go when the team chooses.

| Token | Why |
| --- | --- |
| <name> | <same as another token, unused, unused shade of a ramp> |

## Left out

<Gradients, photos, illustrations, charts, code highlighting, tool colors (rule 29). One line each.>

## Decisions

| Decision | Choice | Who | Rule |
| --- | --- | --- | --- |
| <fewer steps or same look, tint, second master...> | <choice> | <you, or the skill> | <number> |

<Clashes with the project's own rules, if any: which rule lost and why.>

## Screens

<After applying. The same screens before and after, in each theme.>

| Screen | Elements that changed color | Biggest shift on screen | Anything else changed |
| --- | --- | --- | --- |
| <name> | <n> | <shift, and the element> | <none, or what> |

<How it was checked: census, screenshots, or the list of screens to check by eye.>

## What is left

<Short list: questions still open, components to move, tokens to remove.>
