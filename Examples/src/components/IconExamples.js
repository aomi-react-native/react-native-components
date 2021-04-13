import React, { Component } from 'react';
import { View } from 'react-native';

import Icon from 'react-native-components/Icon';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/4
 */
class IconExamples extends Component {
  render() {
    let circleStyle = {
      borderColor: '#46b8da',
      borderRadius: 50,
      width: 35,
      height: 35,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <View style={{ flex: 1, marginTop: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Icon name="cog" provider="Entypo" />
          <Icon name="archive" provider="EvilIcons" />
          <Icon name="user" />

          <Icon name="alert" provider="Foundation" />
          <Icon name="alert" provider="Ionicons" />
          <Icon name="3d-rotation" provider="MaterialIcons" />
          <Icon name="alert" provider="Octicons" />
          <Icon name="acrobat" provider="Zocial" />
          <Icon name="weixin" size={24} />
          <Icon name="google" size={36} />
          <Icon name="github" size={48} />
        </View>
        <View style={circleStyle}>
          <Icon name="users" />
        </View>
      </View>
    );
  }
}

export default IconExamples;
