import i18next from 'i18next';

// types
import { AppManifest } from '../types';

/**
 * @name loadApp
 * @description Loads an app manifest from the apps directory.
 * This function dynamically imports the manifest.json file for the specified appId.
 * It also adds any translations defined in the manifest to the i18next instance.
 * If the app cannot be loaded, it logs an error to the console.
 *
 * @param appId - the app identifier to load
 * @returns AppManifest | null
 */
export const loadApp = async (appId: string) => {
  let appManifest: AppManifest | null = null;

  try {
    const appPath = `./${appId}/manifest.json` as string;
    appManifest = (await import(/* @vite-ignore */ appPath)) as AppManifest;

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

/**
 * @name loadApps
 * @description Loads multiple app manifests based on the allowedApps array.
 * It iterates through the allowedApps array, loading each app manifest using the loadApp function.
 * If the app manifest is successfully loaded, it is added to the loadedApps record.
 * Additionally, if the VITE_PX_DEVELOPMENT_ID environment variable is set,
 * it attempts to load that app manifest as well.
 *
 * @param allowedApps - an array of app identifiers that are allowed to be loaded
 * @returns Promise<Record<string, AppManifest>>
 * @throws Will log an error if an app fails to load.
 */
export const loadApps = async (allowedApps: string[]) => {
  const loadedApps: Record<string, AppManifest> = {};

  /**
   * Cycle through the allowedApps array and load the app manifest for each app
   * This used to be a .reduce function but we may need to do more complicated
   * work here in the future so we're using a for loop here.
   */
  for (let index = 0; index < allowedApps.length; index++) {
    const appIdentifier = allowedApps[index];

    if (appIdentifier) {
      const loadedApp = await loadApp(appIdentifier);
      if (loadedApp) {
        loadedApps[appIdentifier] = loadedApp;
      }
    } else {
      continue;
    }
  }

  /**
   * Finally, did we have a VITE_PX_DEVELOPMENT_ID environment variable set?
   * Attempt to load this also.
   */
  if (import.meta.env.VITE_PX_DEVELOPMENT_ID) {
    const developmentApp = await loadApp(
      import.meta.env.VITE_PX_DEVELOPMENT_ID
    );

    // Did we load it okay?
    if (developmentApp) {
      // Add to the loadedApps record
      loadedApps[import.meta.env.VITE_PX_DEVELOPMENT_ID] = developmentApp;
    }
  }

  // Return the final list of apps
  return loadedApps;
};
