import 'tailwindcss/tailwind.css'
import "prismjs/themes/prism-tomorrow.css";
import type { AppProps } from 'next/app'

//import CommandK from 'components/CommandK';

function MyApp({ Component, pageProps }: AppProps) {
  /*
  const config = {
    token: "token",
    // manual hotkeys, nested commands etc
    sources: {
      greets: async (query: string) => {
        const hits = [{
          title: "jonte"          
        },{
          title: "jon",
          hotkeys: "jo"
        }];

        return new Promise((res) => setTimeout(() => res(hits), 500));
      }
    }
  }
   */
  return (
    <>
      {/*<CommandK config={config} />*/}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
