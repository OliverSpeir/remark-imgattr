import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Complex Syntax', () => {
  test('should parse CSS style with multiple colons', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Styled');
    assert.ok(img, 'Image with alt "Styled" should exist');
    assert.strictEqual(img.getAttribute('style'), 'border: 1px solid #ccc; padding: 10px;');
    assert.strictEqual(img.getAttribute('width'), '300');
  });

  test('should parse array syntax', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Array widths');
    assert.ok(img, 'Image with alt "Array widths" should exist');
    // Arrays get stringified when converted to HTML attributes
    const widths = img.getAttribute('widths');
    assert.ok(widths, 'widths attribute should exist');
    // Should be the array as a string representation
    assert.ok(widths.includes('300') && widths.includes('600') && widths.includes('900'));
  });

  test('should parse nested parentheses structure', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Nested data');
    assert.ok(img, 'Image with alt "Nested data" should exist');
    const data = img.getAttribute('data');
    assert.ok(data, 'data attribute should exist');
    // Nested objects get stringified as "[object Object]" by rehype
    assert.strictEqual(data, '[object Object]', 'nested structure becomes [object Object]');
  });

  test('should parse sizes attribute with commas (quoted)', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Sizes');
    assert.ok(img, 'Image with alt "Sizes" should exist');
    const sizes = img.getAttribute('sizes');
    assert.ok(sizes, 'sizes attribute should exist');
    // The comma should be preserved in the value
    assert.ok(sizes.includes('600w') && sizes.includes('300w'));
    assert.ok(sizes.includes(','));
  });

  test('should parse JSON object', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'JSON');
    assert.ok(img, 'Image with alt "JSON" should exist');
    const metadata = img.getAttribute('metadata');
    assert.ok(metadata, 'metadata attribute should exist');
    // JSON gets stringified when converted to HTML
    assert.ok(metadata.includes('author') || metadata.includes('John'));
  });

  test('should parse complex combination of attributes', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Everything');
    assert.ok(img, 'Image with alt "Everything" should exist');
    assert.strictEqual(img.getAttribute('width'), '800');
    assert.ok(img.getAttribute('style'), 'style attribute should exist');
    assert.ok(img.getAttribute('style').includes('box-shadow'));
    assert.ok(img.getAttribute('widths'), 'widths attribute should exist');
    assert.strictEqual(img.getAttribute('loading'), 'eager');
  });

  test('should parse deeply nested structures', async () => {
    const markdown = await readFile('test/fixtures/complex.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Deep');
    assert.ok(img, 'Image with alt "Deep" should exist');
    const config = img.getAttribute('config');
    assert.ok(config, 'config attribute should exist');
    // Deeply nested structures also become [object Object]
    assert.strictEqual(config, '[object Object]', 'deeply nested structure becomes [object Object]');
  });
});
