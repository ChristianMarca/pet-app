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
    const filePath = path.join(__dirname, 'sqls', '20200820185318-add-user-table-up.sql');
    return new Promise((resolve, reject) => {
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
    const filePath = path.join(__dirname, 'sqls', '20200820185318-add-user-table-down.sql');
    return new Promise((resolve, reject) => {
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
