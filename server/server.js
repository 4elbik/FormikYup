const express = require('express');
const cors = require('cors');
const yup = require('yup');

const app = express();
const port = 8080;

const users = [];

app.use(cors());
app.use(express.json());
app.post('/sign-up', (request, response) => {
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
    age: yup.number()
      .required('We need to know how old are you, please write it in range 18 to 65')
      .positive('Minus years old, really?')
      .integer()
      .min(18, 'Sorry, but you just kid')
      .max(65, 'Sorry, but you just old'),
    website: yup.string().url(),
    accept: yup.bool().oneOf([true], 'Please check the accept rules and agree with them if you want to continue.'),
  });

  SignupSchema.validate(request.body)
    .then((valid) => {
      if (valid) {
        users.push(request.body);
        response.send(JSON.stringify(users, null, 2));
        return;
      }
    })
    .catch((error) => {
      response.send(error);
    });
})

app.listen(port, () => {
  console.log('Server is started on', port, 'port');
})