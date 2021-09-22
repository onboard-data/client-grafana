import React from 'react';
import { AsyncMultiSelect } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { fetchBuildings, fetchEquipmentTypes, fetchPointTypes } from './onboard-api';

interface SelectorProps<T> {
  value: Array<SelectableValue<T>>;
  onChange: (vals: Array<SelectableValue<T>>) => any;
  grafanaUrl?: string;
}

interface InternalSelectorProps<T> extends SelectorProps<T> {
  prefix: string;
  placeholder: string;
  onLoadOptions: () => Promise<Array<SelectableValue<T>>>;
}

// Wrapper around the grafana multi selector since the interface is verbose
// ultimately delegates to this class: https://react-select.com/async
function Selector<T>(props: InternalSelectorProps<T>) {
  return (
    <AsyncMultiSelect
      {...props}
      isClearable
      isSearchable
      tabSelectsValue
      defaultOptions
      cacheOptions
      menuShouldPortal
      loadOptions={props.onLoadOptions}
      filterOption={(o: SelectableValue<T>, query: string) =>
        o.label?.toLowerCase().indexOf(query.toLowerCase()) !== -1
      }
    />
  );
}

export const BuildingSelector = (props: SelectorProps<number>) => (
  <Selector
    prefix="Buildings"
    placeholder="(all buildings)"
    onLoadOptions={() =>
      fetchBuildings(props.grafanaUrl).then((buildings) =>
        buildings.map((b) => ({ value: b.id, label: b.name }))
      )
    }
    {...props}
  />
);

export const EquipmentTypeSelector = (props: SelectorProps<number>) => (
  <Selector
    prefix="Equipment Types"
    placeholder="(all types)"
    onLoadOptions={() =>
      fetchEquipmentTypes(props.grafanaUrl).then((equipTypes) =>
        equipTypes.map((et) => ({ value: et.id, label: et.name_long }))
      )
    }
    {...props}
  />
);

export const PointTypeSelector = (props: SelectorProps<number>) => (
  <Selector
    prefix="Point Types"
    placeholder="(all types)"
    onLoadOptions={() =>
      fetchPointTypes(props.grafanaUrl).then((pointTypes) =>
        pointTypes.map((pt) => ({ value: pt.id, label: pt.display_name }))
      )
    }
    {...props}
  />
);
