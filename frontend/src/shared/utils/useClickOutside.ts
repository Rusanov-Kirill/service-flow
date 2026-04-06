import { useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    callback: () => void
) => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!ref.current) return;

            if (!ref.current.contains(e.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, callback]);
};