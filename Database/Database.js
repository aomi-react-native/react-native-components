/**
 * @author Sean sean.snow@live.com
 */

import { AsyncStorage } from 'react-native';
import Collection from './Collection';


const DEFAULT_DATABASE_NAME = 'REACT_NATIVE_DEFAULT_DATABASE_NAME';


class Database {

  databaseName;
  collections = {};

  constructor(databaseName = DEFAULT_DATABASE_NAME) {
    this.databaseName = databaseName;
  }

  /**
   *
   * @param collectionName
   * @returns {Collection}
   */
  async collection(collectionName:String):Collection {
    if (this.collections[collectionName]) {
      return this.collections[collectionName];
    }
    let collection = new Collection(collectionName, this.databaseName);
    await collection.initCollection();
    this.collections[collectionName] = collection;
    return collection;
  }

  /**
   * 清空数据库
   */
  async clear():void {
    await AsyncStorage.removeItem(this.databaseName);
  }

}

export default Database;
