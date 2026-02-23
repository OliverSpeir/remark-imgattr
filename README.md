# Remark Image Attributes

Remark plugin to add attributes to markdown and mdx images

Adds attributes to images by extending the default syntax like`![](path)(attribute1: value, attribute2: value)`. Attributes will be applied to the hProperties of that image node.


> [!NOTE]
> If using [remark-unwrap-images](https://github.com/remarkjs/remark-unwrap-images) run this plugin first

## Syntax

```md
![alt](path)(key: value, key: value, ...)
```

Attributes are a comma-separated list of `key: value` pairs in a second set of parentheses after the image.

| Value type | Example | Notes |
|---|---|---|
| String | `class: hero` | No quotes needed for simple strings |
| Number | `width: 300` | Integers and decimals supported |
| Boolean | `defer: true` | `true` = attribute present, `false` = attribute omitted |
| Quoted string | `title: "my photo"` | `"` `'` `"` `'` all supported; backslash escape with `\` |
| CSS value | `style: border: 1px solid red;` | Colons in values are fine |
| Array | `widths: [300, 600, 900]` | Parsed as a JS array — for framework component props |
| Nested object | `data: (x: 100, y: 200)` | Parsed as a JS object — for framework component props |
| JSON object | `metadata: {"key": "val"}` | Parsed as a JS object — for framework component props |

### Quoting

Commas inside `[]` arrays and `()` nested structures are handled automatically. Plain string values that contain commas must be quoted, otherwise the value will be silently truncated at the first comma:

```md
<!-- correct: quoted string value containing a comma -->
![](path)(sizes: "(min-width: 600px) 600w, 300w")

<!-- correct: commas inside [] are fine without quotes -->
![](path)(widths: [300, 600, 900])
```

JSON objects with multiple properties must also be quoted, since `{}` is not depth-tracked:

```md
<!-- correct: quoted -->
![](path)(config: "{\"a\": 1, \"b\": 2}")

<!-- incorrect: splits on the comma, only first property is captured -->
![](path)(config: {"a": 1, "b": 2})
```

## Usage in Astro

```js
import { defineConfig } from 'astro/config';
import imgAttr from 'remark-imgattr';

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins:[imgAttr]
	}
});
```

### Setting default attributes

You can pass default attributes that will apply to all markdown and mdx images:

```js
import { defineConfig } from 'astro/config';
import imgAttr from 'remark-imgattr';

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins:[
			[imgAttr, { defaults: { width: 700, format: 'avif' } }],
		],
	},
});
```

If an image specifies the same attributes as `defaults`, the image’s value for that attribute will be used instead of the default value.

## Example


```md
![Style](path)(style: border: 1px solid #ccc; padding: 10px;, width:100)

![alt text](path)(width: 300, height: 150)
```

## Support for Astro Specific Syntax

```md
![](path)( width:300, widths:[300,600], sizes:"(min-width: 600px) 600w, 300w" )

![](path)(quality:100)
```