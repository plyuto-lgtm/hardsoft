# Hard and soft surfaces: the concept and its rules

This is the concept from the article [Hard and soft surfaces: a concept of a highly flexible design system](https://plyuto.design/article/soft-and-hard-surfaces) by Alexander Plyuto, extended into rules you can apply to a real system.

In one line: a system needs a few master colors and one transparency scale. Hard surfaces take solid colors, soft surfaces take transparent ones, and every hard surface resets the count.

## The problem

In most design systems the list of grays and color shades keeps growing. A card needs a gray a bit darker than the page. A card inside it needs another. Hover needs a third. Then dark mode doubles all of it.

Semantic tokens (tokens named by their role, like `surface-raised-hover`) don't fix this: they only give it names. 5 surface levels × 4 states × 3 roles is 60 tokens, and that is before dark mode, brand colors and status colors.

The result is a palette nobody fully remembers. A small visual change means editing dozens of values and matching contrast by hand.

## The concept

### Three layers

1. **Masters.** A few solid colors. Everything else is made from them.
2. **Transparent tokens.** Each master at the steps of one alpha scale. Alpha is how solid a color is: 100% is fully solid, 0% is invisible. These are not new colors, because each one depends on its master.
3. **Semantics.** Role names like `bg-neutral`, if the project has them. They sit on top and point at the first two layers.

The concept is about the first two layers. Semantics are not part of it: a project can have them or not.

### Few colors, one scale

It is enough to have only several master colors:

- Gray: darkest, medium, brightest
- Brand: primary, secondary
- System: negative, positive, attention

On top of them there is one range of transparent versions: black at 5%, 10%, 20% and so on. They all depend on the masters, so the only independent scale in the system is transparency.

### Hard and soft surfaces

Transparency isn't new. What was missing is a rule for when to use it.

**Hard surfaces use solid colors.** A hard surface is the base that other elements sit on. There are two cases: the global background, and anything that lives out of the flow, like context menus, modals and floating elements.

"The flow" is the normal layout of the page, where elements sit next to and inside each other. A menu is out of the flow, because it floats above the page and can cover anything.

**Soft surfaces use transparent colors.** A soft surface is any element that lives in the flow: a card, a button, a text button, an input, a button's border, a divider.

Each one is its background plus ink at some alpha. The ink is the darkest gray. An input, for example, is text at 60 and a stroke at 20: it has no color of its own.

### Nesting

With a classic approach every level of nesting is a separate decision: a card on the page, a card in a card, a button in that card. Every level needs its own contrast matching and new names. Or the levels end up looking inconsistent, because their relative contrast differs.

With soft surfaces this is gone. A transparent layer is always a bit darker than whatever it sits on, so the relative contrast is always consistent.

Layers don't stack forever, because a hard surface resets the count. A dropdown gets a solid color, and everything inside it starts from zero again. The only limit is common sense about how deep to nest. The same rule works for brand, error, success and warning colors.

### What you get

- **Predictable contrast.** It holds at any level of nesting, without picking colors by hand.
- **Quick tuning.** Change one gray or one alpha step and the whole UI follows.
- **Easy theme conversion.** A dark theme is mostly swapping the grays and switching the ink from black to white.
- **Fewer colors.** A few colors and one transparency scale in place of dozens of grays.

### Is transparency slow?

It used to be, when browsers drew everything on the CPU. Today opacity is one of the two properties browsers can animate cheaply. In a worst-case test (Chrome with the GPU off) alpha added about 0.4 ms per frame, and a frame has 16.7 ms.

One thing to avoid is blend modes on hundreds of elements. They cost more than plain transparency.

### The one question

For any new element, ask one question: is it in the flow, or above it?

## The rules

### Masters

1. **Few masters.** The usual set is three grays (darkest, medium, brightest), two brand colors (primary, secondary) and three system colors (negative, positive, attention). They are the system's own colors. Fewer is fine. More needs a reason.
2. **The darkest gray is the ink.** Text and almost every transparent layer are made from it. The brightest gray is the ground: the global background.
3. **The medium gray is for softer toning.** For example the muting overlay under a modal, or a transparent fill used together with a background blur. It is rare, but some systems need it.

### The scale

4. **One alpha scale** for all masters.
5. **The steps come from the system.** Use the alphas it already has. Where it has solid grays, convert each one to the closest alpha of the ink over the background it sits on.
6. **The user chooses between fewer steps and the same look.** With fewer steps, grays that land close together share one step and some colors move a little. With the same look, every old gray keeps its best match and the scale is longer. Show both, with the number of steps in each.
7. **A new system starts from 80, 40, 20, 10 and 5.** Use this only when there is nothing to take the steps from.

### Surfaces

8. **In the flow is soft.** A soft surface is a transparent token over whatever is under it. It never gets a solid color of its own.
9. **Above the flow is hard.** A hard surface hides what is under it. It is a solid color, or a background blur with a transparent token over it. Either way it resets the count: everything inside it starts from zero.
10. **Hard surfaces can have a few solid grays of their own**, up to about four tints. But solid grays are not bricks for a thousand elements: the elements in the flow are built from transparent tokens.
11. **A hard surface needs an edge** when it has the same color as what is under it: a stroke or a shadow.
12. **A transparent stroke on a transparent fill is a shadow, not a border.** Draw it as a shadow with spread and no blur. Make it an inner shadow when the surface is darker than the background under it, and an outer shadow when it is brighter.
13. **Nesting adds no colors.** A nested level uses the same tokens as the level above it. Point out places where soft surfaces are nested deeper than 3 or 4 levels.

### States and themes

14. **Hover is one more layer of ink at 10%.** A transparent token moves to its next step. A solid color gets the ink at 10% laid over it. No hover is a new color.
15. **Dark mode swaps the grays.** The darkest and the brightest gray trade places, so the ink turns from black to white. The scale, the names and the other masters stay the same. Change a brand or system color only if it is hard to read on the dark ground.

### Tokens

16. **No new colors.** A color that is not a master is a master at a step.
17. **A transparent token is named by its master and its step**, like `gray-darkest-20`. If the project already has a way to name them, keep it.
18. **Semantics are left as they are.** If the project has semantic tokens, keep them and point each one at a master or a transparent token. If it has none, add none.

### Care

19. **Text must stay readable.** Check the contrast of text at the deepest level of nesting, and say where it is too low.
20. **Leave non-interface colors alone**: photos, illustrations, charts and code highlighting. List them as left out.
