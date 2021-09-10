import React from 'react';
import { AsyncMultiSelect } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

interface SelectorProps<T> {
  value: Array<SelectableValue<T>>;
  onChange: (vals: Array<SelectableValue<T>>) => any;
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
      loadOptions={props.onLoadOptions}
    />
  );
}

const VALUES = [
  { label: 'label', value: 1, description: 'description' },
  { label: 'label2', value: 2, description: 'description2' },
  { label: 'prefix-label3', value: 3, description: 'prefix-description3' },
];

export const BuildingSelector = (props: SelectorProps<number>) => (
  <Selector
    prefix="Buildings"
    placeholder="(all buildings)"
    onLoadOptions={() => Promise.resolve(VALUES)}
    {...props}
  />
);

export const EquipmentTypeSelector = (props: SelectorProps<number>) => (
  <Selector
    prefix="Equipment Types"
    placeholder="(all types)"
    onLoadOptions={() => Promise.resolve(VALUES)}
    {...props}
  />
);

export const PointTypeSelector = (props: SelectorProps<number>) => (
  <Selector
    prefix="Point Types"
    placeholder="(all types)"
    onLoadOptions={() => Promise.resolve(VALUES)}
    {...props}
  />
);
