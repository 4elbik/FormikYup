import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';
import axios from 'axios';
import { uniqueId, findIndex } from 'lodash';
import { Button, Input, Checkbox, Select, notification } from 'antd';
import Preloader from '../Preloader';
import DynamicSkills from '../DynamicSkills';
import { ADD_NEW_USER_URL } from '../../config';
import './Register.css';

const SignupSchema = yup.object().shape({
  name: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup
    .string()
    .min(8, 'Password is too short - should be 8 chars long minimum')
    .max(40, 'Password is too long - should be less then 40 chars long')
    .matches(/(?=.*[0-9])/, 'Password should contain a number')
    .required('Required'),
  passwordRepeat: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords are not the same')
    .required('Required'),
  age: yup
    .number()
    .required('We need to know how old are you, please write it in range 18 to 65')
    .positive('Minus years old, really?')
    .integer()
    .min(18, 'Sorry, but you just kid')
    .max(65, 'Sorry, but you just old'),
  website: yup.string().url(),
  accept: yup
    .bool()
    .oneOf([true], 'Please check the accept rules and agree with them if you want to continue.'),
});

const { Option } = Select;
const DEFAULT_DOMAIN_PROTOCOL = 'http://';
const DEFAULT_DOMAIN_ZONE = '.com';
const selectBefore = (handleChange) => (
  <Select
    name="domainProtocol"
    defaultValue={DEFAULT_DOMAIN_PROTOCOL}
    className="select-before"
    onChange={handleChange}
  >
    <Option value={DEFAULT_DOMAIN_PROTOCOL}>{DEFAULT_DOMAIN_PROTOCOL}</Option>
    <Option value="https://">https://</Option>
  </Select>
);
const selectAfter = (handleChange) => (
  <Select
    name="domainZone"
    defaultValue={DEFAULT_DOMAIN_ZONE}
    className="select-after"
    onChange={handleChange}
  >
    <Option value={DEFAULT_DOMAIN_ZONE}>{DEFAULT_DOMAIN_ZONE}</Option>
    <Option value=".jp">.jp</Option>
    <Option value=".cn">.cn</Option>
    <Option value=".org">.org</Option>
  </Select>
);
const openSuccessfullNotificationWithIcon = (type) => {
  notification[type]({
    message: 'User successfully registered',
  });
};

class Register extends React.PureComponent {
  state = {
    skills: [{ name: '', id: uniqueId() }],
  };

  onAddSkill = () => {
    this.setState((state) => ({ skills: [...state.skills, { name: '', id: uniqueId() }] }));
  };

  onUpdateSkill = (handleChange) => (updateId, value) => {
    /* eslint-disable */
    this.setState(
      ({ skills }) => {
        const updateElemIdx = findIndex(skills, (skill) => skill.id === updateId);
        const newSkills = [...skills];
        newSkills[updateElemIdx].name = value;
        return { skills: newSkills };
      },
      () => handleChange({ target: { name: 'skills', value: this.state.skills } })
    );
    /* eslint-enable */
  };

  onRemoveSkill = (handleChange) => (removeId) => {
    /* eslint-disable */
    this.setState(
      ({ skills }) => {
        return { skills: skills.filter(({ id }) => id !== removeId) };
      },
      () => handleChange({ target: { name: 'skills', value: this.state.skills } })
    );
    /* eslint-enable */
  };

  onResetSkills = () => {
    this.setState({ skills: [{ name: '', id: uniqueId() }] });
  };

  onChangeDomainProtocol = (handleChangeFormik) => (value) => {
    handleChangeFormik({ target: { name: 'domainProtocol', value } });
  };

  onChangeDomainZone = (handleChangeFormik) => (value) => {
    handleChangeFormik({ target: { name: 'domainZone', value } });
  };

  render() {
    const { skills } = this.state;

    const inputClassName = (field, errors, touched) => {
      return classNames({ error: errors[field] && touched[field] });
    };

    const preloaderClassName = (isSubmitting) => {
      return classNames({
        'submitting-form': isSubmitting,
        'visually-hidden': !isSubmitting,
      });
    };

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
            skills: [],
            accept: true,
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            const { domainProtocol, domainName, domainZone, passwordRepeat, ...newValues } = values;
            if (values.domainName !== '') {
              const website = domainProtocol + domainName + domainZone;
              newValues.website = website;
            }
            const filteredSkillsToBackend = values.skills
              .map((skill) => skill.name)
              .filter((name) => name !== '');
            newValues.skills = filteredSkillsToBackend;
            setSubmitting(true);
            const response = await axios.post(ADD_NEW_USER_URL, newValues);
            setSubmitting(false);
            if (response.data.name === 'ValidationError') {
              setFieldError(response.data.path, response.data.message);
            } else {
              openSuccessfullNotificationWithIcon('success');
              resetForm();
              this.onResetSkills();
            }
          }}
        >
          {(datatatata) => {
            const { values, errors, touched, handleChange, handleBlur, isSubmitting } = datatatata;
            return (
              <Form className="register-form">
                <label>
                  Name:
                  <Input
                    className={inputClassName('name', errors, touched)}
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </label>
                {errors.name && touched.name && <div className="input-feedback">{errors.name}</div>}
                <label>
                  Password:
                  <Input.Password
                    className={inputClassName('password', errors, touched)}
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </label>
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
                <label>
                  Password repeat:
                  <Input.Password
                    className={inputClassName('passwordRepeat', errors, touched)}
                    name="passwordRepeat"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.passwordRepeat}
                  />
                </label>
                {errors.passwordRepeat && touched.passwordRepeat && (
                  <div className="input-feedback">{errors.passwordRepeat}</div>
                )}
                <label>
                  Email:
                  <Input
                    className={inputClassName('email', errors, touched)}
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </label>
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
                <label>
                  Website:
                  <Input
                    className={inputClassName('website', errors, touched)}
                    addonBefore={selectBefore(this.onChangeDomainProtocol(handleChange))}
                    addonAfter={selectAfter(this.onChangeDomainZone(handleChange))}
                    name="domainName"
                    placeholder="mysite"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.domainName}
                  />
                </label>
                {errors.website && touched.website && (
                  <div className="input-feedback">{errors.website}</div>
                )}
                <label>
                  Age:
                  <Input
                    className={inputClassName('age', errors, touched)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="age"
                    value={values.age}
                    maxLength={2}
                  />
                </label>
                {errors.age && touched.age && <div className="input-feedback">{errors.age}</div>}
                <DynamicSkills
                  skills={skills}
                  onAddSkill={this.onAddSkill}
                  onUpdateSkill={this.onUpdateSkill(handleChange)}
                  onRemoveSkill={this.onRemoveSkill(handleChange)}
                />
                <Checkbox
                  className={inputClassName('accept', errors, touched)}
                  name="accept"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={values.accept}
                  style={{ 'margin-bottom': '10px' }}
                >
                  I accept all <a href="/terms">terms</a>
                </Checkbox>
                {errors.accept && touched.accept && (
                  <div className="input-feedback">{errors.accept}</div>
                )}
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <div className={preloaderClassName(isSubmitting)}>
                  <Preloader />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default Register;
