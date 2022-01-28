import { Button, Checkbox } from '@shared/partials';
import { useHistory } from 'react-router';
import { getPreRegisterUserByHash, register as registerApi } from '@utils/Thunk';
import { saveUser } from "@redux/actions";
import { useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Helper from "@utils/Helper";
import * as yup from 'yup';
import { EMAIL_PATTERN, PASSWORD_PATTERN, NAME_PATTERN, FORUM_REGEX } from '@shared/core/patterns';
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
  forum_name: yup
    .string().trim()
    .required('Forum Name is required')
    .matches(
      FORUM_REGEX,
      "Forum Name is invalid"
    ),
  email: yup
    .string().trim()
    .required('Email address is required')
    .matches(
      EMAIL_PATTERN,
      "Email is invalid"
    ),
  email_confirm: yup.string().trim()
    .required('Email address is required')
    .oneOf([yup.ref('email'), null], `Email doesn't match`),
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
  check1: yup.bool().oneOf([true]),
  check2: yup.bool().oneOf([true]),
});

const Signup = () => {
  const history = useHistory();
  const { setLoading } = useContext(AppContext);
  const {
    formState,
    reset,
    register,
    control,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const telegram = register('telegram');
  const location = useLocation();

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    const hash = params.hash;
    if (hash) {
      dispatch(
        getPreRegisterUserByHash(
          hash,
          () => {
            setLoading(true);
          },
          (res) => {
            setLoading(false);
            if (res && res.data && res.data.id) {
              const data = res.data;
              reset({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                email_confirm: data.email,
              });
            }
          }
        )
      );
    }
  }, [])

  const onSubmit = data => {
    let params = {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      company: data?.company.trim(),
      forum_name: data.forum_name.trim(),
      email: data.email.trim(),
      telegram: data.telegram.trim(),
      password: data.password,
      dob: "",
      country_citizenship: "",
      country_residence: "",
      address: "",
      city: "",
      zip: "",
    };

    // Check Existing Guest Key
    const guestKey = Helper.getGuestKey(false);
    if (guestKey) {
      params = {
        ...params,
        guest_key: guestKey,
      };
      Helper.removeGuestKey();
    }

    dispatch(
      registerApi(
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
      <div data-aos="fade-up" data-aos-duration="800" className="auth-container">
        <h2 className="flex items-center capitalize font-normal text-primary mb-4 relative">
          <IconArrowLeft className="absolute -left-16 text-2xl" onClick={history.goBack} />
          New User
        </h2>
        <span className="text-gray2 text-base font-light">
          Fill out the form to register.
        </span>
        <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
            <div className="form-control w-full">
              <input placeholder="Company/Organization" {...register('company')} />
              {formState.errors?.company && (
                <p className="form-error">
                  {formState.errors.company?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <input placeholder="Email *" {...register('email')} />
              {formState.errors?.email && (
                <p className="form-error">
                  {formState.errors.email?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <input placeholder="Confirm Email *" {...register('email_confirm')} />
              {formState.errors?.email_confirm && (
                <p className="form-error">
                  {formState.errors.email_confirm?.message}
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
            <div className="form-control w-full">
              <input placeholder="Forum Name/Pseudonym *" {...register('forum_name')} />
              {formState.errors?.forum_name && (
                <p className="form-error">
                  {formState.errors.forum_name?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <input 
                placeholder="@Telegram"
                onChange={(e) => {
                  e.target.value = Helper.formatTelegram(e.target.value);
                  telegram.onChange(e);
                }}
                value={telegram.value}
                onBlur={telegram.onBlur}
                ref={telegram.ref} 
              />
              {formState.errors?.telegram && (
                <p className="form-error">
                  {formState.errors.telegram?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-6 2xl:mt-12">
            <Controller
              control={control}
              name={'check1'}
              render={({
                field: { onChange, value },
              }) => (
                <Checkbox
                  classText="text-gray2"
                  classCheckBox="text-3xl text-dark"
                  onChange={onChange}
                  value={value}
                  text="I understand that I am registering as a participant and will be allowed to comment and submit proposals. I understand that I will not be allowed to vote or receive grants unless I later pass KYC and electronically sign the necessary documents."
                />
              )}
            />
            <Controller
              control={control}
              name={'check2'}
              render={({
                field: { onChange, value },
              }) => (
                <Checkbox
                  classText="text-gray2"
                  classCheckBox="text-3xl text-dark"
                  onChange={onChange}
                  value={value}
                  text="I am not a citizen or resident of any of the following countries - Balkans, Belarus, Burma, Cote D’Ivoire (Ivory Coast), Cuba, Democratic Republic of Congo, Iran, Iraq, Liberia, North Korea, Sudan, Syria, or Zimbabwe."
                />
              )}
            />
          </div>
          <div>
            <Button className="mt-6 2xl:mt-12" color="primary" type="submit">Register</Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Signup;
