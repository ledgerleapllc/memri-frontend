/* eslint-disable no-lone-blocks */
import React, { useEffect, createContext, useState, Suspense } from 'react';
import { Routes } from "./routes";
// import { useSelector, useDispatch } from "react-redux";
// import { clearApiResponseError } from '@stores/common/actions';
// import { NotificationDialog } from 'shared/partials/dialog/template/NotificationDialog';
import ReactLoading from 'react-loading';
import { DialogProvider } from 'shared/partials/Dialog/Provider';
import { BrowserRouter } from 'react-router-dom';
import { GlobalLayout } from "shared/layouts";
// import { SnackBarProvider, useDialog } from 'shared/partials';
export const AppContext = createContext({})

export const AppLoading = () => (
  <div className="text-primary fixed inset-0 flex items-center justify-center z-40">
    <div className="fixed inset-0 bg-white opacity-40" />
    <ReactLoading
      className="z-50"
      type="spinningBubbles"
      color="currentColor"
      width={100}
      height={100}
    />
  </div>
);

// const Main = ({ children }) => {
//   const dispatch = useDispatch();
//   const apiState = useSelector(state => state.apiControllerReducer);
//   const { appendDialog } = useDialog();

//   useEffect(() => {
//     if (apiState?.hasError) {
//       appendDialog(<NotificationDialog text={apiState?.response?.message || 'Unexpected Error'} />);
//       dispatch(clearApiResponseError());
//     }
//   }, [apiState]);

//   return <>{children}</>;
// }

function App() {
  const [loading, setLoading] = useState();
  const [shouldRefresh, setShouldRefresh] = React.useState(false);

  useEffect(() => {
    document.documentElement.theme = 'light';
    document.body.className = 'theme-light';
    const id = setTimeout(
      () => setShouldRefresh(true), 
      1000 * 60 * 60 * 6
    );
    return () => clearTimeout(id);
  }, []);

  return (
    <BrowserRouter forceRefresh={shouldRefresh}>
      {/* <DialogProvider> */}
        {/* <SnackBarProvider> */}
          <Suspense fallback={null}>
            {/* <Main> */}
              <AppContext.Provider value={{ loading, setLoading }}>
                <DialogProvider>
                  {loading && <AppLoading />}
                  <GlobalLayout />
                  <Routes />
                </DialogProvider>
              </AppContext.Provider>
            {/* </Main> */}
          </Suspense>
        {/* </SnackBarProvider> */}
      {/* </DialogProvider> */}
    </BrowserRouter>
  );
}

export default App;


// missing sidebar setting, gtag, theme
{/* <script
async
src="https://www.googletagmanager.com/gtag/js?id=G-0RQ9PF59K5"
></script>
<script
dangerouslySetInnerHTML={{
  __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0RQ9PF59K5');
  `,
}}
/> */}