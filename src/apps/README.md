# Adding new App

1. Create a new folder in `src/apps/` with the name of your app.
2. Create App file `src/apps/{YourAppNamespace}/index.{js|ts|tsx}` and add default export with your App React component.
3. Create app manifest file based on `src/apps/manifest.json.example` and add it to your App `src/apps/{YourAppNamespace}` folder root as `manifest.json`.
4. Create icon file (requirements: 512x512px, PNG format) and add it to your App `src/apps/{YourAppNamespace}` folder root as `icon.png`.
5. Register your App namespace by adding to `src/apps/index.ts` file under `appNamespaces` array:

```js
  const appsNamespaces = [
    ... // other apps namespaces
    'YourAppNamespace',
  ];
```

6. Submit Pull Request to `main` branch.
