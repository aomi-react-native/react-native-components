import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  View,
  StyleSheet
} from 'react-native';
import Input from './form/Input';

const styles = StyleSheet.create({
  container: {
    height: 50,
    padding: 7,
    backgroundColor: '#eee'
  },
  inputContainer: {
    borderRadius: 7,
    backgroundColor: '#FFF'
  },
  input: {
    borderRadius: 7,
    paddingLeft: 5
  }
});

/**
 * SearchBar
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/20
 */
class SearchBar extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func
  };

  searchText = '';

  handleChangeText(text) {
    this.searchText = text;
    const {onSearch} = this.props;
    onSearch && onSearch({
      event: 'inputChange',
      value: this.searchText
    });
  }

  handleSubmit() {
    const {onSearch} = this.props;
    onSearch && onSearch({
      event: 'inputSubmit',
      value: this.searchText
    });
  }

  render() {

    const {
      placeholder
    } = this.props;

    const iconProps = {
      color: '#ccc',
      size: 16
    };
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input autoCapitalize="none"
                 autoCorrect={false}
                 before="search"
                 clearButtonMode="while-editing"
                 enablesReturnKeyAutomatically
                 iconProps={iconProps}
                 onChangeText={this.handleChangeText}
                 onSubmitEditing={this.handleSubmit}
                 placeholder={placeholder}
                 returnKeyType="search"
                 style={styles.input}
          />
        </View>
      </View>
    );
  }

}

export default SearchBar;
