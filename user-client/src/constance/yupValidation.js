import * as yup from 'yup';

export const MESSAGE = {
  required: 'Field is required',
  email: 'Email is not valid',
  min(number) {
    return `Field must be at least ${number} characters`;
  },
  equalTo: 'Password not match',
};

export function equalTo(ref, msg) {
  return yup.mixed().test({
    name: 'equalTo',
    exclusive: false,
    /* eslint no-template-curly-in-string: "off" */
    message: msg || '${path} must be the same as ${reference}',
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}
