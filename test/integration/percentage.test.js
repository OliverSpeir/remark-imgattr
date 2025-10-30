import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('Percentage Attributes', () => {
  test('should parse simple percentage in width attribute', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Width percent');
    assert.ok(img, 'Image with alt "Width percent" should exist');
    assert.strictEqual(img.getAttribute('width'), '50%', 'width should be "50%"');
    assert.strictEqual(img.getAttribute('src'), './img1.jpg');
  });

  test('should parse simple percentage in height attribute', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Height percent');
    assert.ok(img, 'Image with alt "Height percent" should exist');
    assert.strictEqual(img.getAttribute('height'), '100%', 'height should be "100%"');
    assert.strictEqual(img.getAttribute('src'), './img2.jpg');
  });

  test('should parse both width and height with percentages', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Both percents');
    assert.ok(img, 'Image with alt "Both percents" should exist');
    assert.strictEqual(img.getAttribute('width'), '75%', 'width should be "75%"');
    assert.strictEqual(img.getAttribute('height'), '50%', 'height should be "50%"');
    assert.strictEqual(img.getAttribute('src'), './img3.jpg');
  });

  test('should parse quoted style with single percentage', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Style quoted single');
    assert.ok(img, 'Image with alt "Style quoted single" should exist');
    assert.strictEqual(img.getAttribute('style'), 'width: 50%', 'style should contain "width: 50%"');
    assert.strictEqual(img.getAttribute('src'), './img4.jpg');
  });

  test('should parse quoted style with multiple percentages', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Style quoted multi');
    assert.ok(img, 'Image with alt "Style quoted multi" should exist');
    const style = img.getAttribute('style');
    assert.ok(style, 'style attribute should exist');
    assert.ok(style.includes('width: 50%'), 'style should contain "width: 50%"');
    assert.ok(style.includes('height: 100%'), 'style should contain "height: 100%"');
    assert.ok(style.includes('max-width: 80%'), 'style should contain "max-width: 80%"');
    assert.strictEqual(img.getAttribute('src'), './img5.jpg');
  });

  test('should parse unquoted style with percentage', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Style unquoted');
    assert.ok(img, 'Image with alt "Style unquoted" should exist');
    assert.strictEqual(img.getAttribute('style'), 'width: 50%', 'style should be "width: 50%"');
    assert.strictEqual(img.getAttribute('src'), './img6.jpg');
  });

  test('should parse complex style with percentage and other CSS properties', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Style complex');
    assert.ok(img, 'Image with alt "Style complex" should exist');
    const style = img.getAttribute('style');
    assert.ok(style, 'style attribute should exist');
    assert.ok(style.includes('width: 50%'), 'style should contain "width: 50%"');
    assert.ok(style.includes('border: 1px solid #ccc'), 'style should contain border');
    assert.ok(style.includes('padding: 10px'), 'style should contain padding');
    assert.strictEqual(img.getAttribute('src'), './img7.jpg');
  });

  test('should parse mixed attributes with percentage in style', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Mixed');
    assert.ok(img, 'Image with alt "Mixed" should exist');
    assert.strictEqual(img.getAttribute('width'), '600', 'width should be "600"');
    const style = img.getAttribute('style');
    assert.ok(style, 'style attribute should exist');
    assert.ok(style.includes('height: 75%'), 'style should contain "height: 75%"');
    assert.ok(style.includes('object-fit: cover'), 'style should contain object-fit');
    assert.strictEqual(img.getAttribute('class'), 'responsive', 'class should be "responsive"');
    assert.strictEqual(img.getAttribute('src'), './img8.jpg');
  });

  test('should parse style with calc function and percentage', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Calc percent');
    assert.ok(img, 'Image with alt "Calc percent" should exist');
    const style = img.getAttribute('style');
    assert.ok(style, 'style attribute should exist');
    assert.ok(style.includes('calc(100% - 20px)'), 'style should contain calc function with percentage');
    assert.strictEqual(img.getAttribute('src'), './img9.jpg');
  });

  test('should parse complex combination with percentages and rgba colors', async () => {
    const markdown = await readFile('test/fixtures/percentage.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Complex combo');
    assert.ok(img, 'Image with alt "Complex combo" should exist');
    const style = img.getAttribute('style');
    assert.ok(style, 'style attribute should exist');
    assert.ok(style.includes('width: 90%'), 'style should contain "width: 90%"');
    assert.ok(style.includes('margin: 0 auto'), 'style should contain margin');
    assert.ok(style.includes('rgba(0,0,0,0.5)'), 'style should contain rgba color');
    assert.strictEqual(img.getAttribute('loading'), 'lazy', 'loading should be "lazy"');
    assert.strictEqual(img.getAttribute('src'), './img10.jpg');
  });
});
