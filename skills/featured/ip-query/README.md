# IP Query

Query public IP and location from two providers in parallel.

## Endpoints

- https://myip.ipip.net/json
- https://api.ip2location.io/

## Runtime behavior

- Requests both endpoints in parallel.
- Applies 3-second timeout per endpoint.
- Returns per-endpoint success/failure details.

## Example payload

```json
{}
```
