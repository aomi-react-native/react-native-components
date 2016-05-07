#Icon
the icon use [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)

![Icon](icon.png)

## Examples
[Icon Examples](../Examples/src/components/IconExamples.js)

## Use

    <Icon name="cog"
          provider="Entypo"
    />
    <Icon name="archive"
          provider="EvilIcons"
    />
    <Icon name="user"/>

    <Icon name="alert"
          provider="Foundation"
    />
    <Icon name="alert"
          provider="Ionicons"
    />
    <Icon name="3d-rotation"
          provider="MaterialIcons"
    />
    <Icon name="alert"
          provider="Octicons"
    />
    <Icon name="acrobat"
          provider="Zocial"
    />
    <Icon name="weixin"
          size={24}
    />
    <Icon name="google"
          size={36}
    />
    <Icon name="github"
          size={48}
    />

## Properties

| Name           | Type     | Default  | Description   |
|----------------|----------|----------|---------------|
| provider | Enum['Entypo', 'EvilIcons', 'FontAwesome', 'Foundation', 'Ionicons', 'MaterialIcons', 'Octicons', 'Zocial'] | FontAwesome | 图标提供者 |
| name | String | question | Icon Name Eg: 'user' 'plus' |

