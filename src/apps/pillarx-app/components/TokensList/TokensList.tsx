import { createRef, useEffect, useLayoutEffect, useState } from 'react';

// components
import Body from '../Typography/Body';

type TokensListProps = {
    logos: string[];
}

const TokensList = ({ logos }: TokensListProps) => {
    const [logosWidth, setLogosWidth] = useState<number>(0);

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

    useEffect(() => {
        const handleLogosWidthResize = () => {
            if (window.innerWidth >= 1024) {
                setLogosWidth(80);
            } else if (window.innerWidth >= 800) {
                setLogosWidth(30);
            } else {
                setLogosWidth(36);
            }
        };

        handleLogosWidthResize();
        window.addEventListener('resize', handleLogosWidthResize);

        return () => {
            window.removeEventListener('resize', handleLogosWidthResize);
        };
    }, []);
    
    const divRef = createRef()
    const dimensions = useRefDimensions(divRef as React.RefObject<HTMLDivElement>)

    const numberLogos = Math.floor(dimensions.width / logosWidth);
    const numberHiddenLogos = logos.length - numberLogos;

    return (

    <div
            ref={divRef as React.RefObject<HTMLDivElement>}
            className='w-full h-fit flex justify-end'
        >
            {logos.slice(0, numberLogos).map((logo, index) =>
                <img key={index} src={logo} className='w-10 h-10 object-fill rounded-full desktop:mr-10 tablet:mr-[-10px] mobile:mr-1.5 mobile:w-[30px] mobile:h-[30px]' />
            )}
            {numberHiddenLogos > 0 ?
            <div className='flex bg-[#312F3A] min-w-fit rounded-md p-2 mobile:p-1.5 items-center'>
                <Body className='mobile:text-xs'>+ {numberHiddenLogos}</Body>
            </div> : null}
    </div>

    )
};

export default TokensList;
