# hardsoft

A skill that applies the hard and soft surfaces concept to your design system.

Most design systems collect dozens of grays and shades. This concept needs only a few master colors and one transparency scale, with one rule: hard surfaces are solid, soft surfaces are transparent. The article explains it: [Hard and soft surfaces: a concept of a highly flexible design system](https://plyuto.design/article/soft-and-hard-surfaces).

The skill is for designers and developers. It works inside a project with a coding agent, and in a chat with your tokens or screenshots.

## What it does

1. Finds your current system: tokens, theme, components.
2. Puts every color on a master and a step of transparency, and lists what does not fit.
3. Asks you 3 or 4 questions, once.
4. Shows a plan and a preview, and waits.
5. Applies it after you say yes, in your project's own token format.

It keeps your colors, your token names and your semantic tokens, if you have them. It changes only what the colors are made from.

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

In a project, ask:

```text
Apply hardsoft to this project.
```

In a chat, add your tokens, a screenshot or a link, and ask the same. Nothing changes until you have seen the plan and the preview and said yes.

## What is inside

- [skills/hardsoft/SKILL.md](skills/hardsoft/SKILL.md): the instructions.
- [skills/hardsoft/approach.md](skills/hardsoft/approach.md): the concept and its 20 rules.
- [skills/hardsoft/templates/theme.css](skills/hardsoft/templates/theme.css): the tokens for Tailwind 4.
- [skills/hardsoft/templates/tokens.css](skills/hardsoft/templates/tokens.css): the tokens as plain CSS variables.

## Licence

[MIT](LICENSE): use it, change it and share it freely.

By [Alexander Plyuto](https://plyuto.design).
