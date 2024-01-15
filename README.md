# Remark Image Attributes

Remark plugin to add attributes to markdown images 

Add `{attribute1:value,attribute2:value}` after an image and those attributes will be applied to the hProperties of that image node

Should support spacing however you prefer, attributes like style and sizes need to be in quotes

## Usage in Astro 

```js
import { defineConfig } from 'astro/config';
import imgAttr from 'remark-imgattr';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	markdown: {
		remarkPlugins:[imgAttr]
	}
});
```

## Example

```md
![alt text](path){ width: 300 }
```

```md
![alt text](path){width:300,height:150}
```

## Support for Astro Specific Syntax

```md
![](path){ width:300, widths:[300,600], sizes:"(min-width: 600px) 600w, 300w" }
```

```md
![](path){ quality: 100 }
```

## Pass styles 

```md
![Style](path){style:'border: 1px solid #ccc; padding: 10px;', width:100}
```
