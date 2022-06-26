import * as React from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import '../styles/globals.css'
import {Slide, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Provider} from "react-redux";
import store from "../src/app/store";
import {CircularProgress} from "@mui/material";

// let persistor = persistStore(store);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>سجلَات المُحايد</title>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <meta name="description" content="Al Muhaid Redocrds"/>
                <link rel="icon" href="/mceicon.png"/>
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <Provider store={store}>
                    {/*<PersistGate loading={null} persistor={persistor}>*/}
                    {loading ? <CircularProgress
                            sx={{
                                width: '100vw',
                                height: '100vh',
                                marginLeft: {xs: '40%'},
                                marginTop: {xs: '80%', sm: '40%', md: '20%', lg: '15%'}
                            }} thickness={4} size={'20%'} color={'secondary'}/> :
                        <Component {...pageProps} />
                    }
                    {/*</PersistGate>*/}
                </Provider>
                <ToastContainer position={'bottom-right'} theme={'colored'} draggable={false} pauseOnHover={true}
                                closeOnClick={true} rtl={true} transition={Slide}
                                style={{fontFamily: 'El Messiri', textAlign: 'center'}}/>
            </ThemeProvider>
        </CacheProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
}