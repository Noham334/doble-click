import './styles.css';
import { ReactComponent as RevealPass } from '../../../../assets/images/reveal-password-icon.svg';
import { ReactComponent as HiddenPass } from '../../../../assets/images/hidden-password-icon.svg';
import { AxiosRequestConfig } from 'axios';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';
import { getValue } from '@testing-library/user-event/dist/utils';
import {
  getPasswordResetTokenLocalStorage,
  removePasswordResetTokenLocalStorage,
} from 'util/storage';
import { useState } from 'react';

type ResetPassword = {
  password: string;
};

type Props = {
  passwordResetToken: string;
};

const CardResetPassword = ({ passwordResetToken }: Props) => {
  const history = useHistory();
  const [inputTypePass, setInputTypePass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ResetPassword>();

  const onSubmit = (formData: ResetPassword) => {
    const data = {
      ...formData,
    };

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/users/reset-password',
      data,
      params: {
        token: getPasswordResetTokenLocalStorage().token,
      },
    };

    requestBackend(config)
      .then(() => {
        toast.info('Se alteró la contraseña');
        history.push('/admin/auth/login');
        removePasswordResetTokenLocalStorage();
      })
      .catch(() => {
        toast.error('Error al Alterar contraseña');
      });
  };

  const handleCancel = () => {
    history.push('/admin/auth/login');
  };

  const revealPassword = (event: React.InputHTMLAttributes<InputEvent>) => {
    inputTypePass === false ? setInputTypePass(true) : setInputTypePass(false);
  };

  const confirmPassword = () => {
    const newPassword = document.getElementById('nPassword');
    const confPassword = document.getElementById('cPassword');

    if (getValue(confPassword) !== '') {
      !(
        (getValue(confPassword) as String) === (getValue(newPassword) as String)
      )
        ? setError('password', {
            type: 'validate',
            message: 'Las contraseñas no coinciden!',
          })
        : clearErrors('password');
    }
  };

  return (
    <div className="base-card reset-password-card-container">
      <div className="reset-password-card-form-container">
        <h1>CREAR NUEVA CONTRASEÑA</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="reset-password-card-input-content">
            <div className="reset-password-card-input-container">
              <input
                {...register('password', {
                  required: 'Campo Obligatorio!',
                })}
                id="nPassword"
                type={inputTypePass ? 'text' : 'password'}
                className={`form-control reset-password-card-input ${
                  errors.password ? 'is-invalid' : ''
                }`}
                placeholder="Ingrese una nueva contraseña"
                name="password"
              />
              <span className="reset-password-card-reveal-icon">
                <button type="button" onClick={revealPassword}>
                  {inputTypePass ? <HiddenPass /> : <RevealPass />}
                </button>
              </span>
            </div>
            <div className="invalid-feedback d-block">
              {errors.password?.message}
            </div>
          </div>

          <div className="reset-password-card-input-content">
            <div className="reset-password-card-input-container">
              <input
                id="cPassword"
                type={inputTypePass ? 'text' : 'password'}
                className={`form-control reset-password-card-input ${
                  errors.password ? 'is-invalid' : ''
                }`}
                placeholder="Confirma su nueva contraseña"
                name="confPassword"
                onChange={confirmPassword}
              />
              <span className="reset-password-card-reveal-icon">
                <button type="button" onClick={revealPassword}>
                  {inputTypePass ? <HiddenPass /> : <RevealPass />}
                </button>
              </span>
            </div>
            <div className="invalid-feedback d-block">
              {errors.password?.message}
            </div>
          </div>

          <div className="reset-password-card-buttons-container">
            <button className="btn btn-primary reset-password-card-button text-white">
              ENVIAR
            </button>
            <button
              className="btn btn-outline-danger reset-password-card-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardResetPassword;
