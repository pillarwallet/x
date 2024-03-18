import i18next from 'i18next';

// types
import { AppManifest } from '../types';

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

export const loadApps = (allowedApps: string[]) => {
 return allowedApps.reduce((apps: Record<string, AppManifest>, appId: string) => {
    apps[appId] = loadApp(appId);
    return apps;
  }, {});
}
