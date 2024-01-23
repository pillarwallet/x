/**
 * @name Fear and Greed Index
 * @description Gm. This PillarX app serves as an example
 * of how you can build a simple app within PillarX. It
 * shows the use of fetching data from external sources with
 * Axios, UI libraries like JoyUI and Google Charts, custom 
 * fonts and animations, translations using React Spring and
 * custom assets. Please feel free to use this as a template
 * and visit https://docs.pillarx.app for more.
 */

// Core
import React, { useEffect } from 'react';

// UI
import { Box, Grid, Typography } from '@mui/joy';
import { animated, useSpring } from '@react-spring/web';
import { Chart } from 'react-google-charts';
import WebFont from 'webfontloader';

// Utils
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Local assets and styles
import BackgroundImage from './assets/moroccan-flower-dark.webp';

/**
 * Define interface
 * for API data
 */
interface ILatestData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

const App = () => {
  /**
   * Load custom fonts from Google Fonts
   * @url https://fonts.google.com
   */
  WebFont.load({
    google: {
      families: ['Bebas Neue', 'Sora']
    }
  });

  /**
   * Define hooks
   */

  /**
   * useTransaction is a hook built-in to PillarX
   * that yo can use. Please define your translations
   * in your manufest.json file.
   */
  const [t] = useTranslation();

  /**
   * Animation hooks. We're using react-spring
   * here but we also have react-transition-group
   * if that takes your fancy.
   */
  const springs = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: {
      duration: 1000,
    }
  });

  /**
   * Local states
   */
  const [latestData, setLatestData] = React.useState<ILatestData | boolean>();
  const [fagIndex, setFagIndex] = React.useState<number>(0);

  /**
   * Fire this once, on load
   */
  useEffect(() => {
    /**
     * Fetch the data from our API
     */
    axios.get('https://api.alternative.me/fng/?limit=1')
      .then((response) => {
        setLatestData(response.data.data[0]);
        setFagIndex(parseInt(response.data.data[0].value));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /**
   * Render ✨
   */
  return (
    <animated.div style={{ backgroundImage: `url(${BackgroundImage})`, height: '100%', ...springs }}>
      <Grid container>
        <Grid xs={12}>
            <Typography mt={5} mb={5} style={{fontFamily: 'Bebas Neue'}} textAlign={'center'} sx={{color: 'white', fontSize: 50}}>{t`title`}</Typography>
        </Grid>
        <Grid xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Chart
              chartType="Gauge"
              data={[
                ['Label', 'Value'],
                ['🤑', fagIndex],
              ]}
              options={guageOptions}
            />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Typography mt={5} fontFamily={'Sora'} textAlign={'center'} fontSize={32} sx={{color: 'white'}}>{t`overview`}</Typography>
          {typeof latestData === 'object' && 'value' in latestData && (
            <Typography mt={2} fontFamily={'Bebas Neue'} textAlign={'center'} fontSize={100} sx={{color: 'white'}}>{latestData.value_classification.toUpperCase()}</Typography>
          )}
          <Typography fontFamily={'Sora'} textAlign={'center'} marginX={10} mb={20} fontSize={32} sx={{color: 'white'}} >{t`greedDescription`}</Typography>
        </Grid>
      </Grid>
    </animated.div>
  );
};

const guageOptions = {
  animation: {
    duration: 2000,
  },
  width: 400,
  height: 400,
  redColor: '#1D2B53',
  redFrom: 0,
  redTo: 40,
  yellowColor: '#7E2553',
  yellowFrom: 40,
  yellowTo: 60,
  greenColor: '#FF004D',
  greenFrom: 60,
  greenTo: 100,
  minorTicks: 5,
};

/**
 * Finally, export your app.
 */
export default App;
