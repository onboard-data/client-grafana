import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

const REQUIRED_SCOPES = ['general', 'buildings:read'];

const missingScopes = (missing: string[]) => ({
  status: 'error',
  message: `Provided API Key is missing required scopes: ${missing.join(', ')}`,
});

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      const query = defaults(target, defaultQuery);
      return new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  /**
   * A health check that verifies an onboard API key and its granted scopes
   */
  async testDatasource(): Promise<any> {
    let whoami;
    try {
      whoami = await getBackendSrv().datasourceRequest({
        method: 'GET',
        url: `${this.url}/portal/whoami`,
      });
    } catch (res) {
      const { status, statusText } = res;
      if (status === 401) {
        return {
          status: 'error',
          message: 'Sorry, your provided API Key is invalid',
        };
      }
      if (status === 403) {
        return missingScopes(REQUIRED_SCOPES);
      }
      return {
        status: 'error',
        message: `Something went wrong - please check your API Key and try again (${statusText})`,
      };
    }
    const scopes = whoami.data?.apiKeyScopes ?? [];
    const missing = REQUIRED_SCOPES.filter((s) => scopes.indexOf(s) === -1);
    if (missing.length > 0) {
      return missingScopes(missing);
    }
    return {
      status: 'success',
      message: `Connected to Onboard Portal`,
    };
  }
}
