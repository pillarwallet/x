import i18next from 'i18next';

// types
import { AppManifest, RecordPerKey } from '../types';

const appsNamespaces = [
  'SignMessage',
];

export const loadAppsList = () => {
 return appsNamespaces.reduce((apps: RecordPerKey<AppManifest>, appNamespace: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appManifest = require(`./${appNamespace}/manifest.json`) as AppManifest;

    if (appManifest.translations) {
      Object.keys(appManifest.translations).forEach((languageKey) => {
        const translation = appManifest.translations[languageKey];
        i18next.addResourceBundle(languageKey, `app:${appNamespace}`, translation);
      });
    }

    apps[appNamespace] = appManifest;

    return apps;
  }, {});
}
