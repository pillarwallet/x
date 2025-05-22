const copyToClipboard = async (text: any, setToast: any) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    setToast({
      message: 'Копирование не сработало — включи доступ к буферу обмена в настройках.',
      type: 'error',
    })
  }
}


export {
  copyToClipboard
}