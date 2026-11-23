# Token formats

The same three layers in every format: the masters, each master at the steps it uses, and the old names pointed at them. Write the format the project already has. Where it already writes an alpha in some way, write it that way.

Two things hold everywhere:

- **Keep the link to the master.** A transparent token is written from its master, not as a second color, so a change to the master changes everything. Where a format can't do that, write the worked-out value, record the master and the step beside it, and say in the report that these tokens must be written again when a master changes.
- **Old names keep working** (rule 26). An old token becomes an alias of a master or a transparent token.

`<...>` is a value to take from the system. The names are the default ones (rule 24).

## Tailwind 4

[templates/theme.css](templates/theme.css). Use this one when a Tailwind project has no color tokens yet, and in a chat.

## CSS variables

[templates/tokens.css](templates/tokens.css).

## Tailwind 3

The masters are CSS variables, and the config points at them. The themes change the variables, not the config.

```css
:root {
	--gray-darkest: <the system's darkest gray>;
	--gray-brightest: <the system's brightest gray>;
}
```

```js
// tailwind.config.js
const alpha = (name, step) => `color-mix(in srgb, var(--${name}) ${step}%, transparent)`;

module.exports = {
	theme: {
		extend: {
			colors: {
				'gray-darkest': { DEFAULT: 'var(--gray-darkest)', <step>: alpha('gray-darkest', <step>) },
				'gray-brightest': 'var(--gray-brightest)',
				'<old name>': alpha('gray-darkest', <step>), // an old name, kept (rule 26)
			},
		},
	},
};
```

If the project writes its colors as channels, like `--gray-darkest: 17 17 17` with `rgb(var(--gray-darkest) / <alpha-value>)`, keep that: a transparent token is `rgb(var(--gray-darkest) / 0.05)`.

## Sass

```scss
$gray-darkest: <the system's darkest gray>;
$gray-brightest: <the system's brightest gray>;

$gray-darkest-<step>: rgba($gray-darkest, <step as 0 to 1>);
$<old-name>: $gray-darkest-<step>; // an old name, kept (rule 26)

$brand-primary-hover: mix($gray-darkest, $brand-primary, 10%); // rule 18
```

Sass works its colors out when the project builds, so a Sass variable can't change with the theme. If the project has themes, or someone asks for one, the masters must be CSS variables, with the Sass names pointing at them: `$gray-darkest: var(--gray-darkest)`, and the transparent tokens written with `color-mix`. Say so in the plan.

## JS or TS

```ts
const masters = {
	grayDarkest: '<the system\'s darkest gray>',
	grayBrightest: '<the system\'s brightest gray>',
} as const;

const alpha = (color: string, step: number) => `color-mix(in srgb, ${color} ${step}%, transparent)`;

export const colors = {
	...masters,
	grayDarkest<step>: alpha(masters.grayDarkest, <step>),
	<oldName>: alpha(masters.grayDarkest, <step>), // an old name, kept (rule 26)
};
```

Where `color-mix` does not work, like React Native or an old browser list, write a helper that turns the master and the step into `rgba()`, so the link to the master stays in the code.

## JSON tokens

Token files in JSON come in a few dialects: the Design Tokens format (`$value`, `$type`), Style Dictionary, Tokens Studio. Read the files and the build first, and write what they already use.

A master is a plain color. An old name is an alias:

```json
{
	"gray-darkest": { "$type": "color", "$value": "<the system's darkest gray>" },
	"<old name>": { "$type": "color", "$value": "{gray-darkest-<step>}" }
}
```

A transparent token depends on what the tool can do:

- **The tool can change the alpha of a reference.** Tokens Studio can: `"$value": "rgba({gray-darkest}, <step as 0 to 1>)"`. A Style Dictionary build may have a transform for it. Use that, so the link to the master stays.
- **It can't.** Write the worked-out value with its alpha, and record the master and the step with it:

```json
{
	"gray-darkest-<step>": {
		"$type": "color",
		"$value": "<the master with the alpha, in the notation the file uses>",
		"$description": "gray-darkest at <step>%",
		"$extensions": { "hardsoft": { "master": "gray-darkest", "step": <step> } }
	}
}
```

Themes are usually separate files or sets, one per theme. Only the ink and the ground differ between them (rule 20).

The token file is often not the only place: a Figma file may be its source, or its copy. The skill changes the file in the project. Say in the report that the design source needs the same change, and by whom.
