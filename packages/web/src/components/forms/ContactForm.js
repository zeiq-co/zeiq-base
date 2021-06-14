import 'twin.macro';
import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import Button from '../atoms/Button';
import TextInputGroup from '../elements/TextInputGroup';
import TextAreaGroup from '../elements/TextAreaGroup';

const formId = 'ContactForm';

const ContactForm = ({
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
          label="Your Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name && touched.name ? errors.name : undefined}
        />
      </div>
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
      <div tw="p-2 w-full">
        <TextAreaGroup
          label="Your Message"
          name="message"
          type="message"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.message && touched.message ? errors.message : undefined}
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
    name: '',
    email: '',
    message: '',
  }),
  validationSchema: Yup.object().shape({
    name: Yup.string().required('Name is required!'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    message: Yup.string().required('Message is required!'),
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    console.log('handleSubmit', values);
    props.onSubmit(values).finally(() => {
      setSubmitting(false);
    });
  },
  displayName: formId, // helps with React DevTools
})(ContactForm);
