import { ReactComponent as AuthImage } from 'assets/images/card-login.svg';
import { Route, Switch } from 'react-router-dom';
import CardLogin from './CardLogin';
import CardSignup from './CardSignup';
import CardRecover, { PasswordResetToken } from './CardRecover';
import './styles.css';
import CardResetPassword from './CardResetPassword';
import { useState } from 'react';
import { savePasswordResetTokenLocalStorage } from 'util/storage';

type ControlPasswordResetToken = {
  tokenReset: PasswordResetToken;
};

const Auth = () => {
  const [controlPasswordResetToken, setControlPasswordResetToken] =
    useState<ControlPasswordResetToken>({
      tokenReset: { token: '' },
    });

  const handlePasswordResetToken = (data: PasswordResetToken) => {
    setControlPasswordResetToken({ tokenReset: data });
    savePasswordResetTokenLocalStorage(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-banner-container">
        <h1>Sección de Ingreso</h1>
        <p>
          Sé parte de nuestro sistema de catálogo, haga la busqueda de los
          productos que te interesan!
        </p>
        <AuthImage />
      </div>
      <div className="auth-form-container">
        <Switch>
          <Route path="/admin/auth/login">
            <CardLogin />
          </Route>
          <Route path="/admin/auth/signup">
            <CardSignup />
          </Route>
          <Route path="/admin/auth/recover">
            <CardRecover onResetPassword={handlePasswordResetToken} />
          </Route>
          <Route path="/admin/auth/reset-password">
            <CardResetPassword
              passwordResetToken={controlPasswordResetToken.tokenReset.token}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Auth;
