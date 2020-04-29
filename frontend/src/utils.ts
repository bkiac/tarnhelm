import isNil from 'lodash.isnil';

export function isAnyResultLoading(...results: Array<LoadableResult<any>>): boolean {
  return results.some((result) => result.loading);
}

export function isAnyLoading(...bools: boolean[]): boolean {
  return bools.some((loading) => loading);
}

export function exists<T>(value: T | undefined | null): value is T {
  return !isNil(value);
}
