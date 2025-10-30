# Edge Cases Test

Empty attributes:

![Empty](./img.jpg)()

Image without attributes at all:

![No attrs](./normal.jpg)

Whitespace in attributes:

![Whitespace](./img.jpg)( width : 300 , height : 200 )

Decimal numbers:

![Decimal](./img.jpg)(opacity: 0.5, scale: 1.5)

Zero values:

![Zero](./img.jpg)(width: 0, height: 0)

Empty string value:

![Empty string](./img.jpg)(alt: "")

Very long attribute value:

![Long](./img.jpg)(data-description: "This is a very long description that contains many words and describes the image in great detail for accessibility purposes")

Special characters in values:

![Special](./img.jpg)(data-info: "test@example.com & <special>")

Multiple images on consecutive lines:

![First](./one.jpg)(width: 100)

![Second](./two.jpg)(width: 200)
