# Adding new App to PillarX

## Thank you for taking the time to check out this README and your interest in developing an app for PillarX.

#### The guide below will show you how to get started developing an app. If you have any questions or need support, please get in touch with us via [Discord](https://discord.gg/6MKAy7gv4P) or [Telegram](https://t.me/pillarxdevelopers).

✨ PillarX apps are simply a base React component, which can include other React components to build out a user interface. In the directory for your own app, you can include other React component files, assets and more that are needed for your app.

⚙️ Checkout the top-level `package.json` to see what libraries we have shipped PillarX with. Feel free to use them.

⚠️ **Encountering 429 errors?** You may have hit a rate limit for the Etherspot service. PillarX will keep trying but it might be easier for you to register your own API keys for the Etherspot Bundler API and Etherspot Data Service API via the [Portal](https://portal.etherspot.io).

⚠️ **Privy encountering login limits?** You may have hit the maximum user limit for free accounts on Privy. Feel free to [register for Privy](https://dashboard.privy.io) and create an app. This will give you your own App ID which you can use in the `.env` file.

## How to build an app:

1. Check out the `staging` branch and run `npm i` in the root.

2. We have included a `.env.example` file - copy ALL these values to a `.env` file in the project root. This will ensure that you can run PillarX with no issues.

Note: We have also included several example apps in the `src/apps` folder to help you get started and to quickly see how apps are built in PillarX.

3. Run `npm start` at the root.

⚠️ Note: You will see the landing page first when you launch PillarX using `npm run start` at the root (`/`) route. To log in, navigate to `/login`. The root (`/`) route will now show the PillarX app. We're hiding the ability to log in from the public at this time.

4. Create a new folder in `src/apps/` with the identifier of your app as the folder name, e.g. `src/apps/your-app-identifier`, (identifier requirements: lowercase letters, kebab case). Examples of your identifier could be your brand or project name.

5. Modify the `REACT_APP_PX_DEVELOPMENT_ID` property in your `.env` file to match your app identifier i.e. `your-app-identifier`. You may need to run `npm run start` again for the changes in the `.env` file to be picked up.

```bash
REACT_APP_PX_DEVELOPMENT_ID="your-app-identifier"
```

6. Create a file: `src/apps/{your-app-identifier}/index.{js|ts|tsx}` and add a default export called `App` within your React component. You can check the example app to see how it's done.

```jsx
const App = () => {
  return (
    <p>Hello app!</p>
  )
}

export default App;
```

7. Create app manifest file based on `src/apps/manifest.json.example` and add it to your App `src/apps/{your-app-identifier}` folder root as just `manifest.json`.

8. Create icon file (requirements: 512px x 512px, PNG format) and add it to your App `src/apps/{your-app-identifier}` folder root as `icon.png`. [IconKitchen](https://icon.kitchen) is a great, free tool to use.

9. Submit a Pull Request to `staging` branch.


## Need support or need to contact us?
Contact us via [Discord](https://discord.gg/6MKAy7gv4P) or [Telegram](https://t.me/pillarxdevelopers).