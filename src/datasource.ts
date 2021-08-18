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

  async testDatasource(): Promise<any> {
    // Implement a health check for your data source.
    const whoami = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: `${this.url}/portal/whoami`,
    });
    const scopes = whoami.data?.apiKeyScopes ?? [];
    const missing = REQUIRED_SCOPES.filter((s) => scopes.indexOf(s) === -1);
    if (missing.length > 0) {
      return {
        status: 'error',
        message: `Provided API Key is missing required scopes: ${missing.join(', ')}`,
      };
    }
    return {
      status: 'success',
      message: `Connected to Onboard Portal`,
    };
  }
}
