# Remark Image Attributes

Remark plugin to add attributes to markdown and mdx images

Adds attributes to images by extending the default syntax like`![](path)(attribute1: value, attribute2: value)`. Attributes will be applied to the hProperties of that image node.


> [!NOTE]
>
> Should support almost any syntax although `sizes` and any attribute with commas in it needs to be inside quotes.
>
> If using [remark-unwrap-images](https://github.com/remarkjs/remark-unwrap-images) run this plugin first

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