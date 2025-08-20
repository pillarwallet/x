/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from 'react';
import styled from 'styled-components';

interface HistoryEntry {
  id: string;
  date: string;
  type: 'Top-up' | 'Spend';
  amount: string;
  token: {
    symbol: string;
    value: string;
    icon: string;
  };
}

const GasTankHistory = () => {
  const [historyData] = useState<HistoryEntry[]>([
    {
      id: '1',
      date: 'Apr 28, 11:20',
      type: 'Top-up',
      amount: '+$50.00',
      token: { symbol: 'ETH', value: '0.0167', icon: '🔵' },
    },
    {
      id: '2',
      date: 'Apr 27, 16:45',
      type: 'Spend',
      amount: '-$2.30 (gas)',
      token: { symbol: 'USDC', value: '2.30', icon: '🔵' },
    },
    {
      id: '3',
      date: 'Apr 27, 16:03',
      type: 'Top-up',
      amount: '-$110 (gas)',
      token: { symbol: 'USDC', value: '119', icon: '🔵' },
    },
    {
      id: '4',
      date: 'Apr 27, 16:45',
      type: 'Spend',
      amount: '+$47.50',
      token: { symbol: 'OP', value: '30.84', icon: '🔴' },
    },
    {
      id: '5',
      date: 'Apr 27, 16:03',
      type: 'Top-up',
      amount: '+$65.00',
      token: { symbol: 'ETH', value: '0.0217', icon: '🔵' },
    },
    {
      id: '6',
      date: 'Apr 26, 15:14',
      type: 'Spend',
      amount: '-$3.10 (gas)',
      token: { symbol: 'USDC', value: '3.10', icon: '🔵' },
    },
    {
      id: '7',
      date: 'Apr 26, 15:01',
      type: 'Top-up',
      amount: '+$75.00',
      token: { symbol: 'BNB', value: '0.0250', icon: '🟡' },
    },
    {
      id: '8',
      date: 'Apr 25, 14:22',
      type: 'Spend',
      amount: '-$5.00 (gas)',
      token: { symbol: 'USDC', value: '5.00', icon: '🔵' },
    },
  ]);

  const sortedHistory = historyData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Container>
      <Header>
        <Icon>📋</Icon>
        <Title>Gas Tank History</Title>
      </Header>

      <Table>
        <TableHeader>
          <HeaderCell>Date ▲</HeaderCell>
          <HeaderCell>Type ▼</HeaderCell>
          <HeaderCell>Amount ▼</HeaderCell>
          <HeaderCell>Token ▼</HeaderCell>
        </TableHeader>

        <TableBody>
          {sortedHistory.map((entry) => (
            <TableRow key={entry.id}>
              <DateCell>{entry.date}</DateCell>
              <TypeCell>{entry.type}</TypeCell>
              <AmountCell isPositive={entry.amount.startsWith('+')}>
                {entry.amount}
              </AmountCell>
              <TokenCell>
                <TokenIcon>{entry.token.icon}</TokenIcon>
                <TokenInfo>
                  <TokenValue>{entry.token.value}</TokenValue>
                  <TokenSymbol>{entry.token.symbol}</TokenSymbol>
                </TokenInfo>
              </TokenCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #333;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const Icon = styled.span`
  font-size: 18px;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const Table = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
  margin-bottom: 8px;
`;

const HeaderCell = styled.div`
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #2a2a2a;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const DateCell = styled.div`
  color: #ffffff;
  font-size: 14px;
`;

const TypeCell = styled.div`
  color: #ffffff;
  font-size: 14px;
`;

const AmountCell = styled.div<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? '#4ade80' : '#ef4444')};
  font-size: 14px;
  font-weight: 600;
`;

const TokenCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TokenValue = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const TokenSymbol = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;

export default GasTankHistory;
