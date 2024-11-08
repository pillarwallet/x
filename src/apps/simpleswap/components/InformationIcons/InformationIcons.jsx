import { useContext } from 'react';

import ErrorIcon from '../icons/ErrorIcon';
import TooltipIcon from '../icons/TooltipIcon';
import NotificationIcon from '../icons/NotificationIcon';
import { COLORS, InformationContext } from '../../contexts/InformationContext';
import { IconsContainer, TooltipIconContainer } from './styles';

const InformationIcons = () => {
  const {
    state: { error, showError, warning, showWarning, notification, showNotification },
    actions: { toggleShowWarning, toggleShowNotification, toggleShowError },
  } = useContext(InformationContext);

  return (
    <IconsContainer>
      {error && (
        <TooltipIconContainer
          $color={COLORS.error.background}
          disabled={showError}
          onClick={toggleShowError}
        >
          <ErrorIcon color={COLORS.error.circle.active} />
        </TooltipIconContainer>
      )}
      {warning && (
        <TooltipIconContainer
          $color={COLORS.warning.background}
          disabled={showWarning}
          onClick={toggleShowWarning}
        >
          <TooltipIcon color={COLORS.warning.circle.active} />
        </TooltipIconContainer>
      )}
      {notification && (
        <TooltipIconContainer
          $color={COLORS.notification.background}
          disabled={showNotification}
          onClick={toggleShowNotification}
        >
          <NotificationIcon color={COLORS.notification.circle.active} />
        </TooltipIconContainer>
      )}
    </IconsContainer>
  );
};

export default InformationIcons;
