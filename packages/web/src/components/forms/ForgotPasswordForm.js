import 'twin.macro';
import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import Button from '../atoms/Button';
import TextInputGroup from '../elements/TextInputGroup';

const formId = 'ForgotPasswordForm';

const ForgotPasswordForm = ({
  values,
  touched,
  errors,
  isSubmitting,
  handleSubmit,
  handleChange,
  handleBlur,
}) => {
  return (
    <form tw="flex flex-wrap" onSubmit={handleSubmit} id={formId}>
      <div tw="p-2 w-full">
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
      <div tw="p-2 w-full">
        <Button type="submit" form={formId} isLoading={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
};

ForgotPasswordForm.defaultProps = {
  enableReinitialize: true,
  initialValues: {},
  onSubmit: () => {},
};
ForgotPasswordForm.propTypes = {
  enableReinitialize: PropTypes.bool,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default withFormik({
  mapPropsToValues: () => ({
    email: '',
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values).finally(() => {
      setSubmitting(false);
    });
  },
  displayName: formId, // helps with React DevTools
})(ForgotPasswordForm);
