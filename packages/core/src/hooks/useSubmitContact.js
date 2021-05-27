import { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import swal from 'sweetalert';

const mutation = gql`
  mutation contact($input: ContactInput!) {
    contact(input: $input) {
      success
    }
  }
`;

const useSubmitContact = () => {
  const [execute, { data, error, loading }] = useMutation(mutation);

  useEffect(() => {
    if (error) {
      swal(error.message);
    }
    if (data && data.contact) {
      swal('Message sent!');
    }
  }, [error, data]);

  const handleSubmit = async (values) => {
    console.log('useSubmitContact.js');
    await execute({ variables: { input: values } });
  };

  return [handleSubmit, { data, error, loading }];
};

export default useSubmitContact;
