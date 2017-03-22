import { AsyncStorage } from 'react-native';

const DEFAULT_COLLECTION = 'REACT_NATIVE_DATABASE_DEFAULT_COLLECTION';
const SEQUENCE_COLLECTION = 'REACT_NATIVE_DATABASE_SEQUENCE_COLLECTION';

/**
 * $eq: equal to
 * $gt: greater than
 * $gte: greater than or equal to
 * $lt: less than
 * $lte: less than or equal to
 * $ne: not equal to
 * $contains: contains
 * $in: in
 * $and: and operator
 * $or: or operator
 * $regex: use a regex pattern for matching. Example: Children whose name ends with 'ir':
 * @author Sean sean.snow@live.com
 */
class Collection {

  database: Object;
  collection: Object;
  databaseName: String;
  collectionName: String;

  logicalOperators = ['$and', '$or'];

  /**
   * 创建一个数据集合对象
   * @param {String} collectionName
   * @param {String} databaseName
   */
  constructor(collectionName: String = DEFAULT_COLLECTION, databaseName: String) {
    this.databaseName = databaseName;
    this.collectionName = collectionName;
  }

  async createDatabase() {
    await AsyncStorage.setItem(this.databaseName, JSON.stringify({}));
    return this.getDatabase();
  }

  async getDatabase() {
    let database = await AsyncStorage.getItem(this.databaseName);
    if (database) {
      return Object.assign({}, JSON.parse(database));
    } else {
      return this.createDatabase();
    }
  }

  async initCollection() {
    this.database = await this.getDatabase();
    this.collection = this.database[this.collectionName] || {};
    this.sequence = this.database[SEQUENCE_COLLECTION];
    if (this.sequence) {
      if (!this.sequence[this.collectionName]) {
        this.sequence[this.collectionName] = 1;
      }
    } else {
      this.sequence = {};
      this.sequence[this.collectionName] = 1;
      this.database[SEQUENCE_COLLECTION] = this.sequence;
    }
  }

  async generateId() {
    await this.initCollection();
    return this.sequence[this.collectionName]++;
  }

  async merge() {
    this.database[this.collectionName] = this.collection;
    await AsyncStorage.setItem(this.databaseName, JSON.stringify(this.database));
  }

  /**
   * 向集合插入数据
   * @param data 数据
   */
  async insert(data) {
    try {
      if (Array.isArray(data)) {
        data.forEach(row => {
          this.generateId().then(id => {
            row._id = id;
            this.collection[id] = row;
          }, err => {
            console.error('create id error');
            console.log(err);
            throw err;
          });
        });
      } else {
        data._id = await this.generateId();
        this.collection[data._id] = data;
      }
      await this.merge();
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(data) {
    let _update = (row) => {
      if (row._id) {
        this.collection[row._id] = row;
      }
    };
    if (Array.isArray(data)) {
      data.forEach(_update);
    } else {
      _update(data);
    }
    await this.merge();
  }

  async find(filter) {
    if (filter) {
      let result = {};
      Object.keys(filter).forEach(field => {
        if (this.logicalOperators.indexOf(field) > -1) {
          this[field](filter[field]);
        }
        Object.keys(this.collection).forEach(id => {
          let row = this.collection[id];
          let column = row[field];
          if (column) {
            Object.keys(filter[field]).forEach(key => {
              if (this[key] && this[key](column, filter[field][key])) {
                result[id] = row;
              }
            });
          }
        });
      });
      return this._return(result);
    }
    return this._return(this.collection);
  }

  async findOne(filter) {
    let result = await this.find(filter);
    if (result) {
      return result[Object.keys(result)[0]];
    }
    return null;
  }

  async del(data) {
    if (Number.isInteger(data)) {
      this.collection[data] && delete this.collection[data];
    } else {
      data._id && this.collection[data._id] && delete this.collection[data._id];
      await this.merge();
    }
  }

  async clear() {
    this.collection = {};
    await this.merge();
  }

  /**
   * 过虑
   * <pre>
   *     let filter = {
     *          'field': {
     *              '$eq': 1
     *          },
     *          'field2': {
     *              '$or': {
     *                  '$eq': 1,
     *                  '$gt': 0
     *              }
     *          }
     *     };
   * </pre>
   * @param {Array} result 结果集
   * @param {Array} documents 数据文档
   * @param {Object} filter 过虑条件
   */
  filter(result: Array, documents: Array, filter: Object) {
    Object.keys(filter).forEach(field => {
      let operators = filter[field];
      Object.keys(operators).forEach(operator => {
        if (this.logicalOperators.includes(operator)) {
          this[operator](result, documents, operators[operator]);
        } else {
          if (this[operator]) {
            documents.filter(row => {
              let column = row[field];
              if (this[operator](column, operators)) {

              }
            });
          }
        }
      });
    });
  }

  $and(result: Array, documents: Array, filter: Object) {

  }

  $or(result: Array, documents: Array, filter: Object) {

  }

  $eq(serverValue, whereValue): Boolean {
    return JSON.stringify(serverValue) === JSON.stringify(whereValue);
  }

  $regex(serverValue, whereValue): Boolean {
    let reg = new RegExp(whereValue);
    return reg.test(JSON.stringify(serverValue));
  }

  _return(data) {
    if (data) {
      return JSON.stringify(data) === JSON.stringify({}) ? null : data;
    }
    return null;
  }

}

export default Collection;
