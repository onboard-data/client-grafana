import { getBackendSrv } from '@grafana/runtime';
import { SelectableValue } from '@grafana/data';
import { PointSelector } from './types';

const compare = (a: any, b: any) => (a === b ? 0 : a > b ? 1 : -1);
const compareKey = (key: string) => (a: any, b: any) => compare(a[key], b[key]);

interface Building {
  id: number;
  name: string;
}

type GrafanaUrl = string | undefined;

export const fetchBuildings = async (grafanaUrl: GrafanaUrl) => {
  const res = await getBackendSrv().datasourceRequest({
    method: 'GET',
    url: `${grafanaUrl}/portal/buildings`,
  });
  const buildings: Building[] = res.data;
  buildings.sort(compareKey('name'));
  return buildings;
};

interface EquipmentType {
  id: number;
  name_long: string;
}

export const fetchEquipmentTypes = async (grafanaUrl: GrafanaUrl) => {
  const res = await getBackendSrv().datasourceRequest({
    method: 'GET',
    url: `${grafanaUrl}/portal/equiptype`,
  });
  const types: EquipmentType[] = res.data;
  types.sort(compareKey('name_long'));
  return types;
};

interface PointType {
  id: number;
  display_name: string;
}

export const fetchPointTypes = async (grafanaUrl: GrafanaUrl) => {
  const res = await getBackendSrv().datasourceRequest({
    method: 'GET',
    url: `${grafanaUrl}/portal/pointtypes`,
  });
  const pointTypes: PointType[] = res.data;
  pointTypes.sort(compareKey('display_name'));
  return pointTypes;
};

const values = (values: Array<SelectableValue<number>>) =>
  values.map(({ value }) => value);

export const fetchTimeseries = async (
  query: PointSelector,
  from: number,
  to: number,
  grafanaUrl: GrafanaUrl
) => {
  const timeseries = await getBackendSrv().datasourceRequest({
    method: 'POST',
    data: {
      start: from,
      end: to,
      selector: {
        buildings: values(query.buildings),
        point_types: values(query.point_types),
        equipment_types: values(query.equipment_types),
        point_topics: query.point_topics,
      }
    },
    url: `${grafanaUrl}/portal/timeseries`,
  });
  return timeseries;
};
