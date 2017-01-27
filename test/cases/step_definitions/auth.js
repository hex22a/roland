/**
 * Created by x22a on 02.10.16.
 * Auth step definition
 */

import XHR from 'xmlhttprequest';
import jwt from 'jsonwebtoken';
import config from 'config';

import Browser from '../../utils/Browser'

const XMLHttpRequest = XHR.XMLHttpRequest;

import { graphql } from 'graphql'
import schema from '../../../server/api/user'

const myStepDefinitionsWrapper = function stepDefinition() {
    const browser = Browser.instance;

    let logout = false;

    this.When(/^I sent GET request to \/logout$/, () => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `http://${config.express.host}:${config.express.port}/logout`, false);
        xhr.send();

        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            logout = JSON.parse(xhr.responseText).logout;
        }
    });

    this.Then(/^I get response with flag to deauthenticate user$/, () => {
        if (!logout) {
            throw new Error('No logout flag')
        }
    });

    this.When(/^I send POST request to login with username: (.*) and password: (.*)$/, (email, password) => {
        const xhr = new XMLHttpRequest();

        const user = JSON.stringify({ user: {
            id: email,
            password
        }
        });

        xhr.open('POST', `http://${config.express.host}:${config.express.port}/openapi/v1/login`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(user);

        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            browser.setToken(JSON.parse(xhr.responseText).token);
        }
    });

    this.Then(/^I get valid JWT token$/, () => {
        /** @namespace config.jwtSecret */
        jwt.verify(browser.getToken(), config.jwtSecret, err => {
            if (err) {
                throw new Error('Corrupt token')
            }
        });
    });

    this.When(/^I send POST request to register with (.*) and (.*) to register$/, async (email, password) => {
        const query = `mutation AddUser{ addUser(id: "${email}", password: "${password}"){ user { id }, errors } }`;

        const result = await graphql(schema, query);
        if (result.error && result.errors.length > 0) {
            throw new Error(`Errors: ${result.errors}`);
        } else if (result.data.addUser.user) {
            console.log(result.data.addUser.user);
        } else {
            throw new Error(`Errors: ${result.data.addUser.errors}`);
        }
    });

    this.When(/^I send POST request to register with (.*) and (.*) to get error message$/, async (email, password) => {
        const query = `mutation AddUser{ addUser(id: "${email}", password: "${password}"){ user { id }, errors } }`;

        const result = await graphql(schema, query);
        if (result.error && result.errors.length > 0) {
            throw new Error(`Errors: ${result.errors}`);
        } else if (result.data.addUser.user) {
            throw new Error(`User saved! ${result.data.addUser.user}`)
        } else {
            console.log(result.data.addUser.errors);
        }
    });

    this.Then(/^I can access new user by (.*)$/, async email => {
        const query = `query GetUser { user (id: "${email}") { id } }`;

        const result = await graphql(schema, query);
        if (result.errors && result.errors.length > 0) {
            throw new Error(`Errors: ${result.errors}`);
        } else {
            console.log(result.data);
        }
    });
};
module.exports = myStepDefinitionsWrapper;