/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from 'styled-components';

// components
import AppsList from '../AppsList';

interface AppsModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const AppsModal = ({ isContentVisible }: AppsModalProps) => {
  if (!isContentVisible) return <DefaultWrapper />;

  return <AppsList />;
};

const DefaultWrapper = styled.div`
  width: 100%;
  max-height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default AppsModal;
