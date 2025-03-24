/* eslint-disable react/jsx-no-constructed-context-values */
import { ReactNode, createContext, useMemo, useState } from 'react';

// components
import WalletConnectToast from '../apps/pillarx-app/components/WalletConnectToast/WalletConnectToast';

interface WalletConnectToastContextProps {
  data: {
    showToast: ({
      content,
      title,
      subtitle,
      image,
    }: {
      content?: ReactNode;
      title?: string;
      subtitle?: string;
      image?: string;
    }) => void;
    hideToast: () => void;
    isToastVisible: boolean;
  };
}

export const WalletConnectToastContext =
  createContext<WalletConnectToastContextProps | null>(null);

export const WalletConnectToastProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState<ReactNode>(null);
  const [toastImage, setToastImage] = useState<string | undefined>(undefined);
  const [toastTitle, setToastTitle] = useState<string | undefined>(undefined);
  const [toastSubtitle, setToastSubtitle] = useState<string | undefined>(
    undefined
  );

  const showToast = ({
    content,
    title,
    subtitle,
    image,
  }: {
    content?: ReactNode;
    title?: string;
    subtitle?: string;
    image?: string;
  }) => {
    setToastContent(content);
    setToastImage(image);
    setToastTitle(title);
    setToastSubtitle(subtitle);
    setIsToastVisible(true);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };

  const contextData = useMemo(
    () => ({
      showToast,
      hideToast,
      isToastVisible,
    }),
    [isToastVisible]
  );

  return (
    <WalletConnectToastContext.Provider value={{ data: contextData }}>
      {children}
      {isToastVisible && (
        <WalletConnectToast onClose={hideToast}>
          {toastContent || (
            <div className="flex items-center">
              {toastImage && (
                <img
                  src={toastImage}
                  alt="toast-image"
                  className="w-[36px] h-[36px] object-fill rounded-full mr-3"
                />
              )}
              <div className="flex flex-col">
                {toastTitle && (
                  <p className="text-base font-semibold">{toastTitle}</p>
                )}
                {toastSubtitle && (
                  <p className="text-[13px] font-medium">{toastSubtitle}</p>
                )}
              </div>
            </div>
          )}
        </WalletConnectToast>
      )}
    </WalletConnectToastContext.Provider>
  );
};
