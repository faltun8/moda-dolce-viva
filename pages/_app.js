import React from 'react';
import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from "react-cookie"

import { Layout } from '../components';
import '../styles/globals.css';
import { StateContext } from '../context/StateContext';

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <StateContext>

        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </CookiesProvider>
  )
}

export default MyApp