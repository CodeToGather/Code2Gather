/* eslint-disable @typescript-eslint/no-var-requires */
import { createStore } from 'redux';

import rootReducer from 'reducers/rootReducer';

const store = createStore(rootReducer);

// Settings to aid development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('reducers/rootReducer', () => {
    const newRootReducer = require('reducers/rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
