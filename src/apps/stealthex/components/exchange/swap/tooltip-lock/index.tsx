import React, { useState } from 'react';

import {
    DivTooltip,
    LockCont,
    LockInput,
    RateButton,
    Text,
    Title,
    TooltipBackgroundSection,
    TooltipBtn,
    TooltipContent,
    TooltipNew,
    UnLockInput,
} from './styles';
import { useTranslation } from 'react-i18next';

export const RATES = { floating: 'floating', fixed: 'fixed' };

const TooltipLock: React.FC<{
    widget?: boolean;
    fixed?: boolean;
    onChange?: (fixed: boolean) => void;
}> = ({ widget, fixed, onChange }) => {
    const { t } = useTranslation();

    const [mobileActive, setMobileActive] = useState(false);

    const setFixed = (value: boolean) => {
        onChange && onChange(value);

        // event('fixed_rate_click', {
        //     label: 'Fixed rate click',
        //     category: 'Exchange',
        //     fixed: value,
        // });
    };

    const onClickRateButton = async () => {
        if (window.innerWidth > 933 && !widget) {
            setFixed(!fixed);
        } else {
            setMobileActive(true);
        }
    };

    const ButtonPopap = async () => {
        setFixed(!fixed);
        setMobileActive(false);
    };

    return (
        <>
            <TooltipNew
                className="lock-desktop"
                widget={widget ? 'true' : undefined}
                data-testid="exchange-lock"
            >
                <RateButton
                    widget={widget ? 'true' : undefined}
                    onClick={onClickRateButton}
                    role="button"
                    aria-label="Lock"
                >
                    {fixed ? (
                        <LockCont>
                            <LockInput className="active" fill="#737373" widget={widget ? 'true' : undefined} />
                        </LockCont>
                    ) : (
                        <LockCont>
                            <UnLockInput className="active" fill="#737373" widget={widget ? 'true' : undefined} />
                        </LockCont>
                    )}
                </RateButton>

                <DivTooltip active={mobileActive ? 'true' : undefined} widget={widget ? 'true' : undefined}>
                    <TooltipContent>
                        <Title widget={widget ? 'true' : undefined}>{t('floatingTitle')}</Title>
                        <Text widget={widget ? 'true' : undefined}>{t('floatingDesc')}</Text>
                        <Title widget={widget ? 'true' : undefined}>{t('fixedTitle')}</Title>
                        <Text widget={widget ? 'true' : undefined}>{t('fixedDesc')}</Text>
                        <TooltipBtn
                            widget={widget}
                            onClick={ButtonPopap}
                            testId="exchange-lock-toggle"
                        >
                            {fixed ? t('floatingButton') : t('fixedButton')}
                        </TooltipBtn>
                    </TooltipContent>
                </DivTooltip>
            </TooltipNew>
            <TooltipBackgroundSection
                widget={widget ? 'true' : undefined}
                active={mobileActive ? 'true' : undefined}
                onClick={() => {
                    setMobileActive(false);
                }}
            />
        </>
    );
};

export default TooltipLock;
