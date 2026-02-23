import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import imgAttr from '../index.js';

/**
 * Process markdown through the unified pipeline with imgAttr plugin
 * @param {string} markdown - The markdown content to process
 * @param {object} [defaults] - Optional default attributes for images
 * @returns {Promise<string>} The resulting HTML
 */
export async function processMarkdown(markdown, defaults) {
  const result = await unified()
    .use(remarkParse)
    .use(imgAttr, defaults)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}
