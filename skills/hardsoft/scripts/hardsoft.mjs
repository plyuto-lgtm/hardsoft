#!/usr/bin/env node
// hardsoft: the color math behind the skill. No dependencies, Node 18 or newer.
//
//   node hardsoft.mjs alpha <color> --master <color> [--on <background>]
//   node hardsoft.mjs contrast --text <layer> --on <layer> [<layer> ...] [--steps 40,60,80]
//   node hardsoft.mjs map <system.json> [--json] [--fit 2] [--tolerance 3] [--steps 5,10,20,40,60,80]
//
// A color is hex, rgb() or hsl(). A layer is a color, or a color at an alpha: "#111@60".
// "Shift" is how far a color moves, as a distance in OKLab times 100. Under 2 the eye barely sees it.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const FIT = 2; // a color fits a master when its shift is at most this
export const TOLERANCE = 3; // how far a color may move in the "fewer steps" scale

// ---------- colors ----------

const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

/** Parse a CSS color into { r, g, b, a }, with r, g and b from 0 to 255 and a from 0 to 1. */
export function parse(input) {
	const s = String(input).trim().toLowerCase();
	let m = s.match(/^#([0-9a-f]{3,8})$/);
	if (m) {
		let h = m[1];
		if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
		if (h.length !== 6 && h.length !== 8) throw new Error(`Not a color: ${input}`);
		const n = (i) => parseInt(h.slice(i, i + 2), 16);
		return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
	}
	m = s.match(/^(rgba?|hsla?)\((.+)\)$/);
	if (m) {
		const parts = m[2].split(/[\s,/]+/).filter(Boolean);
		const num = (p, scale = 1) => (p.endsWith('%') ? (parseFloat(p) / 100) * scale : parseFloat(p));
		const a = parts[3] === undefined ? 1 : clamp(num(parts[3], 1));
		if (m[1].startsWith('rgb')) return { r: num(parts[0], 255), g: num(parts[1], 255), b: num(parts[2], 255), a };
		const h = ((parseFloat(parts[0]) % 360) + 360) % 360;
		const sat = clamp(parseFloat(parts[1]) / 100);
		const l = clamp(parseFloat(parts[2]) / 100);
		const f = (k) => {
			const t = (k + h / 30) % 12;
			return 255 * (l - sat * Math.min(l, 1 - l) * Math.max(-1, Math.min(t - 3, 9 - t, 1)));
		};
		return { r: f(0), g: f(8), b: f(4), a };
	}
	if (s === 'white') return { r: 255, g: 255, b: 255, a: 1 };
	if (s === 'black') return { r: 0, g: 0, b: 0, a: 1 };
	throw new Error(`Not a color: ${input}`);
}

export function hex({ r, g, b }) {
	return '#' + [r, g, b].map((c) => Math.round(clamp(c, 0, 255)).toString(16).padStart(2, '0')).join('');
}

/** Lay a color over a solid background, the way a browser does it. */
export function over(top, bg, alpha = top.a ?? 1) {
	return { r: bg.r + (top.r - bg.r) * alpha, g: bg.g + (top.g - bg.g) * alpha, b: bg.b + (top.b - bg.b) * alpha, a: 1 };
}

const linear = (c) => {
	const v = c / 255;
	return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

function oklab({ r, g, b }) {
	const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
}

/** How far apart two solid colors look. Under 2 the eye barely sees it. */
export function shift(a, b) {
	const [x, y] = [oklab(a), oklab(b)];
	return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

export function luminance({ r, g, b }) {
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG contrast ratio of two solid colors. */
export function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

// ---------- the fit ----------

/**
 * The alpha of a master that comes closest to a color, over the background the color sits on.
 * One alpha for all three channels, by least squares: a channel where the master and the
 * background are almost the same counts for almost nothing.
 */
export function fitAlpha(color, master, background) {
	const target = color.a < 1 ? over(color, background) : color;
	let top = 0;
	let bottom = 0;
	for (const ch of ['r', 'g', 'b']) {
		const span = background[ch] - master[ch];
		top += (background[ch] - target[ch]) * span;
		bottom += span * span;
	}
	const alpha = bottom === 0 ? 0 : clamp(top / bottom);
	const result = over(master, background, alpha);
	return { alpha, result, shift: shift(target, result) };
}

/** The shift of a color when its master sits at a given step, in percent. */
function shiftAt(color, master, background, step) {
	const target = color.a < 1 ? over(color, background) : color;
	return shift(target, over(master, background, step / 100));
}

const round = (n, digits = 1) => Number(n.toFixed(digits));

// ---------- layers and contrast ----------

/** "#111@60" is the color #111 at 60%. */
export function parseLayer(text) {
	const [color, alpha] = String(text).split('@');
	const c = parse(color);
	return alpha === undefined ? c : { ...c, a: clamp(parseFloat(alpha) / 100) };
}

/** Lay layers over each other, the first one at the bottom. The first must be solid. */
export function stack(layers) {
	const [first, ...rest] = layers;
	if (first.a < 1) throw new Error('The first layer is the ground, so it must be solid.');
	return rest.reduce((bg, layer) => over(layer, bg), first);
}

export function contrastReport(text, layers, steps = []) {
	const bg = stack(layers);
	const ratio = contrast(over(text, bg), bg);
	const report = { background: hex(bg), ratio: round(ratio, 2), normalText: ratio >= 4.5, largeText: ratio >= 3 };
	if (!report.normalText && steps.length) {
		const now = text.a * 100;
		const stronger = [...new Set([...steps, 100])].sort((a, b) => a - b).filter((s) => s > now);
		report.strongerStep = stronger.find((s) => contrast(over(text, bg, s / 100), bg) >= 4.5) ?? null;
	}
	return report;
}

// ---------- the map ----------

/**
 * Put every color of a system on a master and a step.
 * system: { ground, ink, masters: { name: color }, colors: [{ name, value, on?, master? }] }
 * "on" is the background a color sits on: a color, the name of another color in the list, or
 * nothing for the ground. "master" forces a master, for a color you already know the family of.
 * steps: a scale of your own to score, like [5, 10, 20, 40, 60, 80].
 */
export function map(system, { fit = FIT, tolerance = TOLERANCE, steps = [] } = {}) {
	const ground = parse(system.ground);
	const names = Object.keys(system.masters);
	const ink = system.ink ?? names[0];
	if (!system.masters[ink]) throw new Error(`The ink "${ink}" is not one of the masters.`);
	const order = [ink, ...names.filter((n) => n !== ink)];
	const masters = Object.fromEntries(order.map((n) => [n, parse(system.masters[n])]));
	const byName = Object.fromEntries(system.colors.map((c) => [c.name, c]));

	const solid = (entry, seen = []) => {
		if (seen.includes(entry.name)) throw new Error(`"${entry.name}" sits on itself.`);
		const bg = background(entry, [...seen, entry.name]);
		const c = parse(entry.value);
		return c.a < 1 ? over(c, bg) : c;
	};
	const background = (entry, seen = []) => {
		if (!entry.on) return ground;
		return byName[entry.on] ? solid(byName[entry.on], seen) : parse(entry.on);
	};

	const rows = system.colors.map((entry) => {
		const bg = background(entry);
		const color = parse(entry.value);
		const target = color.a < 1 ? over(color, bg) : color;
		const exact = order.find((n) => shift(target, masters[n]) < 0.5);
		if (exact && !entry.master) {
			return { name: entry.name, value: entry.value, on: hex(bg), master: exact, alpha: 100, step: 100, shift: 0, fits: true, isMaster: true };
		}
		const tries = (entry.master ? [entry.master] : order).map((n) => ({ master: n, ...fitAlpha(color, masters[n], bg) }));
		// The closest master wins. When the ink is about as close, it is the ink: a gray is the ink at a step.
		const closest = tries.reduce((a, b) => (b.shift < a.shift ? b : a));
		const best = tries[0].shift <= fit && tries[0].shift - closest.shift < 0.5 ? tries[0] : closest;
		const step = Math.max(1, Math.round(best.alpha * 100));
		return {
			name: entry.name,
			value: entry.value,
			on: hex(bg),
			master: best.master,
			alpha: round(best.alpha * 100),
			step,
			shift: round(shiftAt(color, masters[best.master], bg, step)),
			fits: best.shift <= fit,
			_exact: best.shift,
			_color: color,
			_bg: bg,
		};
	});

	const fitting = rows.filter((r) => r.fits && !r.isMaster);
	const sameLook = [...new Set(fitting.map((r) => r.step))].sort((a, b) => a - b);

	// Fewer steps: drop the step that costs the least, while no color moves further than the tolerance.
	const cost = (steps) => {
		let worst = 0;
		const assigned = {};
		for (const r of fitting) {
			let bestStep = steps[0];
			let bestShift = Infinity;
			for (const s of steps) {
				const d = shiftAt(r._color, masters[r.master], r._bg, s);
				if (d < bestShift) [bestStep, bestShift] = [s, d];
			}
			assigned[r.name] = { step: bestStep, shift: round(bestShift) };
			worst = Math.max(worst, bestShift);
		}
		return { worst, assigned };
	};
	let fewer = [...sameLook];
	while (fewer.length > 1) {
		const options = fewer.map((s) => fewer.filter((x) => x !== s)).map((steps) => ({ steps, ...cost(steps) }));
		const cheapest = options.reduce((a, b) => (b.worst < a.worst ? b : a));
		if (cheapest.worst > tolerance) break;
		fewer = cheapest.steps;
	}
	const fewerCost = fewer.length ? cost(fewer) : { worst: 0, assigned: {} };
	const given = steps.length ? [...steps].sort((a, b) => a - b) : null;
	const givenCost = given ? cost(given) : null;
	const tint = suggestTint(rows.filter((r) => r.master === ink && !r.isMaster), masters[ink], ground, fit);
	for (const r of rows) {
		if (fewerCost.assigned[r.name]) r.fewer = fewerCost.assigned[r.name];
		if (givenCost?.assigned[r.name]) r.given = givenCost.assigned[r.name];
		delete r._color;
		delete r._bg;
		delete r._exact;
	}

	const misfits = rows.filter((r) => !r.fits);
	// The ground is a color of the system too, and a master: the brightest gray.
	const distinct = new Set([hex(ground), ...system.colors.map((c) => hex(solid(c)))]).size;
	const usedMasters = new Set([hex(ground), ...rows.filter((r) => r.fits).map((r) => hex(masters[r.master]))]);

	return {
		rows,
		scales: {
			sameLook: { steps: sameLook, count: sameLook.length, maxShift: round(Math.max(0, ...fitting.map((r) => r.shift))) },
			fewer: { steps: fewer, count: fewer.length, maxShift: round(fewerCost.worst) },
			...(given ? { given: { steps: given, count: given.length, maxShift: round(givenCost.worst) } } : {}),
		},
		misfits: misfits.map((r) => r.name),
		tint,
		wins: { colorsBefore: distinct, masters: usedMasters.size, stepsSameLook: sameLook.length, stepsFewer: fewer.length, leftOver: misfits.length },
	};
}

/**
 * Rule 4. When several grays share a tint the ink does not have, find the ink that fits them:
 * as dark as the ink now, tinted toward them. Says what it costs the grays that have no tint.
 */
function suggestTint(grays, ink, ground, fit) {
	const solid = grays.filter((g) => g._color.a === 1);
	const tinted = solid.filter((g) => g._exact > 0.6 && chroma(g._color) > 0.004 && chroma(g._color) < 0.06);
	if (tinted.length < 3) return null;

	let next = { ...ink };
	const target = luminance(ink);
	for (let i = 0; i < 20; i++) {
		// For this ink, the best alpha of every tinted gray. For these alphas, the best ink.
		const alphas = tinted.map((g) => fitAlpha(g._color, next, g._bg).alpha);
		const guess = { a: 1 };
		for (const ch of ['r', 'g', 'b']) {
			let top = 0;
			let bottom = 0;
			tinted.forEach((g, k) => {
				top += alphas[k] * (g._color[ch] - g._bg[ch] * (1 - alphas[k]));
				bottom += alphas[k] ** 2;
			});
			guess[ch] = bottom ? clamp(top / bottom, 0, 255) : next[ch];
		}
		next = keepDarkness(guess, ground, target);
	}
	const after = (g) => fitAlpha(g._color, next, g._bg).shift;
	const fits = tinted.filter((g) => after(g) <= fit);
	const others = solid.filter((g) => !tinted.includes(g));
	if (fits.length < 3 || shift(next, ink) < 0.5) return null;
	return {
		ink: hex(next),
		from: hex(ink),
		tinted: tinted.map((g) => g.name),
		fit: fits.length,
		shiftBefore: round(Math.max(...tinted.map((g) => g._exact))),
		shiftAfter: round(Math.max(...tinted.map(after))),
		otherGrays: others.length,
		otherGraysShift: round(Math.max(0, ...others.map(after))),
	};
}

function chroma(c) {
	const [, a, b] = oklab(c);
	return Math.hypot(a, b);
}

/** Slide a color along the line from the ground through it, until it is as dark as the target. */
function keepDarkness(color, ground, target) {
	const at = (t) => ({ r: clamp(ground.r + (color.r - ground.r) * t, 0, 255), g: clamp(ground.g + (color.g - ground.g) * t, 0, 255), b: clamp(ground.b + (color.b - ground.b) * t, 0, 255), a: 1 });
	const darker = luminance(color) < luminance(ground);
	let [lo, hi] = [0, 8];
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		const tooFar = darker ? luminance(at(mid)) < target : luminance(at(mid)) > target;
		if (tooFar) hi = mid;
		else lo = mid;
	}
	return at((lo + hi) / 2);
}

// ---------- the command line ----------

function table(result) {
	const own = result.scales.given;
	const lines = [`| Token | Value | On | Master | Same look | Shift | Fewer steps | Shift |${own ? ' Your scale | Shift |' : ''}`, `| --- | --- | --- | --- | --- | --- | --- | --- |${own ? ' --- | --- |' : ''}`];
	for (const r of result.rows) {
		if (r.isMaster) lines.push(`| ${r.name} | ${r.value} | ${r.on} | ${r.master} | master | 0 | master | 0 |${own ? ' master | 0 |' : ''}`);
		else if (!r.fits) lines.push(`| ${r.name} | ${r.value} | ${r.on} | does not fit | - | ${r.shift} | - | - |${own ? ' - | - |' : ''}`);
		else lines.push(`| ${r.name} | ${r.value} | ${r.on} | ${r.master} | ${r.step}% | ${r.shift} | ${r.fewer.step}% | ${r.fewer.shift} |${own ? ` ${r.given.step}% | ${r.given.shift} |` : ''}`);
	}
	const { sameLook, fewer } = result.scales;
	const w = result.wins;
	lines.push(
		'',
		`Same look: ${sameLook.count} steps (${sameLook.steps.join(', ')}), biggest shift ${sameLook.maxShift}.`,
		`Fewer steps: ${fewer.count} steps (${fewer.steps.join(', ')}), biggest shift ${fewer.maxShift}.`,
		...(own ? [`Your scale: ${own.count} steps (${own.steps.join(', ')}), biggest shift ${own.maxShift}.`] : []),
		`Colors: ${w.colorsBefore} before. After: ${w.masters} masters and ${w.stepsSameLook} steps (same look) or ${w.stepsFewer} steps (fewer).`,
	);
	if (result.misfits.length) lines.push(`Does not fit: ${result.misfits.join(', ')}.`);
	if (result.tint) {
		const t = result.tint;
		lines.push(`Tint: ${t.tinted.length} grays share a tint (${t.tinted.join(', ')}). With the ink at ${t.ink} (now ${t.from}) their biggest shift goes from ${t.shiftBefore} to ${t.shiftAfter}. The ${t.otherGrays} grays with no tint then shift up to ${t.otherGraysShift}.`);
	}
	return lines.join('\n');
}

function args(argv) {
	const out = { _: [] };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith('--')) out._.push(a);
		else if (a === '--json') out.json = true;
		else {
			const key = a.slice(2);
			out[key] = [];
			while (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) out[key].push(argv[++i]);
		}
	}
	return out;
}

function main(argv) {
	const [command, ...rest] = argv;
	const a = args(rest);
	const one = (key, fallback) => a[key]?.[0] ?? fallback;
	if (command === 'alpha') {
		if (!a._[0] || !one('master')) throw new Error('Use: alpha <color> --master <color> [--on <background>]');
		const r = fitAlpha(parse(a._[0]), parse(one('master')), parse(one('on', '#ffffff')));
		const step = Math.max(1, Math.round(r.alpha * 100));
		const out = { alpha: round(r.alpha * 100), step, result: hex(r.result), shift: round(r.shift), fits: r.shift <= FIT };
		console.log(a.json ? JSON.stringify(out, null, 2) : `${out.step}% (exact ${out.alpha}%), gives ${out.result}, shift ${out.shift}${out.fits ? '' : ': does not fit this master'}`);
	} else if (command === 'contrast') {
		if (!one('text') || !a.on?.length) throw new Error('Use: contrast --text <layer> --on <ground> [<layer> ...] [--steps 40,60,80]');
		const steps = one('steps', '').split(',').filter(Boolean).map(Number);
		const out = contrastReport(parseLayer(one('text')), a.on.map(parseLayer), steps);
		const verdict = out.normalText ? 'passes AA' : out.largeText ? 'passes AA for large text only' : 'fails AA';
		const offer = out.strongerStep ? `, the nearest step that passes is ${out.strongerStep}%` : out.strongerStep === null ? ', no step passes' : '';
		console.log(a.json ? JSON.stringify(out, null, 2) : `${out.ratio} to 1 on ${out.background}: ${verdict}${offer}`);
	} else if (command === 'map') {
		if (!a._[0]) throw new Error('Use: map <system.json> [--json] [--fit 2] [--tolerance 3] [--steps 5,10,20]');
		const result = map(JSON.parse(readFileSync(a._[0], 'utf8')), { fit: Number(one('fit', FIT)), tolerance: Number(one('tolerance', TOLERANCE)), steps: one('steps', '').split(',').filter(Boolean).map(Number) });
		console.log(a.json ? JSON.stringify(result, null, 2) : table(result));
	} else {
		console.log('hardsoft: alpha, contrast or map. See the top of this file.');
		process.exitCode = command ? 1 : 0;
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		main(process.argv.slice(2));
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
