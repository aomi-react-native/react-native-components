import React, {
    PropTypes
} from 'react';

import {
    Platform,
    View,
    DatePickerAndroid,
    DatePickerIOS
} from 'react-native';

import AbstractFormComponent from './AbstractFormComponent';
import Input from './Input';
import Button from '../bootstrap/Button';


/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/9
 */
class DatePicker extends AbstractFormComponent {

    static propTypes = {
        editable: PropTypes.bool,
        maxDate: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date),
        mode: PropTypes.oneOf(['date', 'time', 'datetime']),
        name: PropTypes.string,
        onDateChange: PropTypes.func,
        value: PropTypes.instanceOf(Date)
    };

    static defaultProps = {
        editable: false,
        value: new Date()
    };

    constructor(props) {
        super(props);
        [
            'showPicker',
            'onDateChange'
        ].forEach(f => this[f] = this[f].bind(this));
        let {name, form, maxDate, minDate, value, date} = this.props;
        let val = value || date;
        this.state = {
            value: val
        };
        name && form && form.putFormValue(name, val);
        switch (Platform.OS) {
            case 'ios':
                this.Comp = DatePickerIOS;
                this.baseProps = {
                    maximumDate: maxDate,
                    minimumDate: minDate
                };
                break;
            case 'android':
                this.Comp = Input;
                this.baseProps.editable = false;
                this.baseProps.after = (
                    <Button beforeIcon="calendar"
                            bsStyle="link"
                            onPress={this.showPicker}
                            style={{justifyContent: 'center', alignItems: 'center', width: 30}}
                    />
                );
                break;
        }
    }

    state = {};

    baseProps = {};
    Comp = null;

    getValue() {
        return this.state.value;
    }

    valid() {
        return true;
    }

    async showPicker() {
        let {minDate, maxDate} = this.props;
        const {action, year, month, day} = await DatePickerAndroid.open({
            date: this.state.value,
            minDate,
            maxDate
        });

        if (action === DatePickerAndroid.dateSetAction) {
            this.onDateChange(new Date(year, month, day));
        }
    }

    onDateChange(value) {
        this.setState({value});
        let {onDateChange, name, form} = this.props;
        name && form && form.putFormValue(name, value);
        onDateChange && onDateChange(value);
    }

    render() {
        let {...other} = this.props;
        let Comp = this.Comp;
        return (
            <Comp {...other}
                {...this.baseProps}
                date={this.state.value}
                onDateChange={this.onDateChange}
                value={this.state.value.toLocaleDateString()}
            />
        );
    }

}

export default DatePicker;
