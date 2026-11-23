# hardsoft report: Messy system

**Applied. This is the worked example of the skill: an invented system, with the answers an imagined user gave.**

## In short

**Worth it.** The grays were the problem: 23 of them, with a new one for every level and state. Now there is one ink, and a level is the same token again.

| | Before | Now |
| --- | --- | --- |
| Colors with a value of their own | 36 | 8 |
| Solid colors | 35 | 6 masters and one scale of 8 steps |
| Colors that only name a level or a state | 3 | 0 |
| Values to edit to change all the grays | 23 | 1 |
| Values a second theme needs | 28 | 5 |

**It stays 97% the same.** 34 of 35 colors look exactly as they did. One moved a little: the overlay under modals is a touch lighter.

**What did not change:** every token name, every component, the brand blue, red and green.

## Your answers

| Question | Answer |
| --- | --- |
| What bothers you most? | Nesting and states need new colors |
| Which screens matter most? | Orders, Settings, the order modal |
| How close must it stay? | Small shifts are fine for fewer steps |
| Sticky table header: does content pass under it? | Yes |
| The five slate grays: on purpose or left over? | Left over from an older redesign |
| Where is the source of truth? | The token file. Figma is updated by hand |

## Decisions for you

All answered. They are in "Decisions made" below.

## What changed

- The 18 neutral grays are one ink at 7 steps.
- Cards at every level use one token. The nested-card color and the card-hover color are gone as colors, and their names still work.
- The blue, red and green tints are their master at a step.
- The primary button's hover is the ink laid over the blue.
- blue-900 became a second master: it is darker than the blue, so no alpha makes it.
- Two slate grays fit nothing and are kept as they are.

---

## Details

### Masters

| Master | Value | Role |
| --- | --- | --- |
| gray-900 | #111111 | The ink |
| page | #ffffff | The ground |
| blue-600 | #2563eb | Brand |
| blue-900 | #1e3a8a | Brand, dark: text on blue tints. New, approved (rule 5) |
| red-600 | #dc2626 | Negative |
| green-600 | #16a34a | Positive |

### The scale

| Version | Steps | Biggest shift | Closeness |
| --- | --- | --- | --- |
| Same look | 20: 3, 5, 6, 7, 8, 10, 11, 12, 16, 18, 20, 23, 30, 40, 41, 43, 60, 61, 70, 82 | 1.6 | 100% |
| Fewer steps | 9: 5, 12, 18, 23, 30, 41, 61, 70, 82 | 2.4 | 94% |
| Fewer steps, rounded | 8: 5, 10, 20, 30, 40, 60, 70, 80 | 2.2 | 97% |

Chosen: fewer steps, rounded. The user asked for round numbers, and the skill scored that scale with `map --steps`.

Shift is how far a color moves. Under 2 the eye barely sees it. Closeness is the share of colors with a shift of 2 or less.

### Old to new

| Token | Was | Sits on | Now | Shift |
| --- | --- | --- | --- | --- |
| gray-700 | #3d3d3d | page | gray-900-80 | 1.4 |
| gray-600 | #585858 | page | gray-900-70 | 0.1 |
| gray-500 | #707070 | page | gray-900-60 | 0.1 |
| gray-400 | #a0a0a0 | page | gray-900-40 | 0.1 |
| gray-300 | #cfcfcf | page | gray-900-20 | 0.1 |
| gray-250 | #d4d4d4 | page | gray-900-20 | 1.4 |
| gray-200 | #e7e7e7 | page | gray-900-10 | 0.1 |
| gray-150 | #ebebeb | page | gray-900-10 | 1.1 |
| gray-100 | #f3f3f3 | page | gray-900-5 | 0 |
| gray-50 | #f7f7f7 | page | gray-900-5 | 1.2 |
| slate-200 | #dde3ec | page | gray-900-10 | 2 |
| slate-100 | #eef1f6 | page | gray-900-5 | 1 |
| surface-card | #f3f3f3 | page | gray-900-5 | 0 |
| surface-card-nested | #e8e8e8 | surface-card | gray-900-5 | 0.1 |
| surface-card-hover | #ececec | page | gray-900-10 | 1.5 |
| sidebar-bg | #f0f3f8 | page | gray-900-5 | 0.8 |
| border-subtle | #e5e5e5 | page | gray-900-10 | 0.7 |
| border-strong | #c9c9c9 | page | gray-900-20 | 2 |
| text-muted | #6f6f6f | page | gray-900-60 | 0.4 |
| text-placeholder | #9e9e9e | page | gray-900-40 | 0.6 |
| overlay | rgba(0, 0, 0, 0.4) | page | gray-900-40 | 2.2 |
| shadow-color | rgba(17, 17, 17, 0.12) | page | gray-900-10 | 1.4 |
| blue-700 | #235bd5 | blue-600 | blue-600 with the ink at 10 over it | 0 |
| blue-200 | #bed1f9 | page | blue-600-30 | 0.2 |
| blue-100 | #dbe6fc | page | blue-600-20 | 2 |
| blue-50 | #eef3fe | page | blue-600-10 | 1.2 |
| red-50 | #fdf0f0 | page | red-600-5 | 1 |
| green-50 | #edf8f1 | page | green-600-10 | 1 |

