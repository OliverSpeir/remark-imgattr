import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Basic Attributes', () => {
  test('should parse simple width and height attributes', async () => {
    const markdown = await readFile('test/fixtures/basic.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    // Find the image with alt "Alt text"
    const img = images.find(img => img.getAttribute('alt') === 'Alt text');
    assert.ok(img, 'Image with alt "Alt text" should exist');
    assert.strictEqual(img.getAttribute('width'), '300');
    assert.strictEqual(img.getAttribute('height'), '200');
    assert.strictEqual(img.getAttribute('src'), './image.jpg');
  });

  test('should parse single loading attribute', async () => {
    const markdown = await readFile('test/fixtures/basic.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Loading lazy');
    assert.ok(img, 'Image with alt "Loading lazy" should exist');
    assert.strictEqual(img.getAttribute('loading'), 'lazy');
    assert.strictEqual(img.getAttribute('src'), './lazy.jpg');
  });

  test('should parse number attribute (quality)', async () => {
    const markdown = await readFile('test/fixtures/basic.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Quality');
    assert.ok(img, 'Image with alt "Quality" should exist');
    assert.strictEqual(img.getAttribute('quality'), '85');
  });

  test('should parse boolean attributes', async () => {
    const markdown = await readFile('test/fixtures/basic.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Defer');
    assert.ok(img, 'Image with alt "Defer" should exist');
    // Boolean true becomes a boolean attribute (present without value)
    assert.ok(img.hasAttribute('defer'), 'defer attribute should be present');
    // Boolean false values are omitted entirely from HTML output
    assert.ok(!img.hasAttribute('async'), 'async attribute should not be present when false');
  });

  test('should parse class attribute', async () => {
    const markdown = await readFile('test/fixtures/basic.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Class');
    assert.ok(img, 'Image with alt "Class" should exist');
    assert.strictEqual(img.getAttribute('class'), 'hero-image');
  });

  test('should parse multiple attributes together', async () => {
    const markdown = await readFile('test/fixtures/basic.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Full featured');
    assert.ok(img, 'Image with alt "Full featured" should exist');
    assert.strictEqual(img.getAttribute('width'), '600');
    assert.strictEqual(img.getAttribute('height'), '400');
    assert.strictEqual(img.getAttribute('loading'), 'lazy');
    assert.strictEqual(img.getAttribute('class'), 'thumbnail');
  });
});
