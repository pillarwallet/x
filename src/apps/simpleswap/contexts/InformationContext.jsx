import React, { useState, useCallback } from 'react';
import InformationDialog from '../components/InformationDialog';
import TooltipIcon from '../components/icons/TooltipIcon';
import ErrorIcon from '../components/icons/ErrorIcon';
import NotificationIcon from '../components/icons/NotificationIcon';
import { DialogsContainer } from './InformationContext.styles';
import PropTypes from 'prop-types';

export const COLORS = {
  error: {
    background: '#FFF0EF',
    circle: {
      active: '#E15D56',
      hover: '#CC413A',
    },
  },
  warning: {
    background: '#FEF7EA',
    circle: {
      active: '#EE9500',
      hover: '#EE6400',
    },
  },
  notification: {
    background: '#E9F7FE',
    circle: {
      active: '#23B3F2',
      hover: '#1990D2',
    },
  },
};

export const InformationContext = React.createContext({ state: {}, actions: {}, error: {} });

export const InformationProvider = (props) => {
  const { children } = props;
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [notification, setNotification] = useState(null);

  const [showError, setShowError] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  const toggleShowError = useCallback(() => {
    setShowError((value) => !value);
  }, []);
  const toggleShowWarning = useCallback(() => {
    setShowWarning((value) => !value);
  }, []);
  const toggleShowNotification = useCallback(() => {
    setShowNotification((value) => !value);
  }, []);

  return (
    <InformationContext.Provider
      value={{
        state: {
          error,
          showError,
          notification,
          showNotification,
          warning,
          showWarning,
        },
        actions: {
          setError,
          setWarning,
          setNotification,
          toggleShowError,
          toggleShowNotification,
          toggleShowWarning,
        },
      }}
    >
      <DialogsContainer>
        {error && showError && (
          <InformationDialog
            icon={<ErrorIcon color={COLORS.error.circle.active} />}
            color={COLORS.error}
            close={toggleShowError}
            message={error}
          />
        )}
        {warning && showWarning && (
          <InformationDialog
            icon={<TooltipIcon color={COLORS.warning.circle.active} />}
            color={COLORS.warning}
            close={toggleShowWarning}
            message={warning}
          />
        )}
        {notification && showNotification && (
          <InformationDialog
            icon={<NotificationIcon color={COLORS.notification.circle.active} />}
            color={COLORS.notification}
            close={toggleShowNotification}
            message={notification}
          />
        )}
      </DialogsContainer>
      {children}
    </InformationContext.Provider>
  );
};

InformationProvider.propTypes = {
  children: PropTypes.node,
}