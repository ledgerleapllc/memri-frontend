import { Button } from '@shared/partials';
import { useHistory } from 'react-router';
import { registerAdmin } from '@utils/Thunk';
import { saveUser } from "@redux/actions";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Helper from "@utils/Helper";
import * as yup from 'yup';
import { PASSWORD_PATTERN, NAME_PATTERN } from '@shared/core/patterns';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AppContext } from '@src/App';
import { ReactComponent as IconArrowLeft } from '@assets/icons/ic-arrow-left.svg';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import qs from "qs";

const schema = yup.object().shape({
  first_name: yup
    .string().trim()
    .required('First Name is required')
    .matches(
      NAME_PATTERN,
      "First Name is invalid"
    ),
  last_name: yup
    .string().trim()
    .required('Last Name is required')
    .matches(
      NAME_PATTERN,
      "Last Name is invalid"
    ),
  password: yup
    .string().trim()
    .required('Password is required')
    .matches(
      PASSWORD_PATTERN,
      "Please use a password with at least 8 characters including at least one number, one letter and one symbol"
    ),
  password_confirm: yup.string().trim()
    .required('Password is required')
    .oneOf([yup.ref('password'), null], `Password doesn't match`),
});

const SignupAdmin = () => {
  const history = useHistory();
  const { setLoading } = useContext(AppContext);
  const {
    formState,
    reset,
    register,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { email, code } = params;
    reset({
      email,
      code
    });
  }, [])

  const onSubmit = data => {
    let params = {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      password: data.password,
      email: data.email,
      code: data.code,
    };

    dispatch(
      registerAdmin(
        params,
        () => {
          setLoading(true);
        },
        (res) => {
          setLoading(false);
          if (res.success && res.user) {
            Helper.storeUser(res.user);
            dispatch(saveUser(res.user));
          }
        }
      )
    );
  };

  return (
    <>
      <div data-aos="fade-up" data-aos-duration="800" className="auth-container h-4/5">
        <h2 className="flex items-center capitalize font-normal text-primary mb-4 relative">
          <IconArrowLeft className="absolute -left-16 text-2xl" onClick={history.goBack} />
          New Admin
        </h2>
        <span className="text-gray2 text-base font-light">
          Fill out the form to register.
        </span>
        <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} hidden />
          <input {...register('code')} hidden />
          <div className="mt-6 2xl:mt-12 w-full gap-x-40 gap-y-2 xl:gap-y-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div className="form-control w-full">
              <input placeholder="First Name *" {...register('first_name')} />
              {formState.errors?.first_name && (
                <p className="form-error">
                  {formState.errors.first_name?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <input placeholder="Last Name *" {...register('last_name')} />
              {formState.errors?.last_name && (
                <p className="form-error">
                  {formState.errors.last_name?.message}
                </p>
              )}
            </div>
            <div className="hidden xl:block" />
            <div className="form-control w-full">
              <input type="password" placeholder="Create Password *" {...register('password')} />
              {formState.errors?.password && (
                <p className="form-error">
                  {formState.errors.password?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <input type="password" placeholder="Create Password *" {...register('password_confirm')} />
              {formState.errors?.password_confirm && (
                <p className="form-error">
                  {formState.errors.password_confirm?.message}
                </p>
              )}
            </div>
            <div className="hidden xl:block" />
          </div>
          <div>
            <Button className="mt-6 2xl:mt-12" color="primary" type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignupAdmin;
