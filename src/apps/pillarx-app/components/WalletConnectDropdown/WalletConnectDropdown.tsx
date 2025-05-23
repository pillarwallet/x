/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
import { CircularProgress } from '@mui/material';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

// services
import { useWalletConnect } from '../../../../services/walletConnect';

// utils
import { isAddressInSessionViaPrivy } from '../../../../utils/walletConnect';

// images
import SettingIcon from '../../images/setting-wheel.svg';
import Ticked from '../../images/tick-square-ticked.svg';
import Unticked from '../../images/tick-square-unticked.svg';
import WalletConnectLogo from '../../images/wallet-connect-logo.svg';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import SwitchToggle from '../SwitchToggle/SwitchToggle';
import BodySmall from '../Typography/BodySmall';

const WalletConnectDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clipboardToggle, setClipboardToggle] = useState<boolean>(false);
  const [showPermission, setShowPermission] = useState<boolean>(true);
  const [isSettingsView, setIsSettingsView] = useState<boolean>(false);
  const [isBrowserPermission, setIsBrowserPermission] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    connect,
    disconnect,
    disconnectAllSessions,
    activeSessions,
    isLoadingDisconnect,
    isLoadingDisconnectAll,
  } = useWalletConnect();
  const { user } = usePrivy();

  const getClipboardText = async (prompt: boolean) => {
    try {
      return await navigator.clipboard.readText();
    } catch (e) {
      if (prompt) {
        // eslint-disable-next-line no-alert
        const walletConnectPrompt = window.prompt(
          'Enter the WalletConnect link here, or change your clipboard permissions in your browser settings.'
        );
        return walletConnectPrompt;
      }
      return false;
    }
  };

  const handleClipboardMessageClick = () => {
    setShowPermission(!showPermission);
  };

  const handleConnect = async () => {
    const clipboardText = await getClipboardText(true);
    if (clipboardText) {
      await connect(clipboardText);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsSettingsView(false);
  };

  const handleClipboardToggle = (checked: boolean) => {
    setClipboardToggle(checked);
  };

  const handleClipboardPermission = async () => {
    try {
      const clipboardPermission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName,
      });

      if (clipboardPermission.state === 'granted') {
        handleClipboardToggle(true);
      } else {
        handleClipboardToggle(false);
      }

      clipboardPermission.addEventListener('change', () => {
        if (clipboardPermission.state === 'granted') {
          handleClipboardToggle(true);
        } else {
          handleClipboardToggle(false);
        }
      });
    } catch (e) {
      localStorage.setItem('CLIPBOARD_MESSAGE', 'false');
      setIsBrowserPermission(false);
    }
  };

  useEffect(() => {
    handleClipboardPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCompleteSetup = () => {
    localStorage.setItem('CLIPBOARD_MESSAGE', showPermission.toString());
    setIsDropdownOpen(false);
  };

  const filteredSessions = Object.fromEntries(
    Object.entries(activeSessions || {}).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, session]) =>
        !isAddressInSessionViaPrivy(session, user?.wallet?.address || '')
    )
  );

  const numberActiveSessions =
    !!filteredSessions && Object.entries(filteredSessions).length;

  const DisplayContentWalletConnect = () => {
    if (
      localStorage.getItem('CLIPBOARD_MESSAGE') === 'true' ||
      localStorage.getItem('CLIPBOARD_MESSAGE') === null ||
      isSettingsView
    ) {
      return (
        <>
          <div className="flex flex-col">
            {!isSettingsView && (
              <BodySmall className="font-semibold mb-3">Setup</BodySmall>
            )}
            <div className="flex justify-between items-center mb-1">
              <BodySmall className="text-xs font-semibold">
                Clipboard permission
              </BodySmall>
              <SwitchToggle
                isChecked={clipboardToggle}
                isClipboardSwitch
                onClick={() => getClipboardText(false)}
              />
            </div>
            <BodySmall className="text-xs text-purple_light">
              dApps can be automatically connected by copying the WalletConnect
              URL to clipboard.
            </BodySmall>
          </div>
          {!isSettingsView && (
            <div className="flex">
              <img
                src={showPermission ? Unticked : Ticked}
                alt="ticked-clipboard-permission"
                className="h-3.5 w-3.5 cursor-pointer mr-2"
                onClick={handleClipboardMessageClick}
              />
              <BodySmall className="text-xs text-purple_light">
                I understand, don&apos;t show this message again.
              </BodySmall>
            </div>
          )}
          <button
            type="button"
            onClick={() =>
              isSettingsView ? setIsSettingsView(false) : handleCompleteSetup()
            }
            className="flex p-1.5 items-center justify-center bg-purple_medium rounded-md w-full"
          >
            <BodySmall>
              {isSettingsView ? 'Close' : 'Completed set-up'}
            </BodySmall>
          </button>
        </>
      );
    }

    if (
      localStorage.getItem('CLIPBOARD_MESSAGE') === 'false' &&
      numberActiveSessions &&
      numberActiveSessions > 0
    ) {
      return (
        <div className="flex flex-col gap-4">
          <BodySmall className="text-xs text-purple_light text-center">
            Copy WalletConnect URL & click below to automatically connect
          </BodySmall>
          <div className="flex justify-between items-center gap-2">
            <button
              type="button"
              className="bg-purple_medium text-sm font-medium rounded-md w-full p-1.5"
              onClick={handleConnect}
            >
              Connect dApp
            </button>
            {isBrowserPermission && (
              <button
                type="button"
                className="flex items-center justify-center h-8 w-10 rounded-md border border-purple_light/[.1]"
                onClick={() => setIsSettingsView(true)}
              >
                <img
                  src={SettingIcon}
                  alt="wallet-connect-setting"
                  className="w-4 h-4"
                />
              </button>
            )}
          </div>
          {numberActiveSessions > 1 && (
            <div className="flex justify-between items-center mb-4">
              <BodySmall className="text-xs text-purple_light font-semibold">
                {numberActiveSessions} Connected
              </BodySmall>
              <button
                type="button"
                className="text-[11px] px-2 py-1.5 bg-container_grey border border-container_grey rounded-md"
                onClick={() => disconnectAllSessions}
              >
                {isLoadingDisconnectAll ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: 'white' }}
                    data-testid="circular-loading"
                  />
                ) : (
                  'Disconnect all'
                )}
              </button>
            </div>
          )}

          <ul className="flex flex-col gap-4">
            {Object.values(filteredSessions ?? {}).map((session: any) => (
              <li key={session.topic}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {session.peer.metadata.icons[0] ? (
                      <img
                        src={session.peer.metadata.icons[0]}
                        alt="dApp-logo"
                        className="w-[30px] h-[30px] object-fill rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] object-fill rounded mr-3.5 overflow-hidden">
                        <RandomAvatar name={session?.peer?.data?.name || ''} />
                      </div>
                    )}
                    <BodySmall className="line-clamp-1">
                      {session.peer.metadata.name}
                    </BodySmall>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] px-2 py-1.5 border border-purple_light/[.1] rounded-md"
                    onClick={() => disconnect(session.topic)}
                  >
                    {isLoadingDisconnect ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: 'white' }}
                        data-testid="circular-loading"
                      />
                    ) : (
                      'Disconnect'
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (
      localStorage.getItem('CLIPBOARD_MESSAGE') === 'false' &&
      (!numberActiveSessions || numberActiveSessions === 0)
    ) {
      return (
        <div className="flex flex-col gap-4">
          <BodySmall className="text-xs text-purple_light text-center">
            Copy WalletConnect URL & click below to automatically connect
          </BodySmall>
          <div className="flex justify-between items-center gap-2">
            <button
              type="button"
              className="bg-purple_medium text-sm font-medium rounded-md w-full p-1.5"
              onClick={handleConnect}
            >
              Connect dApp
            </button>
            {isBrowserPermission && (
              <button
                type="button"
                className="flex items-center justify-center h-8 w-10 rounded-md border border-purple_light/[.1]"
                onClick={() => setIsSettingsView(true)}
              >
                <img
                  src={SettingIcon}
                  alt="wallet-connect-setting"
                  className="w-4 h-4"
                />
              </button>
            )}
          </div>
          <BodySmall className="text-xs text-purple_light">
            No dApp connected yet.
          </BodySmall>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      id="walletConnect-dropdown"
      className="relative inline-block w-[254px] h-12"
      ref={dropdownRef}
    >
      <div
        className="flex py-[9px] px-3 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer"
        onClick={handleDropdownToggle}
      >
        <div className="flex gap-2 items-center justify-center rounded-lg">
          <img
            src={WalletConnectLogo}
            alt="wallet-connect-logo"
            className="w-4"
          />
          <BodySmall className="text-white">WalletConnect</BodySmall>
          {numberActiveSessions ? (
            <div className="flex w-[19px] h-[19px] bg-purple_medium rounded justify-center items-center">
              <p className="font-semibold text-white text-[10px]">
                {numberActiveSessions}
              </p>
            </div>
          ) : null}
          <RiArrowDownSLine
            color="white"
            size={20}
            className={`transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="flex flex-col py-[9px] px-3 w-fit h-fit border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] gap-4 absolute left-0 w-full p-4 bg-container_grey z-10">
          <DisplayContentWalletConnect />
        </div>
      )}
    </div>
  );
};

export default WalletConnectDropdown;
