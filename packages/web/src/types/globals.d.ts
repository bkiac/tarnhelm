declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
