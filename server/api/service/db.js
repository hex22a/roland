import r from 'rethinkdb'
import config from 'config'

function connect() {
    return r.connect(config.get('rethinkdb'));
}

// user CRU
export async function getUser(userId) {
    const connection = await connect();
    return await r
        .table('users')
        .get(userId).run(connection);
}

export async function saveUser(user) {
    const connection = await connect();
    user.added = new Date();
    const qResult = await r
        .table('users')
        .insert(user).run(connection);
    if (!qResult.inserted) {
        throw new Error(`Errors ${qResult.errors}`)
    } else {
        return user;
    }
}

// sites

export async function getSite(siteId) {
    const connection = await connect();
    return await r
        .table('sites')
        .get(siteId).run(connection);
}

export async function saveSite(site) {
    const connection = await connect();
    try {
        site.added = new Date();
        const result = await r
            .table('sites')
            .insert(site).run(connection);
        site.id = result.generated_keys[0];
        return site;
    } catch (e) {
        console.log(e);
        return site;
    }
}