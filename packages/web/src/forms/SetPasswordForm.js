import 'twin.macro';
import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import Button from '../atoms/Button';
import TextInputGroup from '../elements/TextInputGroup';

const formId = 'SetPasswordForm';

const SetPasswordForm = ({
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
          label="New Password"
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
    password: '',
  }),
  validationSchema: Yup.object().shape({
    password: Yup.string().min(6).required('Password is required!'),
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values).finally(() => {
      setSubmitting(false);
    });
  },
  displayName: formId, // helps with React DevTools
})(SetPasswordForm);
