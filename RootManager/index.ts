import { NativeModules } from 'react-native';

const { SitbRootManager } = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/6/11
 */
export async function isRoot() {
  console.log('判断手机是否root');
  return await SitbRootManager.isRoot();
}
