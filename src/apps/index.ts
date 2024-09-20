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
    console.error(
      `Failed to load app ${appId} - does the ${appId} directory exist in the src/apps directory?`,
      e
    );
  }

  return appManifest;
};

export const loadApps = (allowedApps: string[]) => {
  const loadedApps: Record<string, AppManifest> = {};

  /**
   * Cycle through the allowedApps array and load the app manifest for each app
   * This used to be a .reduce function but we may need to do more complicated
   * work here in the future so we're using a for loop here.
   */
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

  /**
   * Finally, did we have a REACT_APP_PX_DEVELOPMENT_ID environment variable set?
   * Attempt to load this also.
   */
  if (process.env.REACT_APP_PX_DEVELOPMENT_ID) {
    const developmentApp = loadApp(process.env.REACT_APP_PX_DEVELOPMENT_ID);

    // Did we load it okay?
    if (developmentApp) {
      // Add to the loadedApps record
      loadedApps[process.env.REACT_APP_PX_DEVELOPMENT_ID] = developmentApp;
    }
  }

  // Return the final list of apps
  return loadedApps;
};
