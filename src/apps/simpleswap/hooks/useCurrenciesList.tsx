/* eslint-disable @typescript-eslint/no-explicit-any */
/** @module Hooks */
import { useMemo } from 'react';

// types
/**
 * **Descriptor** - interface used for create item for dropdown list
 */
export interface CurrencyListDescriptor<T = any> {
  /**
   * **type** - key used for indicate type of item in list;
   *
   * **filer** - used to show row with list filters
   *
   * **title** - used for title of list section
   *
   * **currency** - used to show coin
   *
   * **skelet** - used to show skeleton row
   *
   * @see [Figma](https://www.figma.com/file/pRa8kzS1Lg091lU4oPVNtq/%F0%9F%94%B5-SS-Exchange?type=design&node-id=11653-411644&mode=design&t=1OlAjDUohjq3rppw-0)
   */
  type: string;
  /**
   * **value** - field for dynamic value
   * @example
   * { type: 'currency', value: ICurrency }
   */
  value?: T;
}
export interface CurrencyListMiddleware<T> {
  type: string;
  modify: (value: CurrencyListDescriptor<T>) => CurrencyListDescriptor<T>;
}

interface CurrencyListOption<T = any> {
  condition: boolean;
  data: CurrencyListDescriptor<T>[];
}

interface Props {
  /**
   * **options** - list of descriptors `CurrencyListOption`
   */
  // CurrencyListDescriptor<any>[]
  options: CurrencyListOption[];
  middlewares?: CurrencyListMiddleware<any>[];
}

export function useCurrenciesList({
  options,
  middlewares = [],
}: Props): [list: CurrencyListDescriptor<any>[]] {
  const list = useMemo(
    () =>
      options
        .reduce<CurrencyListDescriptor<any>[]>(
          (acc, { condition, data }) => (condition ? [...acc, ...data] : acc),
          [],
        )
        .map((option) =>
          middlewares.reduce((acc, middleware) => {
            if (middleware.type === option.type) {
              return middleware.modify(option);
            }
            return acc;
          }, option),
        ),
    [options, middlewares],
  );

  return [list];
}

export function appendOption<T = any>({
  type,
  value,
  condition = true,
}: {
  type: string;
  value?: T;
  condition?: boolean;
}): CurrencyListOption<T> {
  return { condition, data: [{ type, value }] };
}

export function appendManyOptions<T = any>({
  type,
  values,
  condition = true,
  middlewares,
}: {
  type: string;
  values?: Array<any>;
  condition?: boolean;
  middlewares?: [(value: CurrencyListOption<T>) => CurrencyListOption<T>];
}): CurrencyListOption<T> {
  const initialValue: CurrencyListOption<T> = {
    condition,
    data: values?.map((value) => ({ type, value })) ?? [],
  };
  if (!middlewares) {
    return initialValue;
  }
  return middlewares.reduce((value, middleware) => {
    return middleware(value);
  }, initialValue);
}
/**
 * **optionPriorityMiddleware** - middleware to filter currencies by [priority]{@link ICurrency#priority} flag,
 * it's a list that displays filtered priority coins
 *
 * @version 1.0.0
 * @author [Customer team](https://simpleswap.io)
 * @see https://simplewap.io
 */
export function optionPriorityMiddleware(value: CurrencyListOption): CurrencyListOption {
  return {
    ...value,
    data: value.data.filter(({ value: currency }) => currency?.priority),
  };
}
/**
 * **optionPriorityMiddleware** - middleware to filter currencies by [priority]{@link ICurrency#priority} flag,
 * it's a list that displays filtered not priority coins
 *
 * @version 1.0.0
 * @author [Customer team](https://simpleswap.io)
 * @see https://simplewap.io
 */
export function optionNotPriorityMiddleware(value: CurrencyListOption): CurrencyListOption {
  return {
    ...value,
    data: value.data.filter(({ value: currency }) => !currency?.priority),
  };
}
