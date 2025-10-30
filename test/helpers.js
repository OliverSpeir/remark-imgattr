import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import imgAttr from '../index.js';

/**
 * Process markdown through the unified pipeline with imgAttr plugin
 * @param {string} markdown - The markdown content to process
 * @returns {Promise<string>} The resulting HTML
 */
export async function processMarkdown(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(imgAttr)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}
