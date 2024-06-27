import React, { useRef } from 'react';
import SearchIcon from '../../images/search-icon.png';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isShrinked?: boolean;
}

const TextInput = ({ isShrinked, className, ...props }: TextInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClickIcon = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={`${className} ${!isShrinked && 'w-full'} relative h-[34px]`}>
            {!isShrinked ? (
                <>
                    <input
                        {...props}
                        ref={inputRef}
                        className={`w-full h-full rounded-[3px] p-2 pr-9 bg-white focus:outline-none focus:ring-0 font-normal text-black text-md placeholder-[#717171] ${className}`}
                    />
                    <span
                        className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                        onClick={handleClickIcon}
                    >
                        <img src={SearchIcon} />
                    </span>
                </>
            ) : (
                <div
                    className="flex h-full w-9 rounded-[3px] p-2 bg-white items-center justify-center cursor-pointer"
                    onClick={handleClickIcon}
                >
                    <img src={SearchIcon} />
                </div>
            )}
        </div>
    );
};

export default TextInput;
