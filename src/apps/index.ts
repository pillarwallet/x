import i18next from 'i18next';

// types
import { AppManifest, RecordPerKey } from '../types';

export const allowedApps = [
  'sign-message',
  'fear-and-greed',
  'pillar-swap',
];

export const loadApp = (appId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const appManifest = require(`./${appId}/manifest.json`) as AppManifest;

  if (appManifest.translations) {
    Object.keys(appManifest.translations).forEach((languageKey) => {
      const translation = appManifest.translations[languageKey];
      i18next.addResourceBundle(languageKey, `app:${appId}`, translation);
    });
  }

  return appManifest;
}

export const loadApps = () => {
 return allowedApps.reduce((apps: RecordPerKey<AppManifest>, appId: string) => {
    apps[appId] = loadApp(appId);
    return apps;
  }, {});
}
