# Hard and soft surfaces: the concept and its rules

This is the concept from the article [Hard and soft surfaces: a concept of a highly flexible design system](https://plyuto.design/article/soft-and-hard-surfaces) by Alexander Plyuto, extended into 30 rules you can apply to a real system.

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

Every rule has a level. The level says how far it can bend.

- **Strict.** Never breaks. Only the project's own rules can override it, and the plan names the clash.
- **Default.** Follow it, unless the system gives a reason not to. Write the reason in the plan.
- **Advice.** A starting point. Use it when the system has no answer of its own.

### Masters

1. **Few masters.** `Default` The usual set is three grays (darkest, medium, brightest), two brand colors (primary, secondary) and three system colors (negative, positive, attention). They are the system's own colors. Fewer is fine. More needs a reason. Three grays is the goal for what the transparent scale is built from, not a limit on solid grays: hard surfaces may add a few of their own (rule 14).
2. **The darkest gray is the ink.** `Strict` Text and almost every transparent layer are made from it. The brightest gray is the ground: the global background. The ink is the system's own darkest color, which is usually very dark but not black, and often has a slight tint. Never put `#000` in its place. The same holds for the ground of a dark theme: it is very dark, not black. When some see-through tokens are made of pure black while the text is a near-black, the system has two inks: say so, and offer to move them to the one ink.
3. **The medium gray is for softer toning.** `Advice` For example the muting overlay under a modal, or a transparent fill used together with a background blur. It is rare, but some systems need it.
4. **Tinted grays tint the ink.** `Default` When several grays share a tint the ink does not have, like slightly blue grays with a pure black ink, they are not the ink at any step. Offer to tint the ink itself so they all fit, show the new ink in the preview, and change it only after a yes. One odd gray is not a reason to tint: keep it, list it and ask (rule 23).
5. **A ramp is one master.** `Default` When a brand or system color comes as a ramp of shades, like blue 50 to 900, the master is the shade the interface uses as the color itself. The lighter tints are the master at a step. A shade darker than the master can't be made with alpha: if the interface really uses it, offer it as a second master, and add it only after a yes. Shades nobody uses are listed as removable (rule 26).

### The scale

6. **One alpha scale** for all masters. `Strict` Each master uses only the steps it needs.
7. **The steps come from the system.** `Default` Use the alphas it already has. Where it has solid grays, convert each one to the closest alpha of the ink over the background it sits on.
8. **The user chooses between fewer steps and the same look.** `Strict` With fewer steps, grays that land close together share one step and some colors move a little. With the same look, every old gray keeps its best match and the scale is longer. Round steps are the fewer steps moved to the nearest 5, which are easier to name: 5, 10, 20 instead of 4, 9, 21. Show all three, with the number of steps and the biggest color shift in each. Don't recommend one.
9. **A new system starts from 80, 40, 20, 10 and 5.** `Advice` Use this only when there is nothing to take the steps from.

### Surfaces

10. **In the flow is soft.** `Strict` A soft surface is a transparent token over whatever is under it. It never gets a solid color of its own. Most soft surfaces are the ink at a step, so they are a bit darker than what is under them. An element that must be lighter than what is under it, like a light button on a gray card, is the brightest gray at a step.
11. **Above the flow is hard.** `Strict` A hard surface hides what is under it. It is a solid color, or a background blur with a transparent token over it. Either way it resets the count: everything inside it starts from zero.
12. **What covers something else is hard.** `Default` An element in the flow turns hard when other content shows through it: a sticky header or a sticky table column that content scrolls under, a bottom bar over a list, stacked avatars, a badge on the corner of a card. A sidebar or a header that only sits beside the content, with nothing passing under it, is soft.
13. **A colored surface is its own ground.** `Default` On a brand banner or a status block the same rules work: an element on it is the ink or the brightest gray at a step, whichever reads better. On a photo, a video or a gradient nothing transparent is safe to read, so an element there is hard: solid, or a background blur with a transparent token over it.
14. **Hard surfaces can have solid grays of their own.** `Default` A menu, a modal, a raised panel or a dark tooltip may need a gray that is not the ground, and a system can have several. They stay solid, and they keep their names. They are not masters: the transparent scale is still built from the three grays only, and everything inside such a surface is the ink or the brightest gray at a step. Solid grays are not bricks for a thousand elements: the elements in the flow are built from transparent tokens.
15. **A hard surface needs an edge** when it has the same color as what is under it: a stroke or a shadow. `Default`
16. **A transparent stroke is a hairline shadow, not a border.** `Default` A border sits on the edge of a shape, half over the fill and half over the surface behind it, or in CSS fully over the fill. So a transparent stroke on a transparent fill is laid over two things at once: it reads darker than its token, and uneven. Draw it as a hairline: a shadow with spread and no blur. A hairline can be added to any other shadow of the element, as one more layer in the list. Make it an inner shadow when the surface is darker than the background under it, and an outer shadow when it is brighter. Decide it in the light theme and keep it in dark, so an element's size never changes between themes.
    - Transfer old strokes with care. Measure a stroke over what it really lies on, the fill or the surface behind, not over the page.
    - The components are not edited (rule 27): give the system a hairline token, and list the borders that should move to it.
17. **Nesting adds no colors.** `Strict` A nested level uses the same tokens as the level above it. Semantic tokens that named each level, like `surface-1` and `surface-2`, end up with the same value: say so, and list them as mergeable (rule 26). Point out places where soft surfaces are nested deeper than 3 or 4 levels.

### States and themes

18. **Hover is one more layer of ink.** `Default` A transparent token moves to its next step, or gets one more layer of ink: either works, pick what fits the system. A solid color gets a layer of ink laid over it. The layer is 10%, unless the system already uses another step for its hovers. A hover moves toward the ink, so it is darker in light mode and lighter in dark mode. No hover is a new color.
19. **Other states keep their design.** `Default` Pressed, selected, disabled and focus stay the way the system already shows them. Only their colors are rebuilt from masters and steps. Don't invent a state the system doesn't have, and don't restyle one it has. No state is a new color.
20. **Dark mode changes only the grays.** `Default` The ink turns from dark to light, and the ground from light to dark. The dark values can be the light pair swapped, or the project's own dark pair. The scale, the names and the other masters stay the same. Change a brand or system color only if it is hard to read on the dark ground.
    - Something that must look the same in both themes, like white text on a brand button, a dark tooltip, the dim layer under a modal or a shadow, is a gray at a step through a semantic token: 100% for text and solid fills, lower for an overlay or a shadow. In dark mode the semantic token points at the other gray, so the look stays. A dark tooltip may then match the dark ground: give it an edge (rule 15), or make it the medium gray (rule 3).
    - A step that reads too weak or too strong on the dark ground, like a brand tint or secondary text, may take another step in dark mode, through its semantic token. The scale stays the same.
    - Check the hovers in dark mode too: a solid color's hover gets lighter there, so text on it loses contrast (rule 28).
21. **A theme only when asked.** `Strict` Don't add or propose a dark mode, or any other theme, that nobody asked for. When someone asks for one, start from the light pair swapped, then tune the steps that read too weak or too strong (rule 20).
22. **A shadow is a gray at a step.** `Default` Only the color of a shadow changes: its offset, blur and spread stay. It goes through a semantic token, so it stays dark in a dark theme (rule 20).

### Tokens

23. **No new colors.** `Strict` A color that is not a master is a master at a step. A color that fits no master at any step is not moved silently: keep it, list it and ask.
24. **A transparent token is named by its master and its step**, like `gray-darkest-20`. `Default` If the project already has a way to name them, keep it.
25. **Semantics are left as they are.** `Strict` If the project has semantic tokens, keep them and point each one at a master or a transparent token. If it has none, add only the few that rules 20 and 22 need.
26. **Old names keep working.** `Strict` Every token name that existed before still exists after, pointed at a master or a transparent token. Nothing is deleted. Duplicates, unused tokens and unused ramp shades go into the report as removable, for the team to remove when they choose.
27. **Tokens only.** `Strict` Change the token layer and nothing else. A component with a color written directly in it, like a hex value or a one-off gray, is not edited: list it in the report with the token it should use.

### Care

28. **Text must stay readable.** `Default` Measure text against WCAG AA: 4.5 to 1 for normal text, 3 to 1 for large text. Check it at the deepest level of nesting and in every theme. List every place that is too low with its number, whether it was low before or became low, and offer the nearest stronger step for each. The user says yes or no to each in the plan.
29. **Leave non-interface colors alone**: gradients, photos, illustrations, charts, code highlighting, decorative drawings inside the interface, and the colors of tools around the product, like Storybook's own frame. `Strict` They are untouched, not removed: count them and show them, unchanged. A brand or status family is never one of these unless the user says so.
30. **Nothing changes before a yes.** `Strict` The plan and the preview come first. The preview carries its own copy of the tokens. The project's tokens change only after the user has seen both and said yes.
