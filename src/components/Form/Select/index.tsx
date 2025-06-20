/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiCaretDown, PiCaretUp } from 'react-icons/pi';
import styled from 'styled-components';

// types
import { SelectOption } from '../../../types';

// components
import RandomAvatar from '../../../apps/pillarx-app/components/RandomAvatar/RandomAvatar';
import { CompatibleChains } from '../../../utils/blockchain';
import SkeletonLoader from '../../SkeletonLoader';
import Alert from '../../Text/Alert';

const ListItem = ({
  option,
  onClick,
  rightAddon,
  hideValue,
}: {
  option: SelectOption;
  onClick?: (option: SelectOption) => void;
  rightAddon?: React.ReactNode;
  hideValue?: boolean;
}) => {
  const [hideImage, setHideImage] = useState(false);

  const isChainName = CompatibleChains.map((chains) => chains.chainName).some(
    (chain) => option.title.includes(chain)
  );

  return (
    <ListItemWrapper
      onClick={() => onClick && onClick(option)}
      id={`action-bar-send-${option.title}`}
    >
      {option.imageSrc && !hideImage && (
        <ListItemLeft>
          <ListItemImage
            src={option.imageSrc}
            alt={option.title}
            title={option.title}
            onError={() => setHideImage(true)}
          />
        </ListItemLeft>
      )}
      {!option.imageSrc && !isChainName && (
        <ListItemLeft>
          <RandomAvatar name={option.title} isRound variant="marble" />
        </ListItemLeft>
      )}
      <ListItemRight>
        <ListItemTitle>{option.title}</ListItemTitle>
        {!hideValue && (
          <>
            {!option.isLoadingValue && (
              <ListItemValue>{option.value}</ListItemValue>
            )}
            {option.isLoadingValue && (
              <SkeletonLoader
                data-testid="skeleton-loader-list-item"
                $height="15px"
                $width="30%"
              />
            )}
          </>
        )}
      </ListItemRight>
      {rightAddon}
    </ListItemWrapper>
  );
};

export const Select = ({
  options,
  defaultSelectedId,
  onChange,
  isLoadingOptions,
  hideValue,
  type,
}: {
  options: SelectOption[];
  defaultSelectedId?: string;
  onChange: (option: SelectOption) => void;
  isLoadingOptions?: boolean;
  hideValue?: boolean;
  type?: 'token' | 'nft';
}) => {
  const [t] = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(defaultSelectedId);

  if (isLoadingOptions) {
    return (
      <ListItemWrapper>
        <ListItemLeft>
          <SkeletonLoader $height="42px" $width="42px" $radius="50%" />
        </ListItemLeft>
        <ListItemRight>
          <SkeletonLoader $height="15px" $width="80%" />
          {!hideValue && <SkeletonLoader $height="15px" $width="30%" />}
        </ListItemRight>
      </ListItemWrapper>
    );
  }

  const selected = options.find((option) => option.id === selectedId);

  return (
    <div>
      {selected && (
        <ListItem
          option={selected}
          rightAddon={
            <SelectToggleButton>
              {expanded ? <PiCaretUp /> : <PiCaretDown />}
            </SelectToggleButton>
          }
          onClick={() => setExpanded(!expanded)}
          hideValue={hideValue}
        />
      )}
      {(expanded || !selected) &&
        options
          .filter((option) => option.id !== selected?.id)
          .map((option) => (
            <ListItem
              key={option.id}
              option={option}
              onClick={() => {
                setExpanded(false);
                setSelectedId(option.id);
                onChange(option);
              }}
              hideValue={hideValue}
            />
          ))}
      {!options.length && (
        <Alert>
          {type === 'token' ? t`error.noTokensFound` : t`error.noNftsFound`}
        </Alert>
      )}
    </div>
  );
};

const ListItemImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
`;

const SelectToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 5px;
`;

const ListItemLeft = styled.div`
  width: 42px;
`;

const ListItemRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItemTitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  word-break: break-word;
`;

const ListItemValue = styled.p`
  font-size: 14px;
  font-weight: 400;
  word-break: break-word;
`;

const ListItemWrapper = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.color.background.selectItem};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  gap: 12px;
  padding: 11px 13px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 10px;

  ${({ onClick, theme }) =>
    onClick &&
    `
    &:hover {
      background: ${theme.color.background.selectItemHover};
    }
  `}
`;

export default Select;
