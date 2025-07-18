import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import store, { persistor } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <LayoutProvider>
            <App />
          </LayoutProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
