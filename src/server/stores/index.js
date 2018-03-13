import bluebird from 'bluebird';
import mongoose from 'mongoose';

import proxiedResponsesStoreFactory from './proxied-responses-store';
import mockedResponsesStoreFactory from './mocked-responses-store';

export default ({ mongodb }) => {
  mongoose.Promise = bluebird;
  const replicaSet = mongodb.replicaSet ? `&replicaSet=${mongodb.replicaSet}` : '';
  const ssl = `ssl=${mongodb.ssl}`;
  const authSource = mongodb.authSource ? `&authSource=${mongodb.authSource}` : '';
  const userAndPassword = mongodb.user ? `${mongodb.user}:${process.env.MONGODB_PASSWORD}@` : '';
  const url = `mongodb://${userAndPassword}${mongodb.hosts}/${mongodb.database}?${ssl}${replicaSet}${authSource}`;

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
