import { DependencyList, useEffect, useRef } from "react";

export function useDebounce(func: () => void, deps: DependencyList, debounce: number) {

    const funcRef = useRef(func);

    useEffect(() => {
        funcRef.current = func;
    }, [func]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            funcRef.current();
        }, debounce);
        
        return () => {
            clearTimeout(timeout);
        }
    }, [...deps, debounce]);

}