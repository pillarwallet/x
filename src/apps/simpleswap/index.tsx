import { Provider } from 'react-redux';
import Bootstrap from './Bootstrap';
import Widget from './app.pages.widget';
import createStore from './redux/configureStore';
import { InformationProvider } from './contexts/InformationContext';
import { ExchangeProvider } from './contexts/ExchangeContext';
const store = createStore();

const Index = () => {
  return (
      <Provider store={store}>
        <InformationProvider>
          <Bootstrap>
              <ExchangeProvider>
                  <Widget />
              </ExchangeProvider>
          </Bootstrap>
        </InformationProvider>
      </Provider>
  );
};

export default Index;
