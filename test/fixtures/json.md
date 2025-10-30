# JSON and JSON-like Values Test

Valid JSON array:

![Valid array](./img.jpg)(widths: [300, 600, 900])

Valid JSON object (single property):

![Valid object](./img.jpg)(data: {"name": "test"})

Valid JSON object (quoted, multiple properties):

![Quoted object](./img.jpg)(metadata: "{\"author\": \"John\", \"year\": 2024}")

Invalid JSON array (missing quotes):

![Invalid array](./img.jpg)(items: [small, medium, large])

Invalid JSON object (unquoted with commas gets split):

![Unquoted object](./img.jpg)(config: {"enabled": true, "debug": false})

Invalid JSON array (incomplete):

![Incomplete array](./img.jpg)(values: [100, 200, )

Looks like JSON but is a string:

![String bracket](./img.jpg)(note: "[this is just a string]")

Empty JSON array:

![Empty array](./img.jpg)(items: [])

Empty JSON object:

![Empty object](./img.jpg)(data: {})

Nested JSON:

![Nested JSON](./img.jpg)(config: {"display": {"width": 100, "height": 200}})

Mixed quotes in JSON:

![Mixed quotes](./img.jpg)(data: {"name": "John's photo"})
