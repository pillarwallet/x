/* eslint-disable react/prop-types */

import {
    StyledMainButton,
    StyledMainLink,
    ButtonContainer,
    ButtonText,
    ButtonLoader,
} from './styles';

const Component = ({ component, form, children, href, disabled, ...props }) => {
    return component === 'link' ? (
        <StyledMainLink
            $beforeexchange="true"
            className={disabled ? 'main-button-disabled' : ''}
            href={href}
            {...props}
        >
            {children}
        </StyledMainLink>
    ) : (
        <StyledMainButton disabled={disabled} form={form} {...props}>
            {children}
        </StyledMainButton>
    );
};

function MainButton(props) {
    const {
        component,
        disabled,
        onClick,
        to,
        href,
        className,
        bordered,
        toLeft,
        mr,
        isLoading,
        children,
        testId,
        type,
        form,
    } = props;
    // eslint-disable-next-line no-console

    return (
        <ButtonContainer
            className={className || ''}
            toLeft={toLeft}
            mr={mr}
            bordered={bordered}
        >
            <Component
                component={component}
                onClick={onClick}
                href={href}
                to={to}
                bordered={bordered}
                disabled={disabled}
                data-testid={testId}
                type={type}
                form={form}
            >
                {isLoading ? <ButtonLoader color="#000" /> : null}
                <ButtonText isloading={isLoading ? 'true' : undefined}>{children}</ButtonText>
            </Component>
        </ButtonContainer>
    );
}

export default MainButton;
