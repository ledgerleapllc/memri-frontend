import { Button } from '@shared/partials';
import { useHistory } from 'react-router';
import { login } from '@utils/Thunk';
import { saveUser } from "@redux/actions";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Helper from "@utils/Helper";
import * as yup from 'yup';
import { EMAIL_PATTERN } from '@shared/core/patterns';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AppContext } from '@src/App';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(
      EMAIL_PATTERN,
      "Email is invalid"
    ),
  password: yup
    .string()
    .required('Password is required')
});

const Login = () => {
  const history = useHistory();
  const { setLoading } = useContext(AppContext);
  const {
    formState,
    register,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = data => {
    const { email, password } = data;
    dispatch(
      login(
        email,
        password,
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);

          if (res.success && res.user) {
            const authUser = res.user;
            Helper.storeUser(authUser);
            dispatch(saveUser(authUser));
          }
        }
      )
    );
  };

  return (
    <div data-aos="fade-up" data-aos-duration="800" className="w-500px">
      <form className="w-full items-center flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center capitalize font-normal text-primary mb-4">Sign in</h2>
        <span className="text-gray2 text-base font-light">
          Don’t have an account?
          <Link to="/register" className="pl-2 underline text-primary">Register</Link>
        </span>
        <div className="flex flex-col mt-12 gap-4 w-full items-center">
          <div className="form-control w-full">
            <input placeholder="Email Address" {...register('email')} />
            {formState.errors?.email && (
              <p className="form-error">
                {formState.errors.email?.message}
              </p>
            )}
          </div>
          <div className="form-control w-full">
            <input type="password" placeholder="Password" {...register('password')} />
            {formState.errors?.password && (
              <p className="form-error">
                {formState.errors.password?.message}
              </p>
            )}
          </div>
          <Button className="!w-1" color="primary" type="submit">Sign In</Button>
          <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
        </div>
      </form>
    </div>
  )
}

export default Login;
