// @ts-nocheck
import styled, { keyframes } from 'styled-components';

import closeIcon from '../../icons/close.svg';
import searchIcon from '../../icons/search.svg';

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 12px 42px -4px rgba(24, 39, 75, 0.12);
  border: 1px solid ${({ theme }) => theme.background1};
`;

export const Heading = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.background1};
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 54px;
`;

export const Body = styled.div<{ type: string }>`
  padding: 0;
  background-color: ${({ theme }) => theme.background};
  max-height: ${({ type }) => (type === 'to' ? '160px' : '250px')};
  overflow-y: auto;
  border-radius: 0 0 8px 8px;
`;

export const SearchIconRow = styled.div`
  padding: 17px 4px 17px 17px;
  flex-shrink: 0;
`;

export const SearchIcon = styled.div`
  width: 16px;
  height: 16px;
  background-size: cover;
  background-image: url(${searchIcon});
  background-position: center;
`;

export const HeadingRow = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: row;
  margin-right: 12px;
`;

export const TextInput = styled.input`
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  width: 100%;
  height: 50px;
  margin-right: 12px;
  border: none;
  outline: none;
  font-size: 11px;
  line-height: 120%;
  color: ${({ theme }) => theme.text1};
  background: transparent;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
`;

export const CloseIcon = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${closeIcon});
  background-size: 100%;
  background-repeat: no-repeat;
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
  }
`;

export const Error = styled.p`
  margin: 10px;
  text-align: left;
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
`;

export const BodySectionRow = styled.div`
  padding: 16px 17px 4px 17px;

  &:nth-child(2) {
    padding: 12px 17px 4px 17px;
  }
`;

export const BodySectionTitle = styled.p`
  margin: 0;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-weight: 500;
  font-size: 10px;
  line-height: 120%;
  color: ${({ theme }) => theme.dropdownSectionTitle};

  @media (min-width: 350px) {
    font-size: 14px;
  }
`;

export const SkeletonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 14px;
`;

export const SkeletonRowSpacer = styled.div<{ width: string }>`
  width: 8px;
`;

export const SkeletonIcon = styled.div`
  height: 24px;
  width: 24px;
`;

export const SkeletonName = styled.div`
  width: 40px;
`;

export const SkeletonContent = styled.div`
  height: 18px;
  width: 40px;

  @media (min-width: 1280px) {
    height: 24px;
    width: 60px;
  }
`;

export const SkeletonNetwork = styled.div`
  height: 16px;
  width: 100px;
`;

const gradient = keyframes`
  from {
    transform: translateX(-80%);
  }

  to {
    transform: translateX(0);
  }
`;

export const Skeleton = styled.div<{ $rounded?: boolean; $width?: string }>`
  position: relative;
  display: block;
  color: transparent;
  border-radius: ${({ $rounded }) => ($rounded ? '50%' : '16px')};
  overflow: hidden;
  backdrop-filter: none;
  background-color: ${({ theme }) => theme.background1};
  width: ${({ $width }) => $width || 'fit-content'};
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  > * {
    visibility: hidden;
  }

  &:after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 500%;
    height: 100%;
    transform: translateX(-80%);
    animation-name: ${gradient};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    background-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 40%,
      rgba(0, 0, 0, 0.05) 50%,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0)
    );
  }
`;
