export default function ChainSelectButton() {
  return (
    <button
      className="flex items-center justify-center w-full h-full bg-[#121116] rounded-[10px]"
      type="button"
      aria-label="Save"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <circle opacity="0.3" cx="9.99976" cy="10" r="9" fill="white" />
          <path
            d="M9.99992 19.0001C14.9706 19.0001 19.0001 14.9706 19.0001 9.99992C19.0001 5.02927 14.9706 0.999756 9.99992 0.999756C5.02927 0.999756 0.999756 5.02927 0.999756 9.99992C0.999756 14.9706 5.02927 19.0001 9.99992 19.0001Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.3999 1.89966H7.29992C5.54488 7.15575 5.54488 12.8439 7.29992 18.1H6.3999"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.7 1.89966C14.455 7.15575 14.455 12.8439 12.7 18.1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.90015 13.6V12.7C7.15624 14.455 12.8443 14.455 18.1004 12.7V13.6"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.90015 7.29992C7.15624 5.54488 12.8443 5.54488 18.1004 7.29992"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  );
}
