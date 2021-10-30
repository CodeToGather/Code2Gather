import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from 'app/store';
import AppProviders from 'contexts/AppProviders';

import App from './app';
import reportWebVitals from './reportWebVitals';
import 'react-loading-skeleton/dist/skeleton.css';
import './index.scss';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppProviders>
          <SkeletonTheme baseColor="#24282D" highlightColor="#34383d">
            <App />
          </SkeletonTheme>
        </AppProviders>
      </PersistGate>
    </Provider>
  </StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
