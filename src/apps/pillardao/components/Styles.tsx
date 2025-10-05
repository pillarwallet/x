import styled from 'styled-components';

export const Section = styled.div`
  margin-bottom: 16px;
  &:last-child { margin-bottom: 0; }
`;

export const Row = styled.div`
  margin-top: 10px;
`;

export const SmallNote = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContent};
  margin: 10px 0 0;
`;

export const ProposalsBox = styled.div`
  margin-top: 12px;
  padding: 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.input};
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
`;

export const MembershipRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 12px;
  align-items: start;
  .label { font-size: 11px; opacity: 0.8; }
  .value { font-size: 13px; margin-bottom: 6px; }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

export const NftBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.background.selectItem};
  border: 1px solid ${({ theme }) => theme.color.border.alertOutline};
  border-radius: 8px;
  min-height: 180px;
  text-align: center;
  p { margin: 0; line-height: 1.4; padding: 0 8px; color: ${({ theme }) => theme.color.text.cardContent}; }
  img { max-width: 100%; max-height: 180px; border-radius: 6px; object-fit: contain; }
`;

export const ConnectLayout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: nowrap;
  @media (max-width: 640px) { flex-wrap: wrap; }
`;

export const Previews = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1 1 280px;
  min-width: 0;
  flex-wrap: wrap;
`;

export const ConnectAside = styled.div<{ $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '320px')};
  max-width: 100%;
  flex: ${({ $fullWidth }) => ($fullWidth ? '1 1 auto' : '0 0 320px')};
`;

export const SuccessNote = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContent};
`;

export const ConnectError = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.transactionStatus.failed};
`;

export const ConnectStatus = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContent};
`;

export const RightAddon = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  & > * { margin-bottom: 0 !important; }
`;

export const WalletInfo = styled.div`
  display: block;
  padding: 10px 12px;
  background: ${({ theme }) => theme.color.background.selectItem};
  border: 1px solid ${({ theme }) => theme.color.border.alertOutline};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text.cardContent};
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  .label { display: inline-block; font-weight: 600; opacity: 0.9; margin-right: 6px; }
  .value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; letter-spacing: 0.2px; word-break: break-all; }
`;

export const ConnectInline = styled.div<{ $singleColumn?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  width: 100%;
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const ProposalItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  padding: 8px 0;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.cardContentHorizontalSeparator};
  border-radius: 6px;
  transition: background 0.12s ease-in-out;
  &:hover { background: ${({ theme }) => theme.color.background.selectItem}; }
  &:last-child { border-bottom: none; }
  .title { font-size: 15px; color: ${({ theme }) => theme.color.background.buttonPrimary}; display: flex; align-items: center; gap: 8px; }
  .status { font-size: 12px; color: ${({ theme }) => theme.color.text.cardContent}; }
  .actions a { font-size: 12px; color: ${({ theme }) => theme.color.text.cardLink}; text-decoration: underline; }
`;

export const RowInline = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const ProposalBody = styled.div`
  padding: 10px;
  margin: 6px 0 10px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContent};
  white-space: pre-wrap;
  background: ${({ theme }) => theme.color.background.selectItem};
  border: 1px solid ${({ theme }) => theme.color.border.alertOutline};
  border-radius: 8px;
  position: relative;
  .content { padding-right: 28px; max-height: 240px; overflow: auto; -webkit-overflow-scrolling: touch; }
  .meta { margin-top: 8px; font-size: 11px; opacity: 0.9; }
`;

export const CollapseButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.color.text.cardLink};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  &:hover { background: ${({ theme }) => theme.color.background.input}; }
`;

export const SessionList = styled.div`
  margin: 8px 0 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SessionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.color.background.input};
  .meta { display: flex; align-items: center; gap: 10px; }
  img { width: 24px; height: 24px; border-radius: 4px; object-fit: cover; }
  .name { font-size: 13px; font-weight: 600; }
  .url { font-size: 11px; opacity: 0.8; }
`;
