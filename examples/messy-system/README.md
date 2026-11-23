# Example: a messy system

An invented system, small enough to read in one go, with the usual problems: a new gray for every level and state, a second family of grays from an older redesign, and a brand ramp.

1. [tokens.before.css](tokens.before.css): 35 solid colors.
2. [system.json](system.json): what the skill wrote down from them, for the calculator.
3. [hardsoft-report.md](hardsoft-report.md): the report, with the user's answers and what was won.
4. [preview.html](preview.html): the preview page. Open it in a browser.
5. [tokens.after.css](tokens.after.css): 6 masters and 8 steps. Every old name still works.

Run the numbers yourself:

```bash
node skills/hardsoft/scripts/hardsoft.mjs map examples/messy-system/system.json --steps 5,10,20,30,40,60,70,80
```
