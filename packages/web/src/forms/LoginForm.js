import 'twin.macro';
import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import Button from '../atoms/Button';
import TextInputGroup from '../elements/TextInputGroup';

const formId = 'LoginForm';

const LoginForm = ({
  values,
  touched,
  errors,
  isSubmitting,
  handleSubmit,
  handleChange,
  handleBlur,
}) => {
  return (
    <form tw="flex flex-wrap -m-2" onSubmit={handleSubmit} id={formId}>
      <div tw="p-2 w-1/2">
        <TextInputGroup
          label="Your Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email && touched.email ? errors.email : undefined}
        />
      </div>
      <div tw="p-2 w-1/2">
        <TextInputGroup
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.password && touched.password ? errors.password : undefined
          }
        />
      </div>
      <div tw="p-2 w-full">
        <Button type="submit" form={formId} isLoading={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: Yup.string().required('Password is required!').min(6),
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values).finally(() => {
      setSubmitting(false);
    });
  },
  displayName: formId, // helps with React DevTools
})(LoginForm);
