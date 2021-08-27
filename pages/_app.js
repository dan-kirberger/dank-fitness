import '../styles/globals.css'
import Layout from '../components/layout'
import appTheme from '../styles/theme'
import { ThemeProvider } from "@material-ui/core/styles";


function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>)
}

export default MyApp
