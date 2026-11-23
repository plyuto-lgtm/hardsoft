# hardsoft report: Messy system

**Applied. This is the worked example of the skill: an invented system, with the answers an imagined user gave.**

35 solid colors became 6 masters and one scale of 8 steps. Three colors that only named a level or a state are gone. A dark theme would now need 5 values, not 28.

## Benchmarks

| | Before | After |
| --- | --- | --- |
| Independent tokens | 36 | 8: 6 masters, 2 kept as they are |
| Dependent tokens | 3 | 46 |

**Closeness: 97%.** 34 of 35 colors look the same. Average shift 0.7, biggest 2.2.

An independent token has a value of its own. A dependent one is made from another token. A color looks the same when its shift is 2 or less.

## What you win

| Goal | Before | After |
| --- | --- | --- |
| Fewer colors | 35 solid colors | 6 masters and 8 steps, plus 2 colors kept as they are |
| Predictable contrast | 3 colors that only name a level or a state | 0: a level is the same token again |
| Quick tuning | 23 values to edit to change the grays | 1: the ink |
| Easy theme conversion | 28 values for a second theme | 5: the ink, the ground, text on a color, the overlay, the shadow |

## Masters

| Master | Value | Role |
| --- | --- | --- |
| gray-900 | #111111 | The ink |
| page | #ffffff | The ground |
| blue-600 | #2563eb | Brand |
| blue-900 | #1e3a8a | Brand, dark: text on blue tints. New, approved (rule 5) |
| red-600 | #dc2626 | Negative |
| green-600 | #16a34a | Positive |

## The scale

| Version | Steps | Biggest shift |
| --- | --- | --- |
| Same look | 20: 3, 5, 6, 7, 8, 10, 11, 12, 16, 18, 20, 23, 30, 40, 41, 43, 60, 61, 70, 82 | 1.6 |
| Fewer steps | 9: 5, 12, 18, 23, 30, 41, 61, 70, 82 | 2.4 |
| Fewer steps, rounded | 8: 5, 10, 20, 30, 40, 60, 70, 80 | 2.2 |

Chosen: fewer steps, rounded. The user asked for round numbers, and the skill scored that scale with `map --steps`.

Shift is how far a color moves. Under 2 the eye barely sees it.

## Old to new

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

## Surfaces

| Surface | Hard or soft | Made of | Rule |
| --- | --- | --- | --- |
| Card, nested card | Soft | gray-900-5, the same token at every level | 10, 17 |
| Sidebar, beside the content | Soft | gray-900-5 | 12 |
| Input | Soft | Stroke gray-900-20, placeholder gray-900-40 | 10 |
| Status blocks | Soft | red-600-5, green-600-10, blue-600-10 | 10 |
| Dropdown menu | Hard | page, with a shadow of gray-900-10 as its edge | 11, 15 |
| Modal | Hard | page, over the overlay gray-900-40 | 11 |
| Sticky table header | Hard | page: rows scroll under it | 12 |

## Strokes

Each one measured over what it really lies on (rule 16).

| Stroke | Was | Lies on | Now | Move to the hairline |
| --- | --- | --- | --- | --- |
| Card border | border-subtle #e5e5e5 | page | gray-900-10 | Yes: `--hairline`, in src/components/Card.css |
| Input border | border-strong #c9c9c9 | page | gray-900-20 | Yes: `--hairline-strong`, in src/components/Input.css |
| Divider | border-subtle #e5e5e5 | page | gray-900-10 | No: it is a line, not a stroke on a fill |

A card border over the card's own transparent fill would read as two layers. As a hairline it is one.

## States

| Element | State | Was | Now |
| --- | --- | --- | --- |
| Card | Hover | #ececec | gray-900-10: the next step |
| Primary button | Hover | blue-700 | blue-600 with the ink at 10 over it |
| Input | Focus | 2 px ring, blue-600 | The same ring, blue-600 |

## Does not fit

| Color | Where | Why | Options |
| --- | --- | --- | --- |
| slate-300 #c3cddb | Chart axis labels | Closest is gray-900-20, shift 2.5 | Kept as it is, on the user's word |
| slate-500 #6f7f96 | Icons in the sidebar | Closest is gray-900 at 53%, shift 4.2 | Kept as it is, on the user's word |
| blue-900 #1e3a8a | Text on blue tints | Darker than blue-600, so no alpha makes it | Became a second master, approved |

The five slate grays share a blue tint. A tinted ink (#000b3c) would fit them, biggest shift 1.4. The 19 grays with no tint would then move by up to 7.5. Offered, and declined.

## Contrast

Measured against WCAG AA: 4.5 to 1 for normal text, 3 to 1 for large text.

| Text | On | Ratio | Was | Nearest step that passes |
| --- | --- | --- | --- | --- |
| text-placeholder, gray-900-40 | page | 2.62 | Low before (2.68) | 60. Declined: it is placeholder text |
| text-muted, gray-900-60 | Three cards deep | 4.45 | Became low: was 5.02 on the page only | 70. Accepted for text inside nested cards |
| White on blue-600 | Primary button | 5.17 | Fine | - |
| White on the button hover | Primary button | 5.96 | Fine | - |
| blue-900 | blue-600-10 | 9.02 | Fine | - |

## Components with their own colors

Not edited (rule 27). Each one should use the token next to it.

| File | Color | Token to use |
| --- | --- | --- |
| src/components/Badge.css:12 | #efefef | gray-900-5 |
| src/components/Table.css:40 | #fafafa | gray-900-5, or none |
| src/components/Tooltip.css:8 | #222222 | gray-900 |

## Removable

Every old name still works (rule 26). These can go when the team chooses.

| Token | Why |
| --- | --- |
| gray-250, gray-150, gray-50 | The same as gray-300, gray-200 and gray-100 now |
| slate-200, slate-100 | The same as gray-200 and gray-100 now |
| surface-card-nested | The same as surface-card |
| surface-card-hover | The same as gray-200 |
| blue-700 | The same as button-primary-hover |

## Left out

- The gradient on the marketing banner (rule 29).
- The chart palette.

## Decisions

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

## Screens

The example has no product to take screenshots of. See [preview.html](preview.html).

## What is left

- Three components still carry their own colors.
- Two borders should move to the hairline tokens.
- Eight tokens can be removed.
- slate-300 and slate-500 stay outside the system until someone decides.
