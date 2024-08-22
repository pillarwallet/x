import { useEffect, useState } from 'react';

// images
import LogoEx from '../../images/token-atlas-logo-small.svg';
import ArrowGreen from '../../images/arrow-circle-green.svg';
// import ArrowRed from '../../images/arrow-circle-red.svg';
// import ArrowRedSmall from '../../images/arrow-circle-red-small.svg';
import ArrowGreenSmall from '../../images/arrow-circle-green-small.svg';

// components
import Body from '../Typography/Body';
import TokenGraph from '../TokenGraph/TokenGraph';

type TokenGraphColumnProps = {
    className?: string;
};

const TokenGraphColumn = ({ className }: TokenGraphColumnProps) => {
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

  const handleResize = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  console
    const timeFilter = [
        'Hour',
        'Day',
        'Week',
        'Month',
        'Year',
        'All',
    ];

    // TODO: add red arrow scenario as well
    const getArrow = () => {
        if (viewportWidth > 768) {
            return ArrowGreen;
        }
        return ArrowGreenSmall;
    }

    return (
        <div className={`flex flex-col ${className}`}>
            <div className='flex flex-col w-full max-w-[460px]'>
                <div className="flex items-center gap-2 mb-2">
                    <img src={LogoEx} className="w-[30px] h-[30px] object-fill rounded-full" />
                    <Body className='font-medium text-[27px] mobile:text-[25px]'>Token name</Body>
                    <Body className='text-[15px] mobile:text-[13px] text-white_light_grey pt-2'>TKN</Body>
                </div>
                <div className='flex justify-between'>
                    <h1 className='text-[80px] mobile:text-[45px]'><span className='text-white_light_grey'>$</span>0.000</h1>
                    <div className='flex mobile:flex-col items-end mb-6 mobile:mb-0'>
                        <img src={getArrow()} className='w-[30px] mr-1 mobile:w-3.5 mobile:mb-2'/>
                        <div className='flex'>
                            <Body className='text-[15px] mobile:text-[13px]'>0.002</Body><Body className='text-[11px] font-black mobile:text-[9px] self-start'>%</Body>
                        </div>
                    </div>
                </div>
                <div className='flex bg-medium_grey rounded max-w-[460px] p-1 gap-1'>
                    {timeFilter.map((filter, index) => {return (
                        <button key={index} className='flex-1 text-[11px] font-semibold truncate py-3 text-white_grey rounded hover:bg-green hover:text-dark_grey'>
                            {filter}
                        </button>
                    )})}
                </div>
            </div>
            <TokenGraph />
        </div>

    );
};

export default TokenGraphColumn;
