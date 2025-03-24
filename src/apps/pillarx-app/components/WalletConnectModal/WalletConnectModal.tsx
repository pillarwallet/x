import { WalletKitTypes } from '@reown/walletkit';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type WalletConnectModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  sessionData: WalletKitTypes.SessionProposal;
};

const WalletConnectModal = ({
  onClose,
  onConfirm,
  onReject,
  sessionData,
}: WalletConnectModalProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { params } = sessionData;

  const appName = params?.proposer?.metadata?.name || 'Unnamed app';
  const appIcon = params?.proposer?.metadata?.icons[0];
  const appUrl = params?.proposer?.metadata?.url;
  const optionalMethods = params?.optionalNamespaces?.eip155?.methods || [];
  const requiredMethods = params?.requiredNamespaces?.eip155?.methods || [];

  const compatibleMethods: Record<string, string> = {
    personal_sign: 'Send approval requests',
    eth_sendTransaction: 'Send transaction requests',
    eth_signTypedData: 'Send typed data requests',
  };

  // Sort methods to have compatible methods first
  const sortMethods = (methods: string[]) => {
    return methods.sort((a, b) => {
      const aIsCompatible = a in compatibleMethods ? -1 : 1;
      const bIsCompatible = b in compatibleMethods ? -1 : 1;
      return aIsCompatible - bIsCompatible;
    });
  };

  const formattedRequiredMethods = sortMethods(requiredMethods).map(
    (method) => compatibleMethods[method] || method
  );
  const formattedOptionalMethods = sortMethods(optionalMethods).map(
    (method) => compatibleMethods[method] || method
  );

  return (
    <div
      id="walletConnect-modal"
      className="z-[550] fixed inset-0 bg-container_grey bg-opacity-50 flex justify-center items-center"
    >
      <div className="flex flex-col bg-container_grey p-6 rounded-lg shadow-lg w-[90%] max-w-md relative gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          {appIcon ? (
            <img
              src={appIcon}
              alt="dApp-logo"
              className="w-[30px] h-[30px] object-fill rounded-full mr-2"
            />
          ) : (
            <div className="w-[50px] h-[50px] object-fill rounded mr-3.5 overflow-hidden">
              <RandomAvatar name={appName || ''} />
            </div>
          )}
          <div className="flex flex-col">
            <Body>{appName} wants to connect</Body>
            {appUrl && <BodySmall>{appUrl}</BodySmall>}
          </div>
        </div>
        <div className="flex flex-col rounded-lg border border-purple_light p-4">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex justify-between items-center w-full"
          >
            <BodySmall className="text-purple_light mb-2">
              Requested permissions
            </BodySmall>
            {isCollapsed ? (
              <FaChevronUp size={16} />
            ) : (
              <FaChevronDown size={16} />
            )}
          </button>

          {isCollapsed && (
            <div className="mt-2 max-h-[40vh] overflow-y-auto">
              {formattedRequiredMethods.length > 0 && (
                <div>
                  <BodySmall className="text-purple_light mb-2">
                    Required:
                  </BodySmall>
                  <ul className="list-disc pl-4">
                    {formattedRequiredMethods.map((method, index) => (
                      <li key={index}>
                        <p className="text-sm font-light">{method}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formattedOptionalMethods.length > 0 && (
                <div className="mt-2">
                  <BodySmall className="text-purple_light mb-2">
                    Optional:
                  </BodySmall>
                  <ul className="list-disc pl-4">
                    {formattedOptionalMethods.map((method, index) => (
                      <li key={index}>
                        <p className="text-sm font-light">{method}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-between space-x-4">
          <button
            type="button"
            className="border-[1px] border-purple_light px-4 py-2 rounded-lg"
            onClick={() => {
              onReject();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-purple_medium px-4 py-2 rounded-lg"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
