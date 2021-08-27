import { Db, MongoClient } from 'mongodb';

class MongoInstance {
  client: MongoClient;
  db: Db;
}

export default MongoInstance;
