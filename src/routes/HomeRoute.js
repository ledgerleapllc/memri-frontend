import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";

const AuthView = lazy(() => import("pages/app/Auth"));
const WelcomeView = lazy(() => import("pages/welcome/Welcome"));

export default function HomeRoute({ auth, ...rest }) {
  return (
    <Suspense fallback={null}>
      <Route
        {...rest}
        render={() => (!auth || !auth.id ? <WelcomeView /> : <AuthView />)}
      />
    </Suspense>
  );
}
