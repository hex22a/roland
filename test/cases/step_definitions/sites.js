import { graphql } from 'graphql'
import schema from '../../../server/api/sites'

const myStepDefinitionsWrapper = function stepDefinition() {
    this.When(/^User adds site with name: (.*), url: (.*), destinations: (.*)$/, async (name, url, rawDestinations) => {
        const destinations = rawDestinations.split(';');

        const query = `mutation AddSite{ addSite(name: "${name}", destinations: ${JSON.stringify(destinations)} url: "${url}"){ id, name, destinations, url } }`;

        const result = await graphql(schema, query);
        console.log(result);
    });
};
module.exports = myStepDefinitionsWrapper;