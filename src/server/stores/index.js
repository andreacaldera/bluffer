import bluebird from 'bluebird';
import mongoose from 'mongoose';

import proxiedResponsesStoreFactory from './proxied-responses-store';
import mockedResponsesStoreFactory from './mocked-responses-store';

const userAndPassword = ({ user, password }) => {
  if (!user && !password) {
    return '';
  }
  if (user && !password) {
    return `${user}@`;
  }

  return `${user}:${password}@`;
};

export default ({ mongodb }) => {
  mongoose.Promise = bluebird;
  const replicaSet = mongodb.replicaSet ? `&replicaSet=${mongodb.replicaSet}` : '';
  const ssl = `ssl=${mongodb.ssl}`;
  const authSource = mongodb.authSource ? `&authSource=${mongodb.authSource}` : '';
  const url = `mongodb://${userAndPassword(mongodb)}${mongodb.hosts}/${mongodb.database}?${ssl}${replicaSet}${authSource}`;

  const closeStoreConnection = () => mongoose.connection.close();

  return mongoose.connect(url)
    .then(() => ({
      stores: {
        proxiedResponses: proxiedResponsesStoreFactory({ mongoose }),
        mockedResponses: mockedResponsesStoreFactory({ mongoose }),
      },
      closeStoreConnection: global.process.env.NODE_ENV === 'test' ? closeStoreConnection : null,
    }));
};
