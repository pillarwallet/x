import { createGlobalStyle, keyframes } from 'styled-components';

const skeletonAnimation = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

const SkeletonStyles = createGlobalStyle` 
  .react-loading-skeleton {
    --base-color: #ebebeb;
    --highlight-color: #f5f5f5;
    --animation-duration: 1.5s;
    --animation-direction: normal;
    --pseudo-element-display: block; /* Enable animation */

    background-color: var(--base-color);

    width: 100%;
    border-radius: 8px;
    display: inline-flex;
    line-height: 1;

    position: relative;
    user-select: none;
    overflow: hidden;
    z-index: 1;
  }

  .react-loading-skeleton::after {
    content: ' ';
    display: var(--pseudo-element-display);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-repeat: no-repeat;
    background-image: linear-gradient(
        90deg,
        var(--base-color),
        var(--highlight-color),
        var(--base-color)
    );
    transform: translateX(-100%);

    animation-name: ${skeletonAnimation};
    animation-direction: var(--animation-direction);
    animation-duration: var(--animation-duration);
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
`;

export default SkeletonStyles;