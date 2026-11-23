# Changelog

## 2.2.0

From the first run on a real product.

- The preview is rebuilt around one proof: the same app, with fewer values. It shows how many colors had a value of their own and how many do now, the colors that stay exactly as they are, which solid colors each key color at a step replaces, and every color of the system, today next to with hardsoft.
- The screens picked in the interview are in the preview, before and after, with a slider.
- Light and dark are drawn side by side from the same tokens, so both themes show the same list. Dark is measured as the same step of the same master.
- The whole design system is read, not the part one page uses. No family is dropped: a second or third brand color keeps its key color, and what the user puts out of this is shown as untouched.
- The preview is made by the calculator (`preview`), not filled in by hand, so its numbers match the map.
- A third scale, round steps: the fewer steps moved to the nearest 5.
- The report has one row per family with its count before and after, a clash with the project's own rules goes into the decisions, and side findings get a section of their own.
- The interview asks how to see the screens running when the agent cannot open them.
- In Claude the preview is also published as an artifact, with a link.
- Semantic names that only point at another token are not counted, before or after. A semantic name with a raw value of its own still is.
- A simpler preview page: white, no cards, three numbers, one thin row per color.

## 2.1.0

- The report starts with an interview: 3 to 6 questions with options made from the project's own names, asked with the agent's question tool.
- A clearer report. The first screen says if it is worth it, what you win and what stays the same. Then the decisions for you. The tables are below a line.
- The preview page has a top strip with the same numbers.

## 2.0.0

The rules have new numbers, so anything that points at a rule by its number must be checked.

- Three actions: report (changes nothing, shows what the system would win), apply and theme. In Claude Code they are also commands.
- The report measures the four goals of the article, before and after: fewer colors, predictable contrast, quick tuning, easy theme conversion.
- 30 rules, each with a level: strict, default or advice.
- New rules: tinted grays tint the ink (4), a ramp is one master (5), what covers something else is hard (12), a colored surface is its own ground (13), other states keep their design (19), a theme only when asked (21), a shadow is a gray at a step (22), old names keep working (26), tokens only (27), nothing changes before a yes (30).
- Changed: the skill no longer edits components. It lists the ones with their own colors. It no longer removes tokens. It no longer recommends one of the two scales.
- The report opens with two benchmarks: independent tokens before and after, and closeness, the share of colors that still look the same.
- Hard surfaces can keep several solid grays of their own (14). Three grays is the goal for the scale, not a limit.
- A transparent stroke is transferred as a hairline shadow that can be added to any other shadow (16).
- Real screens can be read with census before and after, and each changed element measured with `shift`.
- Text contrast is measured against WCAG AA, and each weak place gets the nearest stronger step as an offer.
- A calculator for the color math, with tests.
- One fixed preview page, and a fixed shape for the report.
- More token formats: Tailwind 3, Sass, JS or TS, JSON tokens.
- A worked example on an invented system.

## 1.2.0

Rules sharpened after testing the skill on two projects.
