# Onboard Portal Grafana Datasource

This package provides a Grafana Datasource for Onboard Data's [building data API](https://portal.onboarddata.io).
For more details, you can navigate to the API & Docs Page to read the Getting Started Documentation section in the portal.
You'll have access to this page once you've signed up for our sandbox or you've been given access to your organization's account.

## API Access

You'll need an API key in order to use this datasource. If you don't have one and would like to start prototyping against an example building please [request a key here](https://onboarddata.io/api-keys). Your key will need to have scopes `general` and `buildings:read` and be using API version `2020-09-15` or greater.

We currently only support installing this plugin on local Grafana instances, details of that procedure can be [found here](https://grafana.com/docs/grafana/latest/plugins/installation/).

Once installed, the only configuration required is to create a new datasource inside Grafana and provide it with your Onboard API key. The 'Save & Test' button will validate the key with our servers. You'll then be able to select and add building data to dashboards, like you would with any other Grafana datasource.

## License

 Copyright 2018-2021 Onboard Data Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
