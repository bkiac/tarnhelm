export function isAnyResultLoading(...results: LoadableResult<any>[]): boolean {
  return results.some((result) => result.loading);
}

export function isAnyLoading(...bools: boolean[]): boolean {
  return bools.some((loading) => loading);
}
