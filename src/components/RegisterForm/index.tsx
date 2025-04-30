import { Link } from 'react-router-dom';

import { RouteNames } from '@/constants/routeNames';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { RegisterSchema } from '@/schemas/RegisterSchema';

import { InputField } from '../shared/InputField';

export const RegisterForm = () => {
  const formik = useForm({
    schema: RegisterSchema,
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit(values, formikHelpers) {
      console.log(values, formikHelpers);

      formikHelpers.resetForm();
    },
  });

  return (
    <div className="login-page__container">
      <h2 className="login-page__title">Welcome</h2>
      <p className="login-page__subtitle">Register to continue</p>

      <form onSubmit={formik.handleSubmit}>
        <InputField
          id="name"
          name="name"
          label="Full Name"
          className="mb-4"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'name')}
        />

        <InputField
          id="email"
          name="email"
          label="Email"
          className="mb-4"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={getFormikError(formik, 'email')}
        />

        <InputField
          id="password"
          name="password"
          label="Password"
          className="mb-4"
          value={formik.values.password}
          type="password"
          onChange={formik.handleChange}
          error={getFormikError(formik, 'password')}
        />

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          className="mb-2"
          value={formik.values.confirmPassword}
          type="confirmPassword"
          onChange={formik.handleChange}
          error={getFormikError(formik, 'confirmPassword')}
        />

        <Link to={RouteNames.Login} className="login-page__forgot-password">
          Return to Login
        </Link>

        <button type="submit" className="login-page__login-btn">
          Register
        </button>
      </form>

      <p className="login-page__copyright-text">
        © {new Date().getFullYear()} DoSA Safety Enhancements Inc TM
      </p>
    </div>
  );
};
