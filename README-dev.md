#

## local dev

### starting grafanas

from this repo's root:

```bash
docker run -d -p 3001:3000 -v "$(pwd)":/var/lib/grafana/plugins --name=grafana8 grafana/grafana:8.1.4
docker run -d -p 3002:3000 -v "$(pwd)":/var/lib/grafana/plugins --name=grafana7 grafana/grafana:7.0.0
```

### plugin dev

`yarn watch` while you're working, `yarn build` to run all checks ahead of commit

Grafana has a storybook with docs for their UI components [here](https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-textarea--basic)

## signing a distribution

https://grafana.com/docs/grafana/latest/developers/plugins/sign-a-plugin/#sign-a-private-plugin

important part:

```bash
  export GRAFANA_API_KEY=<YOUR_API_KEY>  # leading spaces to keep they key out of your shell history
npx @grafana/toolkit plugin:sign --rootUrls http://localhost:3000
```
