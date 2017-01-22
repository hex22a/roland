import r from 'rethinkdb'
import config from 'config'

function connect() {
    return r.connect(config.get('rethinkdb'));
}

// user CRU
export function findUserByEmail(mail, callback) {
    return connect()
        .then(conn => r
                .table('users')
                .filter({ username: mail }).limit(1).run(conn)
                .then((cursor, err) => {
                    if (err) {
                        callback(err);
                    } else {
                        cursor.next((cursorError, row) => {
                            if (cursorError) {
                                callback(null, null);
                            } else {
                                callback(null, row);
                            }
                        });
                    }
                }));
}

export async function findUserById(userId) {
    const connection = await connect();
    return await r
        .table('users')
        .get(userId).run(connection);
}

export async function saveUser(user) {
    const connection = await connect();
    try {
        user.added = new Date();
        const result = await r
            .table('users')
            .insert(user).run(connection);
        user.id = result.generated_keys[0];
        return user;
    } catch (e) {
        console.log(e);
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