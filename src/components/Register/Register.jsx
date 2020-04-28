import React from 'react';
import { Formik, Form, Field } from 'formik';
import DynamicInput from '../DymanicInput';
import * as yup from 'yup';
import axios from 'axios';
import { Button, Input, Checkbox, Select } from 'antd';
// import { PoweroffOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './Register.css';


const SignupSchema = yup.object().shape({
  name: yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: yup.string()
    .email('Invalid email')
    .required('Required'),
  password: yup.string()
    .min(8, 'Password is too short - should be 8 chars long minimum')
    .max(40, 'Password is too long - should be less then 40 chars long')
    .matches(/(?=.*[0-9])/, 'Password should contain a number')
    .required('Required'),
  passwordRepeat: yup.string()
    .oneOf([yup.ref('password')], 'Passwords are not the same')
    .required('Required'),
  age: yup.number()
    .required('We need to know how old are you, please write it in range 18 to 65')
    .positive('Minus years old, really?')
    .integer()
    .min(18, 'Sorry, but you just kid')
    .max(65, 'Sorry, but you just old'),
  website: yup.string().url(),
  accept: yup.bool().oneOf([true], 'Please check the accept rules and agree with them if you want to continue.'),
});

const { Option } = Select;
const DEFAULT_DOMAIN_PROTOCOL = 'http://';
const DEFAULT_DOMAIN_ZONE = '.com';
const selectBefore = (handleChange) => (
  <Field component="select" name="domainProtocol" defaultValue={DEFAULT_DOMAIN_PROTOCOL} className="select-before" onChange={handleChange}>
    <option value={DEFAULT_DOMAIN_PROTOCOL}>{DEFAULT_DOMAIN_PROTOCOL}</option>
    <option value="https://">https://</option>
  </Field>
);
const selectAfter = (handleChange) => (
  <Field component="select" name="domainZone" defaultValue={DEFAULT_DOMAIN_ZONE} className="select-after" onChange={handleChange}>
    <option value={DEFAULT_DOMAIN_ZONE}>{DEFAULT_DOMAIN_ZONE}</option>
    <option value=".jp">.jp</option>
    <option value=".cn">.cn</option>
    <option value=".org">.org</option>
  </Field>
);

class Register extends React.Component {
  state = {
    skills: [],
  }

  onFinishDynamicInputSkills = ({ skills }) => {
    this.setState({ skills });
  }

  render() {
    const { skills } = this.state;

    return (
      <div className="register-wrapper">
        <Formik
          initialValues={{
            name: '',
            password: '',
            passwordRepeat: '',
            email: '',
            domainProtocol: DEFAULT_DOMAIN_PROTOCOL,
            domainName: '',
            domainZone: DEFAULT_DOMAIN_ZONE,
            age: '',
            skills: skills,
            accept: true,
          }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (values.domainName !== '') {
              const website = values.domainProtocol + values.domainName + values.domainZone;
              values.website = website;
            }
            setSubmitting(true);
            axios.post('http://127.0.0.1:8080/sign-up', values).then((response) => console.log(response, 'ОТВЕТ!!!'));
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <div className={isSubmitting ? 'submitting-form' : ''}>
              <Form className="register-form">
                <label>
                  Name:
                  <Input className={errors.name && touched.name && 'error'} name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                </label>
                {errors.name && touched.name && (<div className="input-feedback">{errors.name}</div>)}
                <label>
                  Password:
                  <Input.Password className={errors.password && touched.password && 'error'} placeholder="NotQWERTY" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                </label>
                {errors.password && touched.password && (<div className="input-feedback">{errors.password}</div>)}
                <label>
                  Password repeat:
                  <Input.Password className={errors.passwordRepeat && touched.passwordRepeat && 'error'} name="passwordRepeat" onChange={handleChange} onBlur={handleBlur} value={values.passwordRepeat} />
                </label>
                {errors.passwordRepeat && touched.passwordRepeat && (<div className="input-feedback">{errors.passwordRepeat}</div>)}
                <label>
                  Email:
                  <Input className={errors.email && touched.email && 'error'} name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                </label>
                {errors.email && touched.email && (<div className="input-feedback">{errors.email}</div>)}
                <label>
                  Website:
                  <Input className={errors.website && touched.website && 'error'} addonBefore={selectBefore(handleChange)} addonAfter={selectAfter(handleChange)} name="domainName" placeholder="mysite" onChange={handleChange} onBlur={handleBlur} value={values.domainName} />
                </label>
                {errors.website && touched.website && (<div className="input-feedback">{errors.website}</div>)}
                <label>
                  Age:
                  <Input
                    className={errors.age && touched.age && 'error'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="age"
                    value={values.age}
                    maxLength={2}
                  />
                </label>
                {errors.age && touched.age && (<div className="input-feedback">{errors.age}</div>)}
                <DynamicInput onFinishDynamicInputSkills={this.onFinishDynamicInputSkills} onChangeRegister={(skills) => handleChange({ target: { name: "skills", value: skills } })} />
                <Checkbox className={errors.accept && touched.accept && 'error'} name="accept" onChange={handleChange} onBlur={handleBlur} checked={values.accept}>
                  I accept all <a href="#">terms</a>
                </Checkbox>
                {errors.accept && touched.accept && (<div className="input-feedback">{errors.accept}</div>)}

                <button type="submit">
                  Submit
                </button>
                <pre>
                  { JSON.stringify(values, null, 2) }
                </pre>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    );
  }
};

export default Register;