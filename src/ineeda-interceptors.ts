// Dependencies:
import { IneedaInterceptor, IneedaInterceptorFunction, IneedaInterceptorToken  } from './ineeda-types';

// Constants:
let INTERCEPTORS: Array<IneedaInterceptorFunction<any, keyof any>> = [];
let INTERCEPTORS_WITH_TOKEN: Map<IneedaInterceptorToken, Array<IneedaInterceptorFunction<any, keyof any>>> = new Map();

export function getGlobalInterceptors <T> (): Array<IneedaInterceptorFunction<T, keyof T>> {
    return <Array<IneedaInterceptorFunction<T, keyof T>>>INTERCEPTORS;
}

export function getInterceptors <T> (interceptor: IneedaInterceptor<T>): Array<IneedaInterceptorFunction<T, keyof T>> {
    let interceptors: Array<IneedaInterceptorFunction<T, keyof T>> = [];
    if (interceptor instanceof Function) {
        interceptors.push(interceptor);
    } else {
        Object.keys(interceptor).forEach(interceptorKey => {
            interceptors.push((value, key) => {
                if (key === interceptorKey) {
                    return interceptor[interceptorKey as keyof T];
                }
                return value;
            });
        });
    }
    return interceptors;
}

export function getInterceptorsForToken <T> (token: IneedaInterceptorToken): Array<IneedaInterceptorFunction<T, keyof T>> {
    return <Array<IneedaInterceptorFunction<T, keyof T>>>INTERCEPTORS_WITH_TOKEN.get(token);
}

export function resetInterceptors (): void {
    INTERCEPTORS.length = 0;
    INTERCEPTORS_WITH_TOKEN.clear();
}

export function setInterceptors <T> (interceptor: IneedaInterceptor<T>): void {
    INTERCEPTORS = INTERCEPTORS.concat(getInterceptors(interceptor));
}

export function setInterceptorsForToken <T> (token: IneedaInterceptorToken, interceptor: IneedaInterceptor<T>): void {
    INTERCEPTORS_WITH_TOKEN.set(token, getInterceptors(interceptor));
}
