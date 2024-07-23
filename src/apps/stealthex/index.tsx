import { Provider } from 'react-redux';
import { store } from './redux/store';

import './lib/styles/global.css';
import './lib/styles/resets.css';
import './lib/styles/simplex.css';
import Preview from './components/exchange/form/steps/exchange/preview/widget';
import { AppContainer } from './styles';


const App = () => {
  return (
    <Provider store={store}>
      <AppContainer>
        <Preview />
      </AppContainer>
    </Provider >
  )
}

export default App;
