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

export interface Equipment {
  id: number;
  equip_id: string;
  suffix: string | undefined;
  type_name: string;
}

export const fetchBuildingEquipment = async (
  buildings: Array<SelectableValue<number>>,
  grafanaUrl: GrafanaUrl
) => {
  const responses = await Promise.all(
    values(buildings).map((buildingId) =>
      getBackendSrv()
        .datasourceRequest({
          method: 'GET',
          url: `${grafanaUrl}/portal/buildings/${buildingId}/equipment`,
        })
        .then((res) => {
          const equips: Equipment[] = res.data;
          return equips;
        })
    )
  );
  const allEquips: Equipment[] = responses.flat();
  allEquips.sort(compareKey('equip_id'));
  return allEquips;
};

function values<T>(values: Array<SelectableValue<T>>) {
  return values.map(({ value }) => value);
}

export const fetchTimeseries = async (
  query: PointSelector,
  start: number,
  end: number,
  grafanaUrl: GrafanaUrl
) => {
  const nonEmpty = (s: string | undefined) => s != null && s.length > 0;
  const selector = {
    buildings: values(query.buildings),
    point_types: values(query.point_types),
    equipment_types: values(query.equipment_types),
    equipment: query.equipment.filter(nonEmpty),
    point_topics: query.point_topics.filter(nonEmpty),
    equip_location: values(query.equip_location),
    equip_served: values(query.equip_served),
  };
  const numSelections = Object.entries(selector)
    .filter(([k]) => k !== 'buildings')
    .map(([_k, v]) => v.length)
    .reduce((a, b) => a + b, 0);
  // don't let a user query all data for all buildings when making a new panel
  if (numSelections === 0) {
    return Promise.resolve({ data: [] });
  }
  const timeseries = await getBackendSrv().datasourceRequest({
    method: 'POST',
    data: {
      start,
      end,
      selector,
    },
    url: `${grafanaUrl}/portal/timeseries`,
  });
  return timeseries;
};
