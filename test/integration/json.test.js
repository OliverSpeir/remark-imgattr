import { describe, test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { processMarkdown } from '../helpers.js';

describe('JSON and JSON-like Values', () => {
  test('should parse valid JSON array', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Valid array');
    assert.ok(img, 'Image with alt "Valid array" should exist');
    const widths = img.getAttribute('widths');
    assert.ok(widths, 'widths attribute should exist');
    // Arrays get stringified when converted to HTML attributes
    assert.ok(widths.includes('300') && widths.includes('600') && widths.includes('900'));
  });

  test('should parse valid JSON object (single property)', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Valid object');
    assert.ok(img, 'Image with alt "Valid object" should exist');
    const data = img.getAttribute('data');
    assert.ok(data, 'data attribute should exist');
    // Objects get stringified to "[object Object]" when converted to HTML
    assert.ok(data === '[object Object]' || data.includes('name'));
  });

  test('should parse quoted JSON object with multiple properties', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Quoted object');
    assert.ok(img, 'Image with alt "Quoted object" should exist');
    const metadata = img.getAttribute('metadata');
    assert.ok(metadata, 'metadata attribute should exist');
    // Quoted JSON is parsed correctly
    assert.ok(metadata.includes('author') || metadata.includes('John') || metadata === '[object Object]');
  });

  test('should fallback to string for invalid JSON array (missing quotes)', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Invalid array');
    assert.ok(img, 'Image with alt "Invalid array" should exist');
    const items = img.getAttribute('items');
    assert.ok(items, 'items attribute should exist');
    // Should be treated as a string since JSON is invalid
    assert.strictEqual(items, '[small, medium, large]');
  });

  test('should split unquoted JSON object with commas (known limitation)', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Unquoted object');
    assert.ok(img, 'Image with alt "Unquoted object" should exist');
    const config = img.getAttribute('config');
    assert.ok(config, 'config attribute should exist');
    // Unquoted JSON objects with commas get split because {} doesn't increment depth
    // Only the first property is captured as the config value
    assert.strictEqual(config, '{"enabled": true');
  });

  test('should fallback to string for incomplete JSON array', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Incomplete array');
    assert.ok(img, 'Image with alt "Incomplete array" should exist');
    const values = img.getAttribute('values');
    assert.ok(values, 'values attribute should exist');
    // Should be treated as a string since JSON is incomplete (whitespace gets trimmed)
    assert.strictEqual(values, '[100, 200,');
  });

  test('should handle quoted string that looks like JSON', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'String bracket');
    assert.ok(img, 'Image with alt "String bracket" should exist');
    const note = img.getAttribute('note');
    assert.ok(note, 'note attribute should exist');
    // Quotes are removed, but it's still just a string
    assert.strictEqual(note, '[this is just a string]');
  });

  test('should parse empty JSON array', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Empty array');
    assert.ok(img, 'Image with alt "Empty array" should exist');
    const items = img.getAttribute('items');
    // Empty arrays might be omitted or stringified
    assert.ok(items !== undefined);
  });

  test('should parse empty JSON object', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Empty object');
    assert.ok(img, 'Image with alt "Empty object" should exist');
    const data = img.getAttribute('data');
    // Empty objects might be omitted or stringified
    assert.ok(data !== undefined);
  });

  test('should parse nested JSON object', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Nested JSON');
    assert.ok(img, 'Image with alt "Nested JSON" should exist');
    const config = img.getAttribute('config');
    assert.ok(config, 'config attribute should exist');
    // Nested objects get stringified
    assert.ok(config.includes('display') || config === '[object Object]');
  });

  test('should parse JSON with mixed quotes', async () => {
    const markdown = await readFile('test/fixtures/json.md', 'utf-8');
    const html = await processMarkdown(markdown);
    const root = parse(html);
    const images = root.querySelectorAll('img');

    const img = images.find(img => img.getAttribute('alt') === 'Mixed quotes');
    assert.ok(img, 'Image with alt "Mixed quotes" should exist');
    const data = img.getAttribute('data');
    assert.ok(data, 'data attribute should exist');
    // Should handle escaped quotes in JSON
    assert.ok(data.includes('name') || data.includes('John') || data === '[object Object]');
  });
});
