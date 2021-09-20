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
import { fetchTimeseries } from './onboard-api';
import { PointSelector, PointData, MyDataSourceOptions, defaultQuery } from './types';

const REQUIRED_SCOPES = ['general', 'buildings:read'];
const REQUIRED_VERSION = '2021-09-15';

const missingScopes = (missing: string[]) => ({
  status: 'error',
  message: `Provided API Key is missing required scopes: ${missing.join(', ')}`,
});

export class DataSource extends DataSourceApi<PointSelector, MyDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
  }

  async query(options: DataQueryRequest<PointSelector>): Promise<DataQueryResponse> {
    const { range, targets } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    const queries = targets.map(async (target) => {
      const query = defaults(target, defaultQuery);
      // TODO: error handling :-(
      const timeseries = await fetchTimeseries(query, from, to, this.url);
      const df = new MutableDataFrame({
        refId: query.refId,
        fields: [{ name: 'time', type: FieldType.time }],
      });
      timeseries.data.forEach(({ point_id, columns, unit, values, display }: PointData) => {
        const timeCol = columns.indexOf('time');
        const unitCol = columns.indexOf(unit);
        const displayName = display || `${point_id}`;
        df.addField({
          name: `${point_id}`,
          type: FieldType.number,
          config: {
            unit,
            displayName,
          },
        });
        values.forEach((vals: any[]) => {
          df.add({
            [point_id]: vals[unitCol],
            time: new Date(vals[timeCol]).getTime(),
          });
        });
      });
      return df;
    });

    const data = await Promise.all(queries);
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
    const version = whoami.data?.apiVersion ?? '';
    if (version && version < REQUIRED_VERSION) {
      return {
        status: 'error',
        message: `Provided API Key must be using version ${REQUIRED_VERSION} or higher`,
      };
    }
    return {
      status: 'success',
      message: `Connected to Onboard Portal`,
    };
  }
}
