#!/usr/bin/env babel-node

import fs from 'fs';
import path from 'path';
import schema from '../server/api/sites';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

(async() => {
	const result = await (graphql(schema, introspectionQuery));
	if (result.errors) {
		console.error(
			'ERROR introspecting schema: ',
			JSON.stringify(result.errors, null, 2)
		);
	} else {
		fs.writeFileSync(
			path.join(__dirname, '../data/schema.json'),
			JSON.stringify(result, null, 2)
		);
	}
})();

fs.writeFileSync(
	path.join(__dirname, '../data/schema.graphql'),
	printSchema(schema)
);
