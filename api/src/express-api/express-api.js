// @ts-check
'use strict';

const express = require('express');

/**
 * Express API base class.
 */
class ExpressAPI {
  /**
   * Create express router for API.
   */
  constructor() {
    // can't rename express' interface to statisfy eslint :/
    // eslint-disable-next-line
    this.router = express.Router();
  }
}

module.exports = ExpressAPI;
