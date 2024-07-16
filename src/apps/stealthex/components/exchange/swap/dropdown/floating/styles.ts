import styled from 'styled-components';

import { CloseNew, SearchIcon } from '../../../../common/icons';
import { device } from '../../../../../lib/styles/breakpoints';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  z-index: 99999999;
  padding: 40px;

  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 16px;

  @media ${device.tablet} {
    padding: 24px;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto 1fr;
    column-gap: 40px;
  }
`;

export const HeadingRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  @media ${device.tablet} {
    grid-column: 1 / 3;
  }
`;

export const Heading = styled.h2`
  font-weight: 700;
  font-size: 20px;
  color: var(--nero);
  margin: 0;
`;

export const CloseButton = styled.button`
  display: flex;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 5px;
`;

export const StyledCloseIcon = styled(CloseNew)``;

export const SearchBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  border-bottom: 1px solid var(--medium-gray);

  @media ${device.tablet} {
    align-self: start;
    margin-top: 16px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  color: var(--nero);
  font-size: 14px;
  padding: 11px 0;

  &::placeholder {
    color: var(--gray);
  }
`;

export const SearchButton = styled.button`
  display: flex;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 5px;
`;

export const StyledSearchIcon = styled(SearchIcon)``;

export const ListBlock = styled.div`
  overflow: hidden;

  & > * {
    &::-webkit-scrollbar {
      width: 4px;
      height: 16px;
      border-radius: 0px 0px 4px 0px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--medium-gray);
    }
  }
`;
