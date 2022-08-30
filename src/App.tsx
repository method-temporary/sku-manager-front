import React from 'react';
import { Provider } from 'mobx-react';
import Store from './Store';
import Routes from './Routes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import '@nara.drama/approval/lib/snap.css';
import '@nara.drama/depot/lib/snap.css';

// 기존 semantic-ui-react theme
// import './style/css/2.c889ddce.chunk.css';

// 20200713
import './style/css/2.c11f2392.chunk.css';

import './style/css/main.6d5d5583.chunk.css';
import './style/css/style.css';
import './style/app.css';

import { AppInitializer } from 'AppInitializer';
import { AppAccessable } from 'AppAccessable';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Store>
        <Provider>
          <AppInitializer />
          <AppAccessable />
          <Routes />
        </Provider>
      </Store>
      <ReactQueryDevtools
        initialIsOpen={false}
        toggleButtonProps={{
          style: {
            width: '50px',
            height: '50px',
            background: '#eaeaea',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
