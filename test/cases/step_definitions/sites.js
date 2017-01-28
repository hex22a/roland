import { graphql } from 'graphql'
import schema from '../../../server/api/sites'
import request from 'request'


const myStepDefinitionsWrapper = function stepDefinition() {
    let site = null;
    this.When(/^User adds site with name: (.*), url: (.*), destinations: (.*)$/, async (name, url, rawDestinations) => {
        const destinations = rawDestinations.split(';');

        const operationName = 'AddSite';
        const query = `mutation ${operationName} { addSite(name: "${name}", destinations: ${JSON.stringify(destinations)} url: "${url}"){ id, name, destinations, url, foo } }`;

        const payload = { operationName, query};
        console.log(payload);

        await request({
            method: 'post',
            url: 'http://localhost:3000/graphql',
            json: true,
            headers: {
                Authorization: 'fofofof'
            },
            body: payload
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            } else {
                console.log(response);
                console.log(body);
            }
        })
    });

    this.Then(/^User can get new site as an object$/, async () => {
        if (!site || Object.keys(site).length === 0) {
            throw new Error('No site added!');
        }
    });
};
module.exports = myStepDefinitionsWrapper;