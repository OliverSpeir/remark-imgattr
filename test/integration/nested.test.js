import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Nested Images', () => {
  test('should parse images in unordered lists', async () => {
    const markdown = await readFile('test/fixtures/nested.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'image');
    assert.ok(img, 'Image with alt "image" should exist');
    assert.strictEqual(img.getAttribute('width'), '100');
    assert.strictEqual(img.getAttribute('class'), 'list-image');
    assert.strictEqual(img.getAttribute('src'), './list-img.jpg');

    const img2 = images.find(img => img.getAttribute('alt') === 'Another image');
    assert.ok(img2, 'Image with alt "Another image" should exist');
    assert.strictEqual(img2.getAttribute('height'), '50');
  });

  test('should parse images in ordered lists', async () => {
    const markdown = await readFile('test/fixtures/nested.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'numbered');
    assert.ok(img, 'Image with alt "numbered" should exist');
    assert.strictEqual(img.getAttribute('width'), '150');

    const img2 = images.find(img => img.getAttribute('alt') === 'Third');
    assert.ok(img2, 'Image with alt "Third" should exist');
    assert.strictEqual(img2.getAttribute('class'), 'numbered');
  });

  test('should parse images in blockquotes', async () => {
    const markdown = await readFile('test/fixtures/nested.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'quote image');
    assert.ok(img, 'Image with alt "quote image" should exist');
    assert.strictEqual(img.getAttribute('width'), '200');
    const style = img.getAttribute('style');
    assert.ok(style, 'style attribute should exist');
    assert.ok(style.includes('float') && style.includes('right'));

    const img2 = images.find(img => img.getAttribute('alt') === 'Full width quote');
    assert.ok(img2, 'Image with alt "Full width quote" should exist');
    assert.strictEqual(img2.getAttribute('width'), '100%');
  });

  test('should parse images in nested lists', async () => {
    const markdown = await readFile('test/fixtures/nested.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'nested image');
    assert.ok(img, 'Image with alt "nested image" should exist');
    assert.strictEqual(img.getAttribute('width'), '80');

    const deepImg = images.find(img => img.getAttribute('alt') === 'deep');
    assert.ok(deepImg, 'Image with alt "deep" should exist');
    assert.strictEqual(deepImg.getAttribute('width'), '60');
  });

  test('should handle multiple images with various nesting', async () => {
    const markdown = await readFile('test/fixtures/nested.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    // Separate line images
    const inline1 = images.find(img => img.getAttribute('alt') === 'inline1');
    const inline2 = images.find(img => img.getAttribute('alt') === 'inline2');
    assert.ok(inline1, 'inline1 image should exist');
    assert.ok(inline2, 'inline2 image should exist');
    assert.strictEqual(inline1.getAttribute('width'), '30');
    assert.strictEqual(inline2.getAttribute('width'), '40');

    // List image
    const listImg = images.find(img => img.getAttribute('alt') === 'list img');
    assert.ok(listImg, 'list img should exist');
    assert.strictEqual(listImg.getAttribute('height'), '20');

    // Quote image
    const quoteImg = images.find(img => img.getAttribute('alt') === 'quote img');
    assert.ok(quoteImg, 'quote img should exist');
    assert.strictEqual(quoteImg.getAttribute('class'), 'quoted');
  });

  test('should verify all images in fixture are processed', async () => {
    const markdown = await readFile('test/fixtures/nested.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    // The nested.md fixture has 12 images
    assert.strictEqual(images.length, 12, `Should have exactly 12 images, found ${images.length}`);
  });
});
