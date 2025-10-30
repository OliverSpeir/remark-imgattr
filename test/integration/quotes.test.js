import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Quote Types', () => {
  test('should parse ASCII double quotes', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    // The alt attribute from attributes overrides the original "ASCII double"
    // So we need to find it by src or position
    const imgs = images.filter(img => img.getAttribute('src') === './img.jpg');
    const img = imgs[0]; // First image with this src
    assert.ok(img, 'Image should exist');
    // The alt attribute from hProperties overrides the original
    assert.strictEqual(img.getAttribute('alt'), 'My image');
    assert.strictEqual(img.getAttribute('title'), 'Image title');
  });

  test('should parse ASCII single quotes', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('src') === './img.jpg');
    // After the first img with this src, find the one with single quotes
    // We need to check by index or by checking which one has the overridden alt
    const imgs = images.filter(img => img.getAttribute('src') === './img.jpg');
    assert.ok(imgs.length >= 2, 'Should have at least 2 images with src ./img.jpg');
    // Second one should be the single quote version
    assert.strictEqual(imgs[1].getAttribute('alt'), 'My image');
    assert.strictEqual(imgs[1].getAttribute('title'), 'Image title');
  });

  test('should parse smart double quotes', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    // Smart quotes test - looking for the third occurrence
    const imgs = images.filter(img => img.getAttribute('src') === './img.jpg');
    assert.ok(imgs.length >= 3, 'Should have at least 3 images with src ./img.jpg');
    assert.strictEqual(imgs[2].getAttribute('alt'), 'My image');
    assert.strictEqual(imgs[2].getAttribute('title'), 'Image title');
  });

  test('should parse smart single quotes', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const imgs = images.filter(img => img.getAttribute('src') === './img.jpg');
    assert.ok(imgs.length >= 4, 'Should have at least 4 images with src ./img.jpg');
    assert.strictEqual(imgs[3].getAttribute('alt'), 'My image');
    assert.strictEqual(imgs[3].getAttribute('title'), 'Image title');
  });

  test('should handle escaped quotes inside quoted values', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Escaped');
    assert.ok(img, 'Image with alt "Escaped" should exist');
    const title = img.getAttribute('title');
    assert.ok(title, 'title attribute should exist');
    // The escaped quotes should be in the final value
    assert.ok(title.includes('hello'));
    assert.ok(title.includes('said'));
  });

  test('should handle mixed quote types', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Image');
    assert.ok(img, 'Image with alt "Image" should exist');
    assert.strictEqual(img.getAttribute('alt'), 'Image');
    assert.strictEqual(img.getAttribute('title'), 'Title');
    assert.strictEqual(img.getAttribute('class'), 'hero');
  });

  test('should handle unquoted simple values', async () => {
    const markdown = await readFile('test/fixtures/quotes.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'No quotes');
    assert.ok(img, 'Image with alt "No quotes" should exist');
    assert.strictEqual(img.getAttribute('width'), '300');
    assert.strictEqual(img.getAttribute('class'), 'image-basic');
  });
});
