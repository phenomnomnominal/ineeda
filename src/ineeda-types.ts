/* istanbul ignore next */
/* tslint:disable:no-empty */
export const NOOP = () => {};
/* tslint:enable:no-empty */

export type Constructable<T> = new (...args: Array<any>) => T;

export type IneedaKey<T> = keyof T | keyof IneedaProxy<T> | keyof Object | keyof Function;

export type IneedaInterceptorToken = {};
export type IneedaInterceptorFunction<T, K extends keyof T> = (value?: T[K], key?: K, values?: Partial<T>, target?: T) => any;
export type IneedaInterceptor<T> = IneedaInterceptorFunction<T, keyof T> | Partial<T>;
export type IneedaInterceptorOrToken<T> = IneedaInterceptor<T> | IneedaInterceptorToken;

export interface IneedaProxy<T> {
    hasOwnProperty (): boolean;
    intercept (interceptor: IneedaInterceptorOrToken<T>): T;
    reset (): T;
    toJSON (): Partial<T>;
    toString (): string;
}

export interface IneedaFactory <T> {
    instances?: Array<T & IneedaProxy<T>>;
    (): T & IneedaProxy<T>;
    getLatest? (): T & IneedaProxy<T>;
}

export interface IneedaApi {
   <T> (values?: Partial<T>): T & IneedaProxy<T>;
   factory <T> (values?: Partial<T>): IneedaFactory<T>;
   instanceof <T> (constructor: Constructable<T>, values?: Partial<T>): T & IneedaProxy<T>;
   intercept <T> (interceptorOrToken: IneedaInterceptorOrToken<T>, interceptor?: IneedaInterceptor<T>): void;
   reset (): void;
}
