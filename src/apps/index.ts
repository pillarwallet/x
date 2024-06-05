import i18next from 'i18next';

// types
import { AppManifest } from '../types';

export const loadApp = (appId: string) => {
  let appManifest: AppManifest | null = null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    appManifest = require(`./${appId}/manifest.json`) as AppManifest;

    if (appManifest.translations) {
      Object.keys(appManifest.translations).forEach((languageKey) => {
        const translation = appManifest?.translations[languageKey];
        i18next.addResourceBundle(languageKey, `app:${appId}`, translation);
      });
    }

    return appManifest;
  } catch (e) {
    console.error(`Failed to load app ${appId} - does the ${appId} directory exist in the src/apps directory?`, e);
  }

  return appManifest;
};

export const loadApps = (allowedApps: string[]) => {
  // eslint-disable-next-line no-console
  console.log('allowedApps', allowedApps);
  const loadedApps: Record<string, AppManifest> = {};

  for (let index = 0; index < allowedApps.length; index++) {
    const appIdentifier = allowedApps[index];
    
    if (appIdentifier) {
      const loadedApp = loadApp(appIdentifier);
      if (loadedApp) {
        loadedApps[appIdentifier] = loadedApp;
      }
    } else {
      continue;
    }
  }

  return loadedApps;

  // return allowedApps.reduce(
  //   (apps: Record<string, AppManifest | null>, appId: string) => {
  //     // const loadedApp = loadApp(appId);
  //       apps[appId] = loadApp(appId);
  //       return apps;
      
  //     // if (loadedApp) {
  //     //   apps[appId] = loadedApp;
  //     //   return apps;
  //     // } else {
  //     //   return apps;
  //     // }
  //   },
  //   {}
  // );
};
