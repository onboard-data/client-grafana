import defaults from 'lodash/defaults';

import React, { ChangeEvent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, PointSelector } from './types';
import { BuildingSelector, PointTypeSelector, EquipmentTypeSelector } from './Selectors';
const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, PointSelector, MyDataSourceOptions>;

/**
 * Controlled component for editing a point query inside grafana
 */
export const QueryEditor = (props: Props) => {
  // @ts-ignore
  const query = defaults(props.query, defaultQuery);
  const { buildings, point_types, equipment_types } = query;
  const setKeyValue = (key: string) => (e: Array<SelectableValue>) =>
    props.onChange({ ...query, [key]: e });

  console.log(`query = ${JSON.stringify(props.query)}`);

  // TODO: run button?
  // const { onRunQuery } = props; onRunQuery();

  return (
    <div className="gf-form">
      <BuildingSelector value={buildings} onChange={setKeyValue('buildings')} />
      <EquipmentTypeSelector value={equipment_types} onChange={setKeyValue('equipment_types')} />
      <PointTypeSelector value={point_types} onChange={setKeyValue('point_types')} />
    </div>
  );
};
