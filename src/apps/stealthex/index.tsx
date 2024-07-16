import { Provider } from 'react-redux';
import { store } from './redux/store';

import './lib/styles/global.css';
import './lib/styles/resets.css';
import './lib/styles/simplex.css';
import Preview from './components/exchange/form/steps/exchange/preview/widget';


const App = () => {
  return (
    <Provider store={store}>
        <Preview />
    </Provider >
  )
}

export default App;
