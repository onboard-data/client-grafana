import defaults from 'lodash/defaults';

import React, { ChangeEvent } from 'react';
import { LegacyForms, VerticalGroup } from '@grafana/ui';
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
  const { buildings, point_types, equipment_types, point_topics } = query;
  const setKeyValue = (key: string) => (e: Array<SelectableValue>) =>
    props.onChange({ ...query, [key]: e });
  const grafanaUrl = props.datasource.url;

  return (
    <div className="gf-form">
      <VerticalGroup>
        <BuildingSelector
          grafanaUrl={grafanaUrl}
          value={buildings}
          onChange={setKeyValue('buildings')}
        />
        <EquipmentTypeSelector
          grafanaUrl={grafanaUrl}
          value={equipment_types}
          onChange={setKeyValue('equipment_types')}
        />
        <PointTypeSelector
          grafanaUrl={grafanaUrl}
          value={point_types}
          onChange={setKeyValue('point_types')}
        />
        <FormField
          label="Point Topics"
          placeholder="(all matched points)"
          value={point_topics.join('\n')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            props.onChange({ ...query, point_topics: e.target.value.split('\n') })
          }
        />
      </VerticalGroup>
    </div>
  );
};
