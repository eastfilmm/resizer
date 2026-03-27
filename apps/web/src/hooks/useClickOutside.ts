import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent) => void,
    isActive: boolean = true
) {
    useEffect(() => {
        if (!isActive) return;

        const listener = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler(event);
            }
        };

        // Add listener on next tick to avoid immediate event capture (e.g. from the opening click)
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', listener);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler, isActive]);
}
