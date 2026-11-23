// Run with: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parse, hex, over, shift, contrast, fitAlpha, parseLayer, stack, contrastReport, map } from '../skills/hardsoft/scripts/hardsoft.mjs';

const example = JSON.parse(readFileSync(new URL('../examples/messy-system/system.json', import.meta.url), 'utf8'));

test('reads hex, rgb and hsl', () => {
	assert.deepEqual(parse('#fff'), { r: 255, g: 255, b: 255, a: 1 });
	assert.equal(parse('#11111180').a.toFixed(2), '0.50');
	assert.equal(parse('rgba(0, 0, 0, 0.4)').a, 0.4);
	assert.equal(parse('rgb(17 17 17 / 12%)').a, 0.12);
	assert.equal(hex(parse('hsl(0 0% 100%)')), '#ffffff');
	assert.throws(() => parse('tomato-ish'));
});

test('the example from the skill: #f2f2f2 on white is black at 5%', () => {
	const r = fitAlpha(parse('#f2f2f2'), parse('#000'), parse('#fff'));
	assert.equal(Math.round(r.alpha * 100), 5);
	assert.ok(r.shift < 0.5);
});

test('a color is measured over the background it sits on', () => {
	const card = parse('#f3f3f3');
	const nested = fitAlpha(parse('#e8e8e8'), parse('#111'), card);
	assert.equal(Math.round(nested.alpha * 100), 5);
	const overPage = fitAlpha(parse('#e8e8e8'), parse('#111'), parse('#fff'));
	assert.equal(Math.round(overPage.alpha * 100), 10);
});

test('a lighter element is the brightest gray at a step', () => {
	const r = fitAlpha(parse('#f9f9f9'), parse('#fff'), parse('#f3f3f3'));
	assert.equal(Math.round(r.alpha * 100), 50);
	assert.ok(r.shift < 0.5);
});

test('a tinted gray does not fit a pure ink', () => {
	assert.ok(fitAlpha(parse('#6f7f96'), parse('#111'), parse('#fff')).shift > 2);
});

test('a shade darker than its master does not fit it', () => {
	assert.ok(fitAlpha(parse('#1e3a8a'), parse('#2563eb'), parse('#fff')).shift > 2);
});

test('layers stack from the ground up', () => {
	const bg = stack(['#fff', '#111@5', '#111@5'].map(parseLayer));
	assert.equal(hex(bg), hex(over(parse('#111'), over(parse('#111'), parse('#fff'), 0.05), 0.05)));
	assert.throws(() => stack([parseLayer('#111@5')]));
});

test('contrast follows WCAG', () => {
	assert.equal(Math.round(contrast(parse('#000'), parse('#fff'))), 21);
	const weak = contrastReport(parseLayer('#111@40'), [parseLayer('#fff')], [5, 10, 20, 40, 60, 80]);
	assert.equal(weak.normalText, false);
	assert.equal(weak.strongerStep, 60);
	assert.equal(contrastReport(parseLayer('#111@80'), [parseLayer('#fff')]).normalText, true);
});

test('the map: masters, steps, misfits', () => {
	const r = map(example);
	const row = (name) => r.rows.find((x) => x.name === name);
	assert.equal(row('gray-900').isMaster, true);
	assert.deepEqual([row('gray-100').master, row('gray-100').step], ['gray-900', 5]);
	assert.equal(row('surface-card-nested').step, 5, 'nested card is measured over its parent');
	assert.equal(row('blue-50').master, 'blue-600', 'a pale tint belongs to its own master, not to the ink');
	assert.equal(row('red-50').master, 'red-600');
	assert.deepEqual(r.misfits, ['slate-300', 'slate-500', 'blue-900']);
	assert.deepEqual([row('blue-700').master, row('blue-700').step], ['gray-900', 10], 'a hover is a layer of ink over the color it sits on');
});

test('the map: two scales, and fewer steps never moves a color past the tolerance', () => {
	const r = map(example, { tolerance: 3 });
	assert.ok(r.scales.fewer.count < r.scales.sameLook.count);
	assert.ok(r.scales.fewer.maxShift <= 3);
	assert.ok(r.scales.sameLook.maxShift <= 2);
	for (const row of r.rows.filter((x) => x.fewer)) assert.ok(r.scales.fewer.steps.includes(row.fewer.step));
});

test('the map: scores a scale of your own', () => {
	const r = map(example, { steps: [5, 10, 20, 30, 40, 60, 70, 80] });
	assert.equal(r.scales.given.count, 8);
	assert.ok(r.rows.find((x) => x.name === 'gray-600').given.step === 70);
});

test('the map: offers a tinted ink and says what it costs', () => {
	const r = map(example);
	assert.ok(r.tint);
	assert.ok(r.tint.tinted.includes('slate-500'));
	assert.ok(r.tint.shiftAfter < r.tint.shiftBefore);
	assert.ok(r.tint.otherGraysShift > 2, 'the grays with no tint pay for it');
	const neutral = map({ ...example, colors: example.colors.filter((c) => !/slate|sidebar/.test(c.name)) });
	assert.equal(neutral.tint, null);
});

test('the map: counts independent tokens and closeness', () => {
	const r = map(example, { steps: [5, 10, 20, 30, 40, 60, 70, 80] });
	assert.deepEqual(r.tokens, { independentBefore: 36, independentAfter: 8 });
	assert.equal(r.scales.sameLook.closeness, 100);
	assert.ok(r.scales.given.closeness < 100 && r.scales.given.closeness > 90);
	assert.ok(r.scales.given.averageShift < r.scales.given.maxShift);
});

test('the map: a solid gray of a hard surface stays solid', () => {
	const r = map({ ...example, colors: [...example.colors, { name: 'menu-bg', value: '#fafafa', hard: true }] });
	const row = r.rows.find((x) => x.name === 'menu-bg');
	assert.equal(row.isHard, true);
	assert.equal(r.tokens.independentAfter, 9);
	assert.ok(!r.misfits.includes('menu-bg'));
});

test('the shift command: an element on screen, old against new', () => {
	const out = execFileSync(process.execPath, [new URL('../skills/hardsoft/scripts/hardsoft.mjs', import.meta.url).pathname, 'shift', '#e8e8e8', '--now', '#1111110d', '--on', '#ffffff', '#1111110d', '--json']);
	const r = JSON.parse(out);
	assert.equal(r.same, true);
	assert.ok(r.shift < 0.5);
});

test('shift is zero for the same color and grows with the difference', () => {
	assert.equal(shift(parse('#777'), parse('#777')), 0);
	assert.ok(shift(parse('#777'), parse('#787878')) < shift(parse('#777'), parse('#888')));
});
