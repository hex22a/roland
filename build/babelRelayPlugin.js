/**
 * Created by x22a on 05.02.17.
 */

const getbabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../data/schema.json');

module.exports = getbabelRelayPlugin(schema.data);