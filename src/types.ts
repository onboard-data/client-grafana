import { DataQuery, DataSourceJsonData } from '@grafana/data';

type NameOrId = string | number;

export interface PointSelector extends DataQuery {
  buildings: NameOrId[];

  point_ids: number[];
  point_topics: string[];

  point_types: NameOrId[];
  equipment_types: NameOrId[];
}

export const defaultQuery: Partial<PointSelector> = {
  buildings: [],
  point_ids: [],
  point_topics: [],
  point_types: [],
  equipment_types: [],
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

export interface PointData {
  point_id: number;
  columns: string[];
  unit: string;
  values: NameOrId[][];
  display?: string;
}
