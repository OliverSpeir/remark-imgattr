export default function imgAttr() {
  function isAttributeString(str) {
    return str && str.trim().startsWith("{") && str.trim().endsWith("}");
  }

  function parseAttributes(attrString) {
    // Replace non-standard quotes with standard ones
    attrString = attrString.replace(/“|”/g, '"').replace(/‘|’/g, "'");
    // Removing the leading and trailing braces and trimming
    attrString = attrString.substring(1, attrString.length - 1).trim();

    let attributes = {};
    let currentKey = "";
    let currentValue = "";
    let inQuotes = false;
    let inBrackets = false;

    for (const char of attrString) {
      if (char === "[") {
        inBrackets = true;
        currentValue += char;
        continue;
      } else if (char === "]") {
        inBrackets = false;
        currentValue += char;
        continue;
      }

      if ((char === '"' || char === "'") && !inQuotes && !inBrackets) {
        inQuotes = true;
        continue;
      } else if ((char === '"' || char === "'") && inQuotes) {
        inQuotes = false;
        attributes[currentKey] = parseValue(currentValue.trim());
        currentKey = "";
        currentValue = "";
        continue;
      }

      if (inQuotes || inBrackets) {
        currentValue += char;
      } else {
        if (char === ":") {
          currentKey = currentValue.trim();
          currentValue = "";
        } else if (char === "," && currentKey) {
          attributes[currentKey] = parseValue(currentValue.trim());
          currentKey = "";
          currentValue = "";
        } else if (char !== "," && char !== " " && char !== "}") {
          currentValue += char;
        }
      }
    }

    // Handling any remaining attribute after the loop
    if (currentKey && currentValue) {
      attributes[currentKey] = parseValue(currentValue.trim());
    }

    return attributes;
  }

  function parseValue(value) {
    // Convert string representation of an array into an actual array
    if (value.startsWith("[") && value.endsWith("]")) {
      return value
        .substring(1, value.length - 1)
        .split(",")
        .map((v) => v.trim())
        .map(Number); // Convert each element to a number
    }

    return value;
  }

  function traverseTree(node, depth = 0) {
    if (node.type === "paragraph" && node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        const currentNode = node.children[i];
        let nextNode = node.children[i + 1];

        if (currentNode.type === "image") {
          currentNode.data = currentNode.data || {};

          if (
            nextNode &&
            nextNode.type === "text" &&
            isAttributeString(nextNode.value)
          ) {
            const attrs = parseAttributes(nextNode.value);
            currentNode.data.hProperties = { ...attrs };

            // Remove the attribute node and any subsequent text node if it's just whitespace
            node.children.splice(i + 1, 1);
            if (
              node.children[i + 1] &&
              node.children[i + 1].type === "text" &&
              /^\s*$/.test(node.children[i + 1].value)
            ) {
              node.children.splice(i + 1, 1);
            }
          }
        }

        if (currentNode.children && currentNode.children.length) {
          traverseTree(currentNode, depth + 1);
        }
      }
    } else {
      if (node.children && node.children.length) {
        node.children.forEach((child) => traverseTree(child, depth + 1));
      }
    }
  }

  function transformer(tree) {
    traverseTree(tree);
  }

  return transformer;
}
