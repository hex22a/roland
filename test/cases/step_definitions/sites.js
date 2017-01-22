import { graphql } from 'graphql'
import schema from '../../../server/api/sites'

const myStepDefinitionsWrapper = function stepDefinition() {
    let site = null;
    this.When(/^User adds site with name: (.*), url: (.*), destinations: (.*)$/, async (name, url, rawDestinations) => {
        const destinations = rawDestinations.split(';');

        const query = `mutation AddSite{ addSite(name: "${name}", destinations: ${JSON.stringify(destinations)} url: "${url}"){ id, name, destinations, url } }`;

        const result = await graphql(schema, query);
        site = result.data.addSite;
        console.log(site);
    });

    this.Then(/^User can get new site as an object$/, async () => {
        if (!site || Object.keys(site).length === 0) {
            throw new Error('No site added!');
        }
    });
};
module.exports = myStepDefinitionsWrapper;