import rdash from 'rethinkdbdash'
import config from 'config'

const r = rdash(config.get('rethinkdb'));

// user CRU
export async function getUser(userId) {
	return await r
        .table('users')
        .get(userId).run();
}

export async function saveUser(user) {
	user.added = new Date();
	const qResult = await r
        .table('users')
        .insert(user).run();
	if (!qResult.inserted) {
		throw new Error(`Errors ${qResult.errors}`)
	} else {
		return user;
	}
}

// sites

export async function getSite(siteId) {
	return await r
        .table('sites')
        .get(siteId).run();
}

export async function saveSite(site) {
	try {
		site.added = new Date();
		const result = await r
            .table('sites')
            .insert(site).run();
		site.id = result.generated_keys[0];
		return site;
	} catch (e) {
		return site;
	}
}

export async function updateSite(site) {
	await r
        .table('sites')
        .update(site).run();
	return site;
}

export async function deleteSite(id) {
	return await r
        .table('sites')
        .get(id).delete().run();
}