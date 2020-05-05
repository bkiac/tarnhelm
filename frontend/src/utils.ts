export function isAnyLoading(...bools: boolean[]): boolean {
  return bools.some((loading) => loading);
}
