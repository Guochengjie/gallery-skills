# Weather Query

Simple wttr.in-based weather query skill.

## Secret

Set skill secret to default city, for example:

- London

If `location` is provided in request data, it overrides the secret city.

## Example

```json
{
  "location": "London",
  "format": "%l:+%c+%t+%h+%w"
}
```
