import defaults from 'lodash/defaults';

import React, { ChangeEvent } from 'react';
import { Field, VerticalGroup, TextArea } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, PointSelector } from './types';
import { BuildingSelector, PointTypeSelector, EquipmentTypeSelector } from './Selectors';

type Props = QueryEditorProps<DataSource, PointSelector, MyDataSourceOptions>;

/**
 * Controlled component for editing a point query inside grafana
 */
export const QueryEditor = (props: Props) => {
  // @ts-ignore
  const query = defaults(props.query, defaultQuery);
  const { buildings, equipment, point_types, equipment_types, point_topics } = query;
  const setKeyValue = (key: string) => (e: SelectableValue[]) =>
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
        <Field label="Equipment Ids, one per line">
          <TextArea
            placeholder="(all matched equipment)"
            cols={80}
            rows={5}
            css=""
            value={equipment.join('\n')}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              props.onChange({
                ...query,
                equipment: e.target.value.split('\n').map((t) => t.trim()),
              })
            }
          />
        </Field>
        <Field label="Point Topics, one per line">
          <TextArea
            placeholder="(all matched points)"
            cols={80}
            rows={10}
            css=""
            value={point_topics.join('\n')}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              props.onChange({
                ...query,
                point_topics: e.target.value.split('\n').map((t) => t.trim()),
              })
            }
          />
        </Field>
      </VerticalGroup>
    </div>
  );
};
