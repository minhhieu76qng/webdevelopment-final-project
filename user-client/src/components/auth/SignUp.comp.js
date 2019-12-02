import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as yup from 'yup';
import { Formik } from 'formik';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import '../../assets/scss/AuthForm.scss';

const MESSAGE = {
  required: 'Field is required',
  email: 'Email is not valid',
  min(number) {
    return `Field must be at least ${number} characters`;
  },
  equalTo: 'Password not match',
};

function equalTo(ref, msg) {
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
yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object({
  firstName: yup.string().required(MESSAGE.required),
  lastName: yup.string().required(MESSAGE.required),
  email: yup
    .string()
    .required(MESSAGE.required)
    .email(MESSAGE.email),
  password: yup
    .string()
    .required(MESSAGE.required)
    .trim()
    .min(6, MESSAGE.min(6)),
  confirmPassword: yup
    .string()
    .required(MESSAGE.required)
    .equalTo(yup.ref('password'), MESSAGE.equalTo),
});

const JOB = {
  teacher: 'TEACHER',
  student: 'STUDENT',
};

const SignUpComp = () => {
  const [job, setJob] = useState(null);

  const formSubmit = values => {
    console.log(values);
  };

  const onJobClick = jobValue => {
    if (jobValue === JOB.teacher || jobValue === JOB.student) {
      setJob(jobValue);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={formSubmit}
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <div className='form-wrapper'>
          <Row className='justify-content-center'>
            <Col xs={12} sm={8} md={6} lg={4} style={{ maxWidth: 500 }}>
              <Form noValidate className='form shadow' onSubmit={handleSubmit}>
                <h3 className='form-title'>Get your free account</h3>

                <Form.Row className='mb-3'>
                  <Col>
                    <Form.Control
                      name='firstName'
                      size='sm'
                      type='text'
                      placeholder='First name'
                      value={values.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                      isValid={touched.firstName && !errors.firstName}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Control
                      name='lastName'
                      size='sm'
                      type='text'
                      placeholder='Last name'
                      value={values.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName}
                      isValid={touched.lastName && !errors.lastName}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Row>

                <InputGroup className='mb-3' size='sm'>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name='email'
                    size='sm'
                    type='email'
                    placeholder='Email'
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    isValid={touched.email && !errors.email}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className='mb-3' size='sm'>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name='password'
                    size='sm'
                    type='password'
                    placeholder='Password'
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    isValid={touched.password && !errors.password}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className='mb-3' size='sm'>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name='confirmPassword'
                    size='sm'
                    type='password'
                    placeholder='Confim password'
                    value={values.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    isValid={touched.confirmPassword && !errors.confirmPassword}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>

                <hr style={{ margin: '10px 0' }} />

                <div className='mb-4 job-selection'>
                  <div
                    className='mb-2'
                    style={{ fontWeight: 500, color: '#666', fontSize: 16 }}
                  >
                    I want to:
                  </div>
                  <ButtonGroup className='job-buttons'>
                    <Button
                      className={`button-link reverse ${
                        job && job === JOB.student ? 'active' : ''
                      }`}
                      onClick={() => onJobClick(JOB.student)}
                    >
                      Find a Teacher
                    </Button>
                    <Button
                      className={`button-link reverse ${
                        job && job === JOB.teacher ? 'active' : ''
                      }`}
                      onClick={() => onJobClick(JOB.teacher)}
                    >
                      Work as a Teacher
                    </Button>
                  </ButtonGroup>
                </div>

                <Button
                  type='submit'
                  block
                  className='button-link mb-3'
                  size='sm'
                >
                  Create My Account
                </Button>

                <div
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    Already have account? &nbsp;
                    <Link className='default-link' to='/login'>
                      Sign in
                    </Link>
                  </span>
                  <Link className='default-link' to='/forgot-password'>
                    Don&apos;t remember password?
                  </Link>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </Formik>
  );
};

export default SignUpComp;
