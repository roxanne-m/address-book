'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const { v4: uuid } = require('uuid');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

const address = [
  {
    id: 'ce20079c-2326-4f17-8ac4-f617bfd28b7f',
    firstName: 'Roxy',
    lastName: 'Cantu',
    address1: '1234 Forrest Ave',
    address2: '5678 Little Lane',
    city: 'Whoville',
    state: 'LA',
    zip: 90210,
  },
];

// GET REQUEST
app.get('/address', (req, res) => {
  res.json(address);
});

// POST REQUEST
app.post('/address', (req, res) => {
  const {
    firstName,
    lastName,
    address1,
    address2 = false,
    city,
    state,
    zip,
  } = req.body;

  // validation code here
  if (!firstName) {
    return res.status(400).send('First name required.');
  }

  if (!lastName) {
    return res.status(400).send('Last name required.');
  }

  if (!address1) {
    return res.status(400).send('Address required.');
  }

  if (!city) {
    return res.status(400).send('City required.');
  }

  if (!state) {
    return res.status(400).send('State is required.');
  }

  if (!zip) {
    return res.status(400).send('Zip code is required.');
  }

  if (state.length < 2) {
    return res.status(400).send('State must be at least two characters.');
  }

  if (zip.length !== 5) {
    return res.status(400).send('Zip code must be at least 5 digits.');
  }

  const id = uuid();

  const newContact = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };

  address.push(newContact);

  res.status(201).location(`http://localhost:8000/address/${id}`).json({id: id});
  res.send('All validations passed.');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
