export default () => {
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    const { languages, language, userLanguage } = navigator;

    return languages ? languages[0] : language || userLanguage;
  }
  return 'en';
};
