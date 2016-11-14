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

export function findUserById(userId, callback) {
    return connect()
        .then(conn => r
                .table('users')
                .get(userId).run(conn)
                .then((result, err) => {
                    if (err) {
                        callback(null, null);
                    } else {
                        callback(null, result);
                    }
                }));
}

export function saveUser(user, callback) {
    return connect()
        .then(conn => {
            user.regDate = new Date();
            return r
                .table('users')
                .insert(user).run(conn)
                .then((result, err) => {
                    if (err) {
                        callback(err);
                    }
                    return (result.inserted === 1) ? callback(null, true, result.generated_keys[0]) : callback(null, false);
                });
        });
}

export function saveSite(site, callback) {
    return connect()
        .then(conn => {
            site.added = new Date();
            return r
                .table('sites')
                .insert(site).run(conn)
                .then((result, err) => {
                    if (err) {
                        callback(err);
                    }
                    return (result.inserted === 1) ? callback(null, true, result.generated_keys[0]) : callback(null, false);
                });
        });
}