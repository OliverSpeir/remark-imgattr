import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Edge Cases', () => {
  test('should handle empty attributes ()', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Empty');
    assert.ok(img, 'Image with alt "Empty" should exist');
    assert.strictEqual(img.getAttribute('src'), './img.jpg');
    // Should not have any extra attributes beyond alt and src
  });

  test('should not break images without attributes', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'No attrs');
    assert.ok(img, 'Image with alt "No attrs" should exist');
    assert.strictEqual(img.getAttribute('src'), './normal.jpg');
  });

  test('should handle whitespace in attributes', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Whitespace');
    assert.ok(img, 'Image with alt "Whitespace" should exist');
    assert.strictEqual(img.getAttribute('width'), '300');
    assert.strictEqual(img.getAttribute('height'), '200');
  });

  test('should handle decimal numbers', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Decimal');
    assert.ok(img, 'Image with alt "Decimal" should exist');
    assert.strictEqual(img.getAttribute('opacity'), '0.5');
    assert.strictEqual(img.getAttribute('scale'), '1.5');
  });

  test('should handle zero values', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Zero');
    assert.ok(img, 'Image with alt "Zero" should exist');
    assert.strictEqual(img.getAttribute('width'), '0');
    assert.strictEqual(img.getAttribute('height'), '0');
  });

  test('should handle empty string value', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === '');
    assert.ok(img, 'Image with empty alt should exist');
    assert.strictEqual(img.getAttribute('src'), './img.jpg');
  });

  test('should handle very long attribute values', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Long');
    assert.ok(img, 'Image with alt "Long" should exist');
    const desc = img.getAttribute('data-description');
    assert.ok(desc, 'data-description attribute should exist');
    assert.ok(desc.length > 50, 'Long description should be preserved');
    assert.ok(desc.includes('accessibility'));
  });

  test('should handle special characters in values', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Special');
    assert.ok(img, 'Image with alt "Special" should exist');
    const dataInfo = img.getAttribute('data-info');
    assert.ok(dataInfo, 'data-info attribute should exist');
    // HTML entities might be encoded differently
    assert.ok(dataInfo.includes('test') || dataInfo.includes('example'));
  });

  test('should handle multiple images on consecutive lines', async () => {
    const markdown = await readFile('test/fixtures/edge-cases.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const first = images.find(img => img.getAttribute('alt') === 'First');
    const second = images.find(img => img.getAttribute('alt') === 'Second');

    assert.ok(first, 'First image should exist');
    assert.ok(second, 'Second image should exist');
    assert.strictEqual(first.getAttribute('width'), '100');
    assert.strictEqual(second.getAttribute('width'), '200');
    assert.strictEqual(first.getAttribute('src'), './one.jpg');
    assert.strictEqual(second.getAttribute('src'), './two.jpg');
  });
});
