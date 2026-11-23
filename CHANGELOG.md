# Changelog

## 2.0.0

The rules have new numbers, so anything that points at a rule by its number must be checked.

- Three actions: report (changes nothing, shows what the system would win), apply and theme. In Claude Code they are also commands.
- The report measures the four goals of the article, before and after: fewer colors, predictable contrast, quick tuning, easy theme conversion.
- 30 rules, each with a level: strict, default or advice.
- New rules: tinted grays tint the ink (4), a ramp is one master (5), what covers something else is hard (12), a colored surface is its own ground (13), other states keep their design (19), a theme only when asked (21), a shadow is a gray at a step (22), old names keep working (26), tokens only (27), nothing changes before a yes (30).
- Changed: the skill no longer edits components. It lists the ones with their own colors. It no longer removes tokens. It no longer recommends one of the two scales.
- Text contrast is measured against WCAG AA, and each weak place gets the nearest stronger step as an offer.
- A calculator for the color math, with tests.
- One fixed preview page, and a fixed shape for the report.
- More token formats: Tailwind 3, Sass, JS or TS, JSON tokens.
- A worked example on an invented system.

## 1.2.0

Rules sharpened after testing the skill on two projects.
