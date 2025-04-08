/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect } from 'react';
import styled from 'styled-components';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';

interface ITabItem {
  title: string;
  icon: React.ReactNode;
  notificationText?: string;
}

const FormTabSelect = ({
  items,
  onChange,
  defaultSelectedIndex = 0,
  fullwidth = false,
  transparent = false,
}: {
  items: ITabItem[];
  defaultSelectedIndex?: number;
  onChange?: (index: number) => void;
  fullwidth?: boolean;
  transparent?: boolean;
}) => {
  const { showBatchSendModal } = useBottomMenuModal();
  const [selected, setSelected] = React.useState(defaultSelectedIndex);

  useEffect(() => {
    if (showBatchSendModal) {
      setSelected(1);
    }
  }, [showBatchSendModal]);

  const onTabItemClick = (index: number) => {
    setSelected(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <Wrapper>
      <Tabs $fullwidth={fullwidth} $transparent={transparent}>
        {items.map((item, index) => (
          <TabItem
            key={index}
            onClick={() => onTabItemClick(index)}
            selected={selected === index}
            id={`tab-select-${item.title}`}
          >
            <span>{item.icon} </span>
            {item.title}
            {!!item.notificationText && (
              <Notification>{item.notificationText}</Notification>
            )}
          </TabItem>
        ))}
      </Tabs>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const Tabs = styled.div<{ $fullwidth: boolean; $transparent: boolean }>`
  background: ${({ theme, $transparent }) =>
    $transparent ? 'transparent' : theme.color.background.input};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 4px;
  border-radius: 33px;
  overflow: hidden;

  ${({ $fullwidth }) =>
    $fullwidth &&
    `
    width: 100%;

    & > * {
      width: 50%;
    }
  `};
`;

const TabItem = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 9px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.inputInactive};
  border-radius: 33px;

  ${({ selected, theme }) =>
    selected &&
    `
    background: ${theme.color.background.inputActive};
    color: ${theme.color.text.input};
  `};

  span {
    margin-right: 9px;
  }
`;

const Notification = styled.div`
  margin-left: 5px;
  border-radius: 3px;
  background: ${({ theme }) => theme.color.background.contentNotification};
  color: ${({ theme }) => theme.color.text.contentNotification};
  height: 15px;
  min-width: 15px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default FormTabSelect;
