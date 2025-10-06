import styled from 'styled-components';
import { BaseContainer, colors, typography } from './shared.styles';

import { DetailedHTMLProps, HTMLAttributes } from 'react';

interface StyledProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  $isDeposit: boolean;
}

export const S = {
  Loading: styled.div`
    color: ${colors.text.secondary};
    font-size: 14px;
    text-align: center;
    padding: 24px 0;
  `,

  Container: styled.div`
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    width: 100%;
    color: ${colors.text.primary};
  `,

  TableWrapper: styled.div`
    max-height: 400px;
    overflow-y: auto;
    padding: 0;

    /* Custom scrollbar styles */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.3s ease;

    &:hover {
      scrollbar-color: ${colors.button.primary} ${colors.background};
    }

    /* WebKit scrollbar styles */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 4px;
      transition: background 0.3s ease, opacity 0.3s ease;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: ${colors.button.primary};
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${colors.button.primaryHover};
    }

    /* Auto-hide behavior */
    &:not(:hover)::-webkit-scrollbar-thumb {
      opacity: 0;
      transition: opacity 0.5s ease 1s;
    }
  `,

  Header: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${colors.border};
  `,

  Icon: styled.span`
    font-size: 18px;
  `,

  IconImage: styled.img`
    width: 18px;
    height: 18px;
    object-fit: contain;
  `,

  Title: styled.h2`
    ${typography.title};
    margin: 0;
  `,

  RefreshButton: styled.button`
    margin-left: auto;
    background: none;
    border: none;
    color: ${colors.text.secondary};
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    transition: color 0.2s;
    &:hover {
      color: ${colors.text.primary};
    }
  `,

  TableHeader: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.5fr;
    gap: 24px;
    padding: 12px 16px;
    border-bottom: 1px solid ${colors.border};
    cursor: pointer;
  `,

  HeaderCell: styled.div`
    ${typography.small};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;

    &:first-child {
      justify-content: center; /* # column */
    }

    &:nth-child(2) {
      justify-content: flex-start; /* Date column */
    }

    &:nth-child(3) {
      justify-content: center; /* Type column */
    }

    &:nth-child(4) {
      justify-content: center; /* Amount column */
    }

    &:nth-child(5) {
      justify-content: flex-start; /* Token column */
    }
  `,

  TableBody: styled.div`
    width: 100%;
  `,

  SortIcon: styled.span`
    font-size: 12px;
    margin-left: 2px;
  `,

  TableRow: styled.div<StyledProps>`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.5fr;
    gap: 24px;
    padding: 12px 16px;
    border-bottom: 1px solid ${colors.border};
    transition: background-color 0.2s;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: ${({ $isDeposit }) =>
        $isDeposit
          ? 'rgba(74, 222, 128, 0.1)'  // Success color with opacity
          : 'rgba(239, 68, 68, 0.1)'}; // Error color with opacity
    }
  `,

  IdCell: styled.div`
    color: ${colors.text.primary};
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  DateCell: styled.div`
    color: ${colors.text.primary};
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,

  TypeCell: styled.div`
    color: ${colors.text.primary};
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  AmountCell: styled.div<StyledProps>`
    color: ${({ $isDeposit }) =>
      $isDeposit ? colors.status.success : colors.status.error};
    background: none;
    padding: 4px 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${typography.body};
    font-weight: 600;
  `,

  TokenCell: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  TokenIconContainer: styled.div`
    position: relative;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  TokenIcon: styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    background: ${colors.background};
  `,

  ChainOverlay: styled.img`
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
    border: 1px solid #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  `,

  TokenInfo: styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  TokenValue: styled.span`
    color: ${colors.text.primary};
    font-size: 14px;
    font-weight: 600;
  `,

  TokenSymbol: styled.span`
    color: ${colors.text.secondary};
    font-size: 12px;
  `,

  NoItemsMsg: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: ${colors.text.secondary};
    font-size: 14px;
    font-style: italic;
  `,

  ErrorMsg: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    color: ${colors.status.error};
    font-size: 14px;
  `,
};