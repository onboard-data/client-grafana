import { DataQuery, DataSourceJsonData, SelectableValue } from '@grafana/data';

export interface PointSelector extends DataQuery {
  buildings: Array<SelectableValue<number>>;
  point_types: Array<SelectableValue<number>>;
  equipment: string[];
  equipment_types: Array<SelectableValue<number>>;
  point_topics: string[];
}

export const defaultQuery: Partial<PointSelector> = {
  buildings: [],
  point_topics: [],
  point_types: [],
  equipment_types: [],
  equipment: [],
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

type DataValue = string | number | null;

export interface PointData {
  point_id: number;
  topic: string;
  columns: string[];
  unit: string;
  values: DataValue[][];
  display?: string;
}
