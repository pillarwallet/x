import { Provider } from 'react-redux';
import { store } from './redux/store';

import './lib/styles/global.css';
import Preview from './components/exchange/form/steps/exchange/preview/widget';
import { AppContainer } from './styles';


const App = () => {
  return (
        <div className='stealth-root'>
          <Provider store={store}>
            <AppContainer>
              <Preview />
            </AppContainer>
          </Provider >
        </div>
  )
}

export default App;
