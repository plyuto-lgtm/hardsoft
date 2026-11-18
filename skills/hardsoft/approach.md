# Hard and soft surfaces: the approach

This is the approach from the article [Hard and soft surfaces: a concept of a highly flexible design system](https://plyuto.design/article/soft-and-hard-surfaces) by Alexander Plyuto, written out in full, so you can apply it without opening the article.

In one line: a system needs a few master colors and one alpha scale. Hard surfaces take solid colors, soft surfaces take transparent ones, and every hard surface resets the count.

## The problem it solves

In most design systems the list of grays and color shades keeps growing. A card needs a gray a bit darker than the page. A card inside it needs another. Hover needs a third. Then dark mode doubles all of it.

Semantic tokens (tokens named by their role, like `surface-raised-hover`) don't fix this: they only give it names. 5 surface levels × 4 states × 3 roles is 60 tokens, and that is before dark mode, brand colors and status colors.

The result is a palette nobody fully remembers. A small visual change means editing dozens of values and matching contrast by hand.

## Master colors

A master is a solid color that other colors are made from. A system needs only a few:

| Group | Masters | What they are |
| --- | --- | --- |
| Gray | darkest, medium, brightest | Darkest is the ink: the color of text, and the base of almost every transparent layer. Brightest is the ground: the page background. Medium is a solid middle gray for the few places where a transparent gray can't be used, like text on a label that floats over a photo. |
| Brand | primary, secondary | The colors of the brand. |
| System | negative, positive, attention | Error, success and warning. |

A system can have fewer masters, for example one brand color. It should rarely have more.

## One alpha scale

Alpha is how solid a color is: 100% is fully solid, 0% is invisible.

On top of the masters there is one range of transparent versions: each master at 80, 40, 20, 10 and 5 percent. These are not new colors, because they all depend on a master. Change a master and all its steps follow. So the only independent scale in the system is transparency.

Each step is half of the one before, so two steps are always easy to tell apart. Start from this scale and change a step only when the system clearly needs it.

A good starting point for the darkest gray:

| Step | Where it is used |
| --- | --- |
| the master itself | main text |
| 80 | secondary text |
| 40 | placeholders, hints, disabled text |
| 20 | strokes: the borders of inputs and buttons |
| 10 | buttons, tags, dividers |
| 5 | cards and other large fills |

These are starting points, not rules. Where a step is used is its role, so a step does not need a second name.

## Hard and soft surfaces

Transparency isn't new. What was missing is a rule for when to use it. The rule is hard and soft surfaces.

**Hard surfaces use solid colors.** A hard surface is the base that other elements sit on. There are two cases:

- the global background (the ground),
- anything that lives out of the flow: context menus, dropdowns, modals, popovers, tooltips, toasts and other floating elements.

"The flow" is the normal layout of the page, where elements sit next to and inside each other. A menu is out of the flow because it floats above the page and can cover anything.

**Soft surfaces use transparent colors.** A soft surface is any element that lives in the flow: a card, a button, a text button, an input, a button's border, a divider, secondary text.

Each soft surface is its background plus ink at some alpha. In the article's example, an input is text at 60 and a stroke at 20: it has no color of its own, only two steps of the ink over whatever is under it. (The numbers are steps of that system's scale. On the default scale here, the text would be 80.)

| Element | Kind | Color |
| --- | --- | --- |
| Page background | hard | `gray-brightest` |
| Menu, dropdown, modal, toast | hard | `gray-brightest` |
| Card | soft | `gray-darkest-5` |
| Button | soft | `gray-darkest-10` |
| Input stroke, divider | soft | `gray-darkest-20` |
| Secondary text | soft | `gray-darkest-80` |
| Error message background | soft | `system-negative-10` |

A hard surface often has the same color as the ground. Tell it apart with a stroke of the darkest gray at 10, or a shadow.

## Nesting

