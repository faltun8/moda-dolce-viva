import React from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from "react-cookie"

import { Layout } from '../components';
import '../styles/globals.css';
import { StateContext } from '../context/StateContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page for any unknown routes
    if (router.asPath !== '/' && !router.asPath.startsWith('/_next')) {
      router.push('/');
    }
  }, []);
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