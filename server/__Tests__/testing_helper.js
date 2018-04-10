/**
 * Code shamelessly taken from
 * https://medium.com/entria/testing-a-graphql-server-using-jest-4e00d0e4980e
 */

import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

process.env.NODE_ENV = 'test';

const config = {
  db: {
    test: 'mongodb://localhost/test',
  },
  connection: null,
};

function connect() {
  return new Promise((resolve, reject) => {
    if (config.connection) {
      return resolve();
    }

    const mongoUri = 'mongodb://localhost/test';

    mongoose.Promise = Promise;

    mongoose.connect(mongoUri);

    config.connection = mongoose.connection;

    config.connection
      .once('open', resolve)
      .on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
          console.log(e);

          mongoose.connect(mongoUri, options);
        }

        console.log(e);
        reject(e);
      });
  });
}

function clearDatabase() {
  return new Promise(resolve => {
    let cont = 0;
    let max = Object.keys(mongoose.connection.collections).length;
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {
        cont++;
        if(cont >= max) {
          resolve();
        }
      });
    }
  });
}

export async function setupTest() {
  await connect();
  await clearDatabase();
}