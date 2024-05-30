type PillarXLogoProps = {
  src: string;
  className?: string;
}

export const PillarXLogo = ({ src, className }: PillarXLogoProps) => {
  return (
    <img src={src} className={`w-min  ${className}`} />
  )
}

export default PillarXLogo;

