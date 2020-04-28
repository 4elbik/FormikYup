const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const { validURL, validEmail } = require('../src/utilities');
const yup = require('yup');

const app = express();
const port = 8080;

const users = [];

app.use(cors());
// app.use(bodyParser());
app.use(express.json());
app.post('/sign-up', (request, response) => {
  // const { name, password, passwordRepeat, email, website, age, domainName, skills, accept } = request.body;
  const SignupSchema = yup.object().shape({
    name: yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: yup.string()
      .email('Invalid email')
      .required('Required')
      .notOneOf(users.map((user) => user.email), 'User with this email is already register'),
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

  const newUser = {};
  const errors = [];
  SignupSchema.isValid(request.body)
    .then((valid) => {
      if (valid) {
        users.push(request.body);
        response.send(JSON.stringify(users, null, 2));
        return;
      }
      response.send('Sorry, but something go wrong');
    })
    .catch((error) => {
      response.send(error);
    });
  // if (!accept) {
  //   errors.push({ error: 'accept', errorMessage: 'Please check the accept rules and agree with them if you want to continue.' });
  // }
  // if (!validEmail(email)) {
  //   errors.push({ error: 'email', errorMessage: 'Email is not valid' });
  // } else if (users.filter((user) => user.email === email).length > 0) {
  //   errors.push({ error: 'email', errorMessage: 'User with this email adress already exist.' });
  // } else {
  //   newUser.email = email;
  // }
  // if (typeof name === 'string' && (name.length > 3 && name.length <= 50)) {
  //   newUser.name = name;
  // } else {
  //   errors.push({ error: 'name', errorMessage: 'Length of name must be more then 3 symbols and less then 50 simbols.'});
  // }
  // if (password.length === 0) {
  //   errors.push({ error: 'password', errorMessage: 'Empty password.' });
  // }
  // if (passwordRepeat !== password) {
  //   errors.push({ error: 'passwordRepeat', errorMessage: 'Repeat password not the same.' });
  // }
  // if (validURL(website)) {
  //   newUser.website = website;
  // } else if (domainName !== '') {
  //   errors.push({ error: 'websiteURL', errorMessage: 'Website URL is not valid.' });
  // }
  // if (age !== '' && !isNaN(age) && age >= 18 && age <= 60) {
  //   newUser.age = age;
  // } else {
  //   errors.push({ error: 'age', errorMessage: 'Your age must be in range from 18 to 65 & without any symbols.' });
  // }
  // newUser.skills = skills;
  // console.log('Server have a request on add user:', name, 'with email:', email);
  // // response.append('Access-Control-Allow-Origin', '*');
  // // response.setHeader('Access-Control-Allow-Origin', '*');
  // if (errors.length > 0) {
  //   response.send(JSON.stringify(errors, null, 2));
  //   return;
  // } else {
  //   users.push(request.body);
  // }
  // response.send(JSON.stringify(users, null, 2));
})

app.listen(port, () => {
  console.log('Server is started on', port, 'port');
})