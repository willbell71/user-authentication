// @ts-check
'use strict';

const express = require('express');

const API = require('./api');

/**
 * Express API base class.
 */
class ExpressAPI extends API {
  /**
   * Create express router for API.
   * @param {Logger} logger - logger service.
   */
  constructor(logger) {
    super(logger);
    // can't rename express' interface to statisfy eslint :/
    // eslint-disable-next-line
    this.router = express.Router();
  }
}

module.exports = ExpressAPI;
