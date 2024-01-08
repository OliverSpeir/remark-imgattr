# Remark Image Attributes

Remark plugin to add attributes to markdown images 

## Example

```md
![alt text](path){ width: 300 }
```

```md
![alt text](path){ width: 300, height: 150 }
```

## Support for Astro Specific Syntax

```md
![](path){ width: 300, widths: [300,600], sizes: "(min-width: 600px) 600w, 300w" }
```

```md
![](path){ quality: 100 }
```

## Pass styles 

```md
![Style](path){ style: "border: 1px solid #ccc; padding: 10px;", width: 100 }
```