With a classic approach every level of nesting is a separate decision: a card on the page, a card in a card, a button in that card. Every level needs its own contrast matching and new token names. Or the levels end up looking inconsistent, because their contrast against the background differs.

With soft surfaces this problem is gone. A transparent layer is always a bit darker than whatever it sits on, so the relative contrast is the same at every level. A card at 5 on the page, a card at 5 inside it, and a button at 10 inside that all read correctly, with no new colors.

Layers don't stack forever, because a hard surface resets the count. A dropdown gets a solid color, and everything inside it starts from zero again. The only limit is common sense about how deep to nest.

The same rule works for brand, error, success and warning colors: a soft red area is `system-negative` at a step, not a new pale red.

## Hover

A hover is not a new color either. There are two cases.

**A gray's hover is its next step on the scale.** A button at 10 becomes 20. A card at 5 becomes 10.

**A color's hover is the darkest gray at 10% laid over it in a plus-darker blend.** Plus-darker is a blend mode (Figma calls it "Plus darker") that subtracts the darkness of the top layer from the color under it. It keeps the color rich, where a normal layer makes it a bit gray.

In code, don't use a live blend mode: browsers don't all support this one, and blend modes on many elements are slow. Work the result out as a number instead. For each channel (red, green, blue, from 0 to 255):

```text
offset        = 0.10 × (255 − ink channel)
hover channel = max(0, color channel − offset)
```

For the ink `#131416` (19, 20, 22) the offsets are 23.6, 23.5 and 23.3. For pure black they are all 25.5.

In CSS this is a relative color, a color written as a change to another color:

```css
--brand-secondary-hover: rgb(from var(--brand-secondary) max(0, r - 23.6) max(0, g - 23.5) max(0, b - 23.3));
```

With `#007aff` this gives about `#0063e8`.

Where relative colors or the blend are missing (older browsers, some design tools), the fallback is a plain layer of the darkest gray at 10% over the color:

```css
--brand-secondary-hover: color-mix(in srgb, var(--brand-secondary) 90%, #131416);
```

The offsets are worked out from the light theme's ink and stay the same in dark mode, so a color and its hover look the same in both themes.

## Dark mode

A dark theme is mostly swapping the grays. The darkest and the brightest gray trade places: the ink turns from black to white, and the ground from white to dark.

Nothing else changes. The scale stays the same, the token names stay the same, and every step follows its master on its own. A card is still `gray-darkest-5`: in the light theme it darkens the ground a little, in the dark theme it lightens it a little, with the same relative contrast.

Brand and system colors stay as they are. Change one only if it is hard to read on the dark ground.

## Is transparency slow?

It used to be, when browsers drew everything on the CPU. Today opacity is one of the two properties browsers can animate cheaply.

In a test in the worst case (Chrome with the GPU off), solid colors took 2.41 ms per frame, alpha colors 2.83 ms and alpha with a multiply blend 3.18 ms. A frame at 60 fps has 16.7 ms, so alpha adds about 0.4 ms.

One thing to avoid is blend modes on hundreds of elements: they cost more than plain transparency. This is why the hover above is worked out as a number.

## Token names

Name a token by its master and its step: `gray-darkest-20`, `brand-primary-10`, `system-negative-40`. A master alone is the solid color: `gray-brightest`, `brand-primary`. A color's hover is the master plus `hover`: `brand-primary-hover`.

Don't name tokens by role (`border-subtle`, `surface-raised`). Role names are how the list grows back to 60.

## What you get

- **Predictable contrast.** It holds at any level of nesting, without picking colors by hand.
- **Quick tuning.** Change one gray or one alpha step and the whole UI follows.
- **Easy themes.** A dark theme is mostly swapping the grays and switching the ink from black to white.
- **Fewer colors.** A few colors and one transparency scale in place of dozens of grays.

## The one question

For any new element, ask one question: is it in the flow, or above it?

In the flow, it is soft: a master at a step. Above the flow, it is hard: a solid color, and everything inside it starts from zero.
