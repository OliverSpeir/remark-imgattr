import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Default Attributes', () => {
	test('should apply no attributes when defaults is empty', async () => {
		const markdown = await readFile('test/fixtures/defaults.md', 'utf-8');
		const html = await processMarkdown(markdown, {});
		const root = parse(html);
		const img = root.querySelector('img[alt="Alt text"]');

		// Find the image with alt "Alt text"
		assert.ok(img, 'Image with alt "Alt text" should exist');
		assert.deepEqual(Object.keys(img.attributes), ['src', 'alt']);
	});

	test('should apply default attributes', async () => {
		const markdown = await readFile('test/fixtures/defaults.md', 'utf-8');
		const html = await processMarkdown(markdown, { loading: 'lazy' });
		const root = parse(html);
		const img = root.querySelector('img[alt="Alt text"]');

		// Find the image with alt "Alt text"
		assert.ok(img, 'Image with alt "Alt text" should exist');
		assert.deepEqual(Object.keys(img.attributes), ['src', 'alt', 'loading']);
		assert.strictEqual(img.getAttribute('loading'), 'lazy');
	});

	test('should not override existing attributes', async () => {
		const markdown = await readFile('test/fixtures/defaults.md', 'utf-8');
		const html = await processMarkdown(markdown, { loading: 'lazy' });
		const root = parse(html);
		const img = root.querySelector('img[alt="Loading eager"]');

		// Find the image with alt "Loading eager"
		assert.ok(img, 'Image with alt "Loading eager" should exist');
		assert.deepEqual(Object.keys(img.attributes), ['src', 'alt', 'loading']);
		assert.strictEqual(img.getAttribute('loading'), 'eager'); // Should not be overridden
	});

	test('should include default attributes when not overridden', async () => {
		const markdown = await readFile('test/fixtures/defaults.md', 'utf-8');
		const html = await processMarkdown(markdown, { loading: 'lazy', width: '800' });
		const root = parse(html);
		const img = root.querySelector('img[alt="Loading eager"]');

		// Find the image with alt "Loading eager"
		assert.ok(img, 'Image with alt "Loading eager" should exist');
		assert.deepEqual(Object.keys(img.attributes), ['src', 'alt', 'loading', 'width']);
		assert.strictEqual(img.getAttribute('loading'), 'eager');
		assert.strictEqual(img.getAttribute('width'), '800');
	});
});
