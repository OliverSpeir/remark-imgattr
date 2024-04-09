/**
 * Plugin to parse and transform image attributes in a markdown abstract syntax tree.
 * @returns {Function} A transformer function to apply on the syntax tree.
 */
export default function imgAttr() {

  /**
   * Checks if a string is a valid attribute string.
   * @param {string} str - The string to check.
   * @returns {boolean} True if the string is a valid attribute string, false otherwise.
   */
  function isAttributeString(str) {
    return str && str.trim().startsWith("(") && str.trim().endsWith(")");
  }

  /**
   * Parses an attribute string into an object.
   * @param {string} attrString - The attribute string to parse.
   * @returns {Object} The parsed attributes as an object.
   */
  function parseAttributes(attrString) {
    attrString = attrString.slice(1, -1).trim(); // Remove the leading and trailing parentheses.

    const attributes = {};
    let currentKey = '';
    let currentValue = '';
    let inQuotes = false;
    let quoteChar = '';
    let depth = 0;
    let escape = false;

    for (let i = 0; i < attrString.length; i++) {
      const char = attrString[i];

      if (escape) {
        currentValue += char;
        escape = false;
        continue;
      }

      if (char === '\\') {
        escape = true;
        continue;
      }

      if ((char === '"' || char === "'" || char === '“' || char === '‘') && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && ((char === '"' && quoteChar === '"') || (char === "'" && quoteChar === "'") || (char === '”' && quoteChar === '“') || (char === '’' && quoteChar === '‘'))) {
        inQuotes = false;
      } else if (!inQuotes) {
        if (char === '(' || char === '[') depth++;
        else if (char === ')' || char === ']') depth--;

        if (char === ',' && depth === 0) {
          if (currentKey) {
            attributes[currentKey] = interpretValue(currentValue.trim());
            currentKey = '';
            currentValue = '';
          }
          continue;
        } else if (char === ':' && depth === 0 && currentKey === '') {
          currentKey = currentValue.trim();
          currentValue = '';
          continue;
        }
      }

      currentValue += char;
    }

    if (currentKey || currentValue.trim()) {
      attributes[currentKey] = interpretValue(currentValue.trim());
    }
    return attributes;
  }

  /**
   * Interprets and cleans an attribute value.
   * @param {string} value - The attribute value to interpret.
   * @returns {any} The cleaned and interpreted value.
   */
  function interpretValue(value) {
    let matched = value.match(/^["'“‘](.*?)["'”’]$/);
    if (matched) {
        value = matched[1];
    }

    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value) && value.trim() !== '') return Number(value);

    if (value.startsWith('(') && value.endsWith(')')) {
        return parseNestedStructure(value);
    }

    try {
        if ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))) {
            return JSON.parse(value);
        }
    } catch (e) {
        // Error handling could be implemented here if needed.
    }

    return value;
  }

  /**
   * Parses a nested structure string into an object.
   * @param {string} value - The nested structure string to parse.
   * @returns {Object} The parsed object.
   */
  function parseNestedStructure(value) {
    value = value.slice(1, -1);
    let parts = value.split(/,(?![^(]*\))/g);
    let result = {};

    parts.forEach(part => {
      let [key, val] = part.split(/:(.+)/);
      key = key.trim();
      val = interpretValue(val.trim());
      result[key] = val;
    });

    return result;
  }

  /**
   * Recursively traverses the syntax tree to find and transform image nodes.
   * @param {Object} node - The current node in the syntax tree.
   * @param {number} [depth=0] - The current depth in the syntax tree.
   */
  function traverseTree(node, depth = 0) {
    if (node.type === "paragraph" && node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        const currentNode = node.children[i];
        if (currentNode.type === "image") {
          currentNode.data = currentNode.data || {};

          let attributeString = "";
          let j = i + 1;

          while (j < node.children.length) {
            const nextNode = node.children[j];
            if (nextNode.type === "text" || nextNode.type === "textDirective") {
              attributeString += nextNode.value || `:${nextNode.name}`;
            }

            if (attributeString.endsWith(")")) {
              break;
            }
            j++;
          }

          if (isAttributeString(attributeString)) {
            const attrs = parseAttributes(attributeString);
            currentNode.data.hProperties = attrs;
            node.children.splice(i + 1, j - i);
          }
        }

        if (currentNode.children && currentNode.children.length) {
          traverseTree(currentNode, depth + 1);
        }
      }
    } else {
      if (node.children && node.children.length) {
        node.children.forEach(child => traverseTree(child, depth + 1));
      }
    }
  }

  /**
   * Transformer function that applies transformations to the syntax tree.
   * @param {Object} tree - The markdown syntax tree.
   */
  function transformer(tree) {
    traverseTree(tree);
  }

  return transformer;
}
