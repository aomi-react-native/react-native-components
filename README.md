# React Native Components

React Native Components Library, 封装常用的组件,提供IOS和Android统一的API接口

## Components

### Badge
### Barcode
### Button
### Camera
### Canvas
### DatePicker
### Dialog
### Form
### GridView
### Icon
### Input
### LoadingDialog
### Picker
### RadioGroup
### SettingsList
### Slider
### Switch
### Tabs



## Api
### ActionSheet
### Database
数据访问API
#### Database API Reference
##### constructor
构造一个``Database``对象
* databaseName 数据库名字(默认:REACT_NATIVE_DEFAULT_DATABASE_NAME)
  
    let db = new Database();
    let myDb = new Database('myDB');


#### Example
    
    let db = new Database();
    let collection = db.collection('user_collection');
    let user = {
      age: 19
    };
    await collection.insert(user);
    user = await collection.findOne();
    user.name = 'Hello';
    collection.update(user);
    await collection.delete(user);

### MediaManager
媒体访问工具

#### 在IOS上使用
需要先链接 ``RCTCameraRoll`` 库，然后在链接 ``SitbRCTMediaMananger``库
``SitbRCTMediaMananger``库在 ``~/react-native-components/ios/SitbRCTMediaMananger``

### OrientationManager
### Toast

## Run Examples

    git clone git@github.com:sitb-software/ReactNativeComponents.git
    cd ReactNativeComponents/Examples && npm install
    //android
    react-native run-android
    react-native run-ios