### Surfaces

| Surface | Hard or soft | Made of | Rule |
| --- | --- | --- | --- |
| Card, nested card | Soft | gray-900-5, the same token at every level | 10, 17 |
| Sidebar, beside the content | Soft | gray-900-5 | 12 |
| Input | Soft | Stroke gray-900-20, placeholder gray-900-40 | 10 |
| Status blocks | Soft | red-600-5, green-600-10, blue-600-10 | 10 |
| Dropdown menu | Hard | page, with a shadow of gray-900-10 as its edge | 11, 15 |
| Modal | Hard | page, over the overlay gray-900-40 | 11 |
| Sticky table header | Hard | page: rows scroll under it | 12 |

### Strokes

Each one measured over what it really lies on (rule 16).

| Stroke | Was | Lies on | Now | Move to the hairline |
| --- | --- | --- | --- | --- |
| Card border | border-subtle #e5e5e5 | page | gray-900-10 | Yes: `--hairline`, in src/components/Card.css |
| Input border | border-strong #c9c9c9 | page | gray-900-20 | Yes: `--hairline-strong`, in src/components/Input.css |
| Divider | border-subtle #e5e5e5 | page | gray-900-10 | No: it is a line, not a stroke on a fill |

A card border over the card's own transparent fill would read as two layers. As a hairline it is one.

### States

| Element | State | Was | Now |
| --- | --- | --- | --- |
| Card | Hover | #ececec | gray-900-10: the next step |
| Primary button | Hover | blue-700 | blue-600 with the ink at 10 over it |
| Input | Focus | 2 px ring, blue-600 | The same ring, blue-600 |

### Does not fit

| Color | Where | Why | Options |
| --- | --- | --- | --- |
| slate-300 #c3cddb | Chart axis labels | Closest is gray-900-20, shift 2.5 | Kept as it is, on the user's word |
| slate-500 #6f7f96 | Icons in the sidebar | Closest is gray-900 at 53%, shift 4.2 | Kept as it is, on the user's word |
| blue-900 #1e3a8a | Text on blue tints | Darker than blue-600, so no alpha makes it | Became a second master, approved |

The five slate grays share a blue tint. A tinted ink (#000b3c) would fit them, biggest shift 1.4. The 19 grays with no tint would then move by up to 7.5. Offered, and declined.

### Contrast

Measured against WCAG AA: 4.5 to 1 for normal text, 3 to 1 for large text.

| Text | On | Ratio | Was | Nearest step that passes |
| --- | --- | --- | --- | --- |
| text-placeholder, gray-900-40 | page | 2.62 | Low before (2.68) | 60. Declined: it is placeholder text |
| text-muted, gray-900-60 | Three cards deep | 4.45 | Became low: was 5.02 on the page only | 70. Accepted for text inside nested cards |
| White on blue-600 | Primary button | 5.17 | Fine | - |
| White on the button hover | Primary button | 5.96 | Fine | - |
| blue-900 | blue-600-10 | 9.02 | Fine | - |

### Components with their own colors

Not edited (rule 27). Each one should use the token next to it.

| File | Color | Token to use |
| --- | --- | --- |
| src/components/Badge.css:12 | #efefef | gray-900-5 |
| src/components/Table.css:40 | #fafafa | gray-900-5, or none |
| src/components/Tooltip.css:8 | #222222 | gray-900 |

### Removable

Every old name still works (rule 26). These can go when the team chooses.

| Token | Why |
| --- | --- |
| gray-250, gray-150, gray-50 | The same as gray-300, gray-200 and gray-100 now |
| slate-200, slate-100 | The same as gray-200 and gray-100 now |
| surface-card-nested | The same as surface-card |
| surface-card-hover | The same as gray-200 |
| blue-700 | The same as button-primary-hover |

### Left out

- The gradient on the marketing banner (rule 29).
- The chart palette.

### Decisions made

| Decision | Choice | Who | Rule |
| --- | --- | --- | --- |
| Fewer steps or the same look | Fewer steps, rounded: 8 steps | User | 8 |
| Tint the ink for the slate grays | No | User | 4 |
| blue-900 | A second master | User | 5 |
| slate-300, slate-500 | Keep as they are | User | 23 |
| Placeholder contrast | Keep at 40 | User | 28 |
| Muted text in nested cards | Step 70 there | User | 28 |
| Hover of the primary button | The ink at 10 over blue-600 | Skill | 18 |
| Shadow color | gray-900-10, the shape untouched | Skill | 22 |
| Strokes | Two hairline tokens added, borders listed | Skill | 16 |
| Dark theme | Not added: nobody asked | Skill | 21 |

### Screens

The example has no product to take screenshots of. See [preview.html](preview.html).

## What is left

- Figma needs the same change, by hand: the token file is the source.
- Three components still carry their own colors.
- Two borders should move to the hairline tokens.
- Eight tokens can be removed.
- slate-300 and slate-500 stay outside the system until someone decides.
