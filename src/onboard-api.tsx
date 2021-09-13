import { getBackendSrv } from '@grafana/runtime';

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
