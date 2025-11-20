// TODO: once i18n is configured, replace the hard-coded messages below with t('copy.success') / t('copy.error')
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  message: string;
  type: ToastType;
}

type SetToastFunction = (toast: ToastMessage) => void;

const copyToClipboard = async (
  text: string,
  setToast: SetToastFunction
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    setToast({
      message: 'Текст успешно скопирован в буфер обмена',
      type: 'success',
    });
  } catch (err) {
    setToast({
      message: 'Копирование не сработало — включите доступ к буферу обмена в настройках',
      type: 'error',
    });
  }
}

export {
  copyToClipboard,
}
