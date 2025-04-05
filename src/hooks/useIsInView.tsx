import { useEffect, useState } from "react";

export const useIsInView =<T extends HTMLElement>(ref: React.RefObject<T | null>) => {
    const [isInView, setIsInView] = useState(false);
    const observer = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
    }, {
        threshold: 0.1
    });

    useEffect(() => {
        if (!ref.current) {
            observer.disconnect();
            return;
        }

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, observer]);

    return isInView;
}