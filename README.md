# hardsoft

A skill that applies the hard and soft surfaces concept to your design system.

Most design systems collect dozens of grays and shades. This concept needs only a few master colors and one transparency scale, with one rule: hard surfaces are solid, soft surfaces are transparent. The article explains it: [Hard and soft surfaces: a concept of a highly flexible design system](https://plyuto.design/article/soft-and-hard-surfaces).

The skill is for designers and developers. It works inside a project with a coding agent, and in a chat with your tokens or screenshots.

## What it does

It has three actions.

| Action | What you get | What it changes |
| --- | --- | --- |
| **Report** | What your system would win, in numbers, and a preview page. | Nothing. |
| **Apply** | The report, a few questions, a plan and a preview. After your yes: the new tokens, and the report again with the real numbers. | Your tokens only. |
| **Theme** | A dark mode on top of the new tokens. Only when you ask for it. | The theme's grays. |

The report measures the four things the article promises:

- **Fewer colors.** For example 35 solid colors become 6 masters and 8 steps.
- **Predictable contrast.** No more colors that only name a level of nesting or a state.
- **Quick tuning.** One value to change all the grays.
- **Easy theme conversion.** A few values for a second theme, not dozens.

It keeps your colors, your token names and your semantic tokens. Every old name keeps working. It does not edit your components: it lists the ones with their own colors. It changes only what the colors are made from.

The report opens with two benchmarks: how many independent tokens you had and have now, and closeness, the share of your colors that still look the same. Where the app runs, it reads your real screens with [census](https://github.com/leonidstern/census) before and after, to check the result element by element.

See a full run on an invented system: [examples/messy-system](examples/messy-system).

## Install

### Claude Code

As a plugin:

```text
/plugin marketplace add plyuto-lgtm/hardsoft
/plugin install hardsoft@plyuto
```

Or copy the skill folder by hand:

```bash
git clone https://github.com/plyuto-lgtm/hardsoft.git
```

```bash
cp -r hardsoft/skills/hardsoft ~/.claude/skills/
```

### Claude.ai

Download [hardsoft.zip](https://github.com/plyuto-lgtm/hardsoft/releases/latest/download/hardsoft.zip) and upload it as a skill in Claude's settings.

### Other agents and chats

Cursor, Codex, ChatGPT and others can use it too. Ask the agent to read the skill first:

```text
Read https://raw.githubusercontent.com/plyuto-lgtm/hardsoft/main/skills/hardsoft/SKILL.md and the files it links to, then apply it to this project.
```

If the agent can't open links, give it the files from `skills/hardsoft`.

## Use

In a project, start with the report. It changes nothing:

```text
Run a hardsoft report on this project.
```

Then, if you like what you would win:

```text
Apply hardsoft.
```

In Claude Code with the plugin, the same actions are commands: `/hardsoft:report`, `/hardsoft:apply` and `/hardsoft:theme`.

In a chat, add your tokens, a screenshot or a link, and ask the same. Nothing changes until you have seen the plan and the preview and said yes.

## What is inside

- [skills/hardsoft/SKILL.md](skills/hardsoft/SKILL.md): the instructions and the three actions.
- [skills/hardsoft/approach.md](skills/hardsoft/approach.md): the concept and its 30 rules, each one strict, default or advice.
- [skills/hardsoft/scripts/hardsoft.mjs](skills/hardsoft/scripts/hardsoft.mjs): the color math. It finds the alpha of every color, builds the scales and checks text contrast. Node 18 or newer, nothing to install.
- [skills/hardsoft/templates/preview.html](skills/hardsoft/templates/preview.html): the preview page, the same for every project.
- [skills/hardsoft/templates/report.md](skills/hardsoft/templates/report.md): the shape of the report.
- [skills/hardsoft/formats.md](skills/hardsoft/formats.md): the tokens in Tailwind 4, Tailwind 3, CSS variables, Sass, JS or TS, and JSON.
- [skills/hardsoft/templates/theme.css](skills/hardsoft/templates/theme.css) and [tokens.css](skills/hardsoft/templates/tokens.css): the patterns for Tailwind 4 and plain CSS variables, with no colors: yours go in.
- [commands](commands): the three commands for Claude Code.
- [examples/messy-system](examples/messy-system): a worked example, before and after.
- [tests](tests): tests for the color math (`node --test`), and the cases to check after changing the instructions.

## Licence

[MIT](LICENSE): use it, change it and share it freely.

By [Alexander Plyuto](https://plyuto.design).
