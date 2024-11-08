import styled from 'styled-components';

import arrow from '../../icons/temp/arrow.svg';
import arrowHover from '../../icons/temp/arrow-hover.svg';

export const Row = styled.div`
  display: flex;
  position: relative;
`;

const getInputGroupHover = ({ $isActive, $isDisabled, theme } : {$isActive: boolean, $isDisabled: boolean, theme: Record<string, string>}) => {
  if ($isDisabled) return theme.background1;
  if ($isActive) return theme.background;

  return theme.background1hover;
};

export const InputLabel = styled.label<{ $hide: boolean }>`
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 120%;
  user-select: none;
  position: absolute;
  white-space: nowrap;
  left: 16px;
  top: 6px;
  display: ${({ $hide }) => ($hide ? 'none' : 'initial')};
  margin-right: auto;

  @media (min-width: 470px) {
    font-size: 14px;
    position: initial;
    font-weight: 500;
    display: initial;
  }
`;

export const InputGroup = styled.div<{
  $isActive: boolean;
  $withError: boolean;
  $isDisabled: boolean;
}>`
  display: flex;
  height: 54px;
  background: ${({ $isActive, theme }) => ($isActive ? theme.background : theme.background1)};
  border-radius: ${({ $withError }) => ($withError ? '8px 0px 0px 0px' : '8px 0px 0px 8px')};
  padding: 10px 10px 6px 16px;
  align-items: center;
  justify-content: space-between;
  border: ${({ theme, $isActive }) => $isActive && `1px solid ${theme.inputActiveBorder}`};
  position: relative;
  width: calc(100% - 90px);
  gap: 18px;

  &:hover {
    background: ${getInputGroupHover};
  }

  ${InputLabel} {
    // color: ${({ $isActive }) => ($isActive ? '#3f5878' : '#859ab5')};
    color: ${({ theme }) => theme.text2};
  }

  @media (min-width: 350px) {
    height: 56px;
    padding: 20px 16px 13px;
    width: calc(100% - 142px);
  }

  @media (min-width: 470px) {
    padding: 18px 16px;
    justify-content: space-between;
    width: calc(100% - 203px);
  }

  #inputToTooltip {
    overflow-wrap: anywhere;
    background: ${({ theme }) => theme.text1};
    color: ${({ theme }) => theme.tooltipText};
    font-size: 12px;
    max-width: 124px;
    text-align: center;
    z-index: 121;
  }
`;

const getTickerSizeDesk = ({ $length }: {$length: number | undefined}) => {
  switch ($length) {
    case 7:
      return '15px';
    case 8:
      return '14px';
    case 9:
      return '12px';
    case 10:
      return '11px';
    default:
      return '18px';
  }
};

const getTickerSize = ({ $length }: {$length: number | undefined}) => {
  switch ($length) {
    case 5:
      return '11px';
    case 6:
      return '10px';
    case 7:
      return '9px';
    case 8:
      return '8px';
    case 9:
      return '7px';
    case 10:
      return '6px';
    default:
      return '15px';
  }
};

export const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  text-align: left;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  color: ${({ theme }) => theme.text1};
  width: 100%;
  padding: 0;

  @media (min-width: 470px) {
    font-size: 16px;
    text-align: right;
  }
`;

export const InputText = styled.div`
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
  font-family: Inter;
  font-weight: 600;
`;

export const InputTo = styled.div<{ $fixed: boolean; $hide: boolean | undefined, $isDisabled: boolean }>`
  background: transparent;
  border: none;
  outline: none;
  text-align: left;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  color: ${({ theme }) => theme.text1};
  display: ${({ $hide }) => ($hide ? 'none' : 'flex')};
  pointer-events: ${({ $isDisabled }) => $isDisabled ? 'none' : 'all'};
  align-items: center;
  max-width: 100%;

  .secure {
    color: #859ab5;
    user-select: none;
    font-weight: 500;
  }

  @media (min-width: 470px) {
    font-size: 16px;
    text-align: right;
    display: flex;
    opacity: ${({ $hide }) => ($hide ? '0' : '1')};
  }
`;

export const InputToTilda = styled.div`
  width: 5px;
  height: 4px;
  margin: 0 3px 0 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  @media (min-width: 350px) {
    width: 10px;
    height: 8px;
    margin: 0 4px 0 4px;
  }
`;

export const Arrow = styled.div`
  height: 20px;
  width: 20px;
  background-image: url(${arrow});
  background-size: cover;
  position: absolute;
  right: 4px;

  @media (min-width: 350px) {
    height: 24px;
    width: 24px;
    right: 16px;
  }
`;

export const Layout = styled.div<{ $hide: boolean; clickable?: boolean }>`
  padding: 13px 8px 10px;
  background: ${({ theme }) => theme.dropdownBackground};
  height: 54px;
  width: 90px;
  flex: 1;
  border-left: 1px solid ${({ theme }) => theme.background};
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
  cursor: pointer;

  ${Arrow} {
    display: ${({ $hide }) => ($hide ? 'none' : 'block')};
  }

  &:hover {
    background: ${({ theme }) => theme.dropdownHoverBackground};

    ${Arrow} {
      background-image: url(${({ $hide }) => ($hide ? arrow : arrowHover)});
    }
  }

  @media (min-width: 350px) {
    height: 56px;
    width: 146px;
    border-left: 2px solid ${({ theme }) => theme.background};
  }
  @media (min-width: 470px) {
    padding: 20px 16px;
    width: 203px;
  }
`;

export const Dots = styled.span`
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 120%;
  color: #859ab5;
  user-select: none;

  @media (min-width: 350px) {
    font-size: 20px;
  }
`;

export const Icon = styled.div`
  margin-right: 4px;
  margin-bottom: -2px;

  @media (min-width: 350px) {
    margin-right: 16px;
    margin-bottom: unset;
  }
`;

export const Name = styled.span<{$length: number | undefined}>`
  margin-right: 0;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-style: normal;
  font-weight: 600;
  text-transform: uppercase;
  font-size: ${getTickerSize};
  line-height: 120%;
  color: ${({ theme }) => theme.text1};
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;

  @media (min-width: 350px) {
    margin-right: 6px;
    font-size: ${getTickerSizeDesk};
  }
`;

export const Network = styled.div<{ $background: string }>`
  background: ${({ $background }) => $background};
  border-radius: 8px;
  padding: 1px 4px 2px 4px;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-style: normal;
  font-weight: 500;
  font-size: 6px;
  line-height: 120%;
  //position: absolute;
  //top: 10px;
  //left: 8px;
  color: white;
  text-transform: uppercase;

  @media (min-width: 350px) {
    position: initial;
    padding: 1px 6px 2px 6px;
    font-size: 10px;
  }
`;

export const TickerFlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-shrink: 1;
  min-width: 30px;
  @media (min-width: 350px) {
    gap: 4px;

    flex-direction: row-reverse;
    justify-content: left;
  }
`;

export const ErrorBlock = styled.div`
  background: #fbe4e3;
  padding: 5px 16px;
  border: 1px solid #eac8c0;
  border-radius: 0 0 8px 8px;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-weight: 500;
  font-size: 10px;
  line-height: 120%;
  color: #e15d56;
  position: absolute;
  width: calc(100% + 2px);
  left: -1px;
  z-index: 2;
  bottom: -24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-wrap: nowrap;
`;

export const ErrorLabel = styled.div``;

export const ErrorAmount = styled.div`
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
  text-overflow: ellipsis;
  max-width: calc(100% - 60px);
  overflow: hidden;
`;
