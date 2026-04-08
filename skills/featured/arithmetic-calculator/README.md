# Arithmetic Calculator

A simple JavaScript skill to evaluate arithmetic expressions accurately.

## Supported syntax

- Numbers: integers and decimals
- Operators: +, -, *, /, %
- Parentheses: ( )
- Unary minus: e.g. -5 + 2, 3 * (-4)
- Power: ^, **, or power(a, b)
- Square root: sqrt(x)
- Absolute value: abs(x)
- Rounding: floor(x), ceil(x), round(x)
- Alias: mod (same as %)

## Example payload

```json
{
  "expression": "round(sqrt(power(5, 2)) + abs(-2.6) + (10 mod 3))"
}
```
