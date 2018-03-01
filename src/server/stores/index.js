import bluebird from 'bluebird';
import mongoose from 'mongoose';

import proxyReponseStoreFactory from './proxy-response-store';
import mockResponseStore from './mock-response-store';

export default ({ mongodb }) => {
  mongoose.Promise = bluebird;
  const replicaSet = mongodb.replicaSet ? `&replicaSet=${mongodb.replicaSet}` : '';
  const ssl = `ssl=${mongodb.ssl}`;
  const authSource = mongodb.authSource ? `&authSource=${mongodb.authSource}` : '';
  const userAndPassword = mongodb.user ? `${mongodb.user}:${process.env.MONGODB_PASSWORD}@` : '';
  const url = `mongodb://${userAndPassword}${mongodb.hosts}/${mongodb.database}?${ssl}${replicaSet}${authSource}`;

  return mongoose.connect(url)
    .then(() => ({
      logResonseStore: proxyReponseStoreFactory({ mongoose }),
      mockResonseStore: mockResponseStore({ mongoose }),
    }));
};
