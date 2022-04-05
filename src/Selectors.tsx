import React, { useState } from 'react';
import { AsyncMultiSelect, MultiSelect } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import {
  fetchBuildings,
  fetchBuildingEquipment,
  fetchEquipmentTypes,
  fetchPointTypes,
  Equipment,
} from './onboard-api';

interface SelectorProps<T> {
  value: Array<SelectableValue<T>>;
  onChange: (vals: Array<SelectableValue<T>>) => any;
  grafanaUrl?: string;
}

interface EquipmentSelectorProps<T> extends SelectorProps<T> {
  buildings: Array<SelectableValue<number>>;
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

const FLOOR_OPTIONS = [
  'Basement',
  'Rooftop',
  'Outside',
  'Whole Building',
  'Ground Floor',
  'Penthouse',
].map((v) => ({ label: v, value: v }));

interface FloorSelectorProps extends SelectorProps<string> {
  prefix: string;
  placeholder: string;
}

function append<T>(array: Array<T>, item: T) {
  const copy = array.slice();
  copy.push(item);
  return copy;
}

/**
 * A multi-selector that is pre-populated with our floor constants and allows users
 * to enter custom values as well
 */
export const FloorSelector = (props: FloorSelectorProps) => {
  const [customOptions, setCustomOptions] = useState<SelectableValue<string>[]>([]);
  const options = customOptions.concat(FLOOR_OPTIONS);
  return (
    <MultiSelect
      {...props}
      options={options}
      isClearable
      isSearchable
      tabSelectsValue
      allowCustomValue
      onCreateOption={(value: string) => {
        const newOpt = { label: value, value };
        setCustomOptions(append(customOptions, newOpt));
        props.onChange(append(props.value, newOpt));
      }}
      menuShouldPortal
      filterOption={(o: SelectableValue<string>, query: string) =>
        o.label?.toLowerCase().indexOf(query.toLowerCase()) !== -1
      }
    />
  );
};

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

const equipDisplayName = (equip: Equipment) => {
  const { equip_id, suffix, type_name } = equip;
  if (!suffix) return `${equip_id} (${type_name})`;
  return `${equip_id} (${type_name}-${suffix})`;
};

export const EquipmentSelector = (props: EquipmentSelectorProps<number>) => (
  <Selector
    prefix="Equipment"
    placeholder="(all equipment)"
    onLoadOptions={() =>
      fetchBuildingEquipment(props.buildings, props.grafanaUrl).then((equips) =>
        equips.map((e) => ({ value: e.id, label: equipDisplayName(e) }))
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
