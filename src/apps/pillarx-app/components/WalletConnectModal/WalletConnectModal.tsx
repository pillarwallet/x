/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { CircularProgress } from '@mui/material';
import { useWalletConnect } from '../../../../services/walletConnect';
import CloseCircle from '../../images/close-circle.svg';
import BodySmall from '../Typography/BodySmall';

type WalletConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WalletConnectModal = ({ isOpen, onClose }: WalletConnectModalProps) => {
  const walletAddress = useWalletAddress();
  const {
    connect,
    disconnect,
    disconnectAllSessions,
    activeSessions,
    errorMessage,
    infoMessage,
    isLoadingConnect,
    isLoadingDisconnect,
    isLoadingDisconnectAll,
  } = useWalletConnect(walletAddress || '');

  const getClipboardText = async () => {
    try {
      return await navigator.clipboard.readText();
    } catch (e) {
      return false;
    }
  };

  const handleConnect = async () => {
    const clipboardText = await getClipboardText();
    if (clipboardText) {
      connect(clipboardText);
    }
  };

  // console.log({ activeSessions });

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-[#222222]/[.4] backdrop-blur-sm z-30">
        <div className="fixed inset-0 flex items-center justify-center z-40 mobile:items-start tablet:items-start mt-20">
          <div className="relative flex flex-col w-full p-4 desktop:max-w-[600px] tablet:max-w-[600px] mobile:max-w-full mobile:mx-4 bg-container_grey border-[1px] border-medium_grey rounded-md overflow-y-auto max-h-[75vh] mb-20">
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="max-w-fit p-2 rounded-md bg-purple_medium text-sm mb-2"
                onClick={handleConnect}
              >
                {isLoadingConnect ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: 'white' }}
                    data-testid="circular-loading"
                  />
                ) : (
                  'Connect dApp'
                )}
              </button>
              <button
                type="button"
                className="max-w-fit p-2 rounded-md bg-medium_grey border-[1px] border-white text-sm mb-2"
                onClick={disconnectAllSessions}
              >
                {isLoadingDisconnectAll ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: 'white' }}
                    data-testid="circular-loading"
                  />
                ) : (
                  'Disconnect all dApps'
                )}
              </button>
              <BodySmall>{errorMessage}</BodySmall>
              <BodySmall>{infoMessage}</BodySmall>
            </div>

            {activeSessions && (
              <div className="flex flex-col">
                <ul>
                  {Object.values(activeSessions ?? {}).map((session: any) => (
                    <li key={session.topic}>
                      <div className="flex justify-between">
                        <BodySmall>{session.peer.metadata.name}</BodySmall>
                        {isLoadingDisconnect}
                        <button
                          type="button"
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
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        id="token-atlas-close-search-modal"
        className="fixed top-0 right-0 w-[50px] h-[50px] mt-10 mr-[60px] mb-20 mobile:mt-4 mobile:mr-4 z-50"
        onClick={onClose}
      >
        <img src={CloseCircle} alt="Close" />
      </button>
    </>
  );
};

export default WalletConnectModal;
