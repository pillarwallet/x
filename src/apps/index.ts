import i18next from 'i18next';

// types
import { AppManifest, RecordPerKey } from '../types';

const allowedApps = [
  'sign-message',
];

export const loadAppsList = () => {
 return allowedApps.reduce((apps: RecordPerKey<AppManifest>, appId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appManifest = require(`./${appId}/manifest.json`) as AppManifest;

    if (appManifest.translations) {
      Object.keys(appManifest.translations).forEach((languageKey) => {
        const translation = appManifest.translations[languageKey];
        i18next.addResourceBundle(languageKey, `app:${appId}`, translation);
      });
    }

    apps[appId] = appManifest;

    return apps;
  }, {});
}
