import { useLayoutEffect, useState } from 'react';

const useRefDimensions = (ref: React.RefObject<HTMLDivElement>) => {
    const [dimensions, setDimensions] = useState({ width: 1, height: 2 });

    useLayoutEffect(() => {
        const updateDimensions = () => {
            if (ref.current) {
                const { current } = ref;
                const boundingRect = current.getBoundingClientRect();
                const { width, height } = boundingRect;
                const newDimensions = { width: Math.round(width), height: Math.round(height) };
                if (newDimensions.width !== dimensions.width || newDimensions.height !== dimensions.height) {
                    setDimensions(newDimensions);
                }
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [ref, dimensions]);

    return dimensions;
};

export default useRefDimensions;
