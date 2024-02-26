# Adding new App

1. Create a new folder in `src/apps/` with the identifier of your app, e.g. `src/apps/{your-app-identifier}`, (identifier requirements: lowercase letters, kebab case).
2. Create App file `src/apps/{your-app-identifier}/index.{js|ts|tsx}` and add default export with your App React component.
3. Create app manifest file based on `src/apps/manifest.json.example` and add it to your App `src/apps/{your-app-identifier}` folder root as `manifest.json`.
4. Create icon file (requirements: 512x512px, PNG format) and add it to your App `src/apps/{your-app-identifier}` folder root as `icon.png`.
5Submit Pull Request to `main` branch.
