'use strict';

let dbm;
let type;
let seed;
const fs = require('fs');
const path = require('path');

exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    var filePath = path.join(__dirname, 'sqls', '20200910142917-add-user-relationship-table-up.sql');
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) return reject(err);
            console.log('received data: ' + data);

            resolve(data);
        });
    }).then(function (data) {
        return db.runSql(data);
    });
};

exports.down = function (db) {
    var filePath = path.join(__dirname, 'sqls', '20200910142917-add-user-relationship-table-down.sql');
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) return reject(err);
            console.log('received data: ' + data);

            resolve(data);
        });
    }).then(function (data) {
        return db.runSql(data);
    });
};

exports._meta = {
    version: 1,
};
