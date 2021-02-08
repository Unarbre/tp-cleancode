
export interface Adaptor<T, U> {
    adapt(source: T): U;
}