/**
 * @author Sean sean.snow@live.com
 */

import {
    Platform,
    ToastAndroid
} from 'react-native';

import Toast from 'react-native-root-toast';

let SHORT, LONG;
if (Platform.OS === 'android') {
    SHORT = ToastAndroid.SHORT;
    LONG = ToastAndroid.LONG;
}

if (Platform.OS === 'ios') {
    SHORT = Toast.durations.SHORT;
    LONG = Toast.durations.LONG;
}

function show(msg, duration = SHORT) {

    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, duration);
        return;
    }

    if (Platform.OS === 'ios') {
        Toast.show(msg, {
            duration: duration,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            delay: 100
        });
    }

}

export { show as default, SHORT, LONG };
