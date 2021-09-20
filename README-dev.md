#

## local dev

`yarn watch` while you're working, `yarn build` to run all checks ahead of commit

Grafana has a storybook with docs for their UI components [here](https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-textarea--basic)

## signing a distribution

https://grafana.com/docs/grafana/latest/developers/plugins/sign-a-plugin/#sign-a-private-plugin

important part:

```bash
  export GRAFANA_API_KEY=<YOUR_API_KEY>  # leading spaces to keep they key out of your shell history
npx @grafana/toolkit plugin:sign --rootUrls http://localhost:3000
```
