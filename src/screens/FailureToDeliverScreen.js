import React, { useRef, useContext, useReducer, useEffect } from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import { View, StyleSheet, ToastAndroid, Vibration } from 'react-native';
import { Button, ButtonGroup, Input, Text, } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { buttons_group } from '../components/FailureToDeliverButtons';
import { GlobalStateContext } from '../context/globalState';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import serverAPi from '../api/server';
import { ERROR_PATTERN, SUCCESS_PATTERN } from '../constants/app-wide';

const initialState = {
    name: '',
    address: '',
    status: '',
    reason: '',
    selectedIndex: 0,
    isValid: false,
    loading: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setValid':
            return { ...state, isValid: action.payload };
        case 'setLoading':
            return { ...state, loading: action.payload };
        case 'updateValue':
            return { ...state, [action.payload.key]: action.payload.value };
        case 'setInital':
            return { ...state, name: action.payload.name, address: action.payload.address };
        case 'setReason':
            switch (action.payload.selectedIndex) {
                case 0:
                    return { ...state, reason: 'Refused', selectedIndex: action.payload.selectedIndex };
                case 1:
                    return { ...state, reason: 'Not Home', selectedIndex: action.payload.selectedIndex };
                case 2:
                    return { ...state, reason: 'Too Late', selectedIndex: action.payload.selectedIndex };
                case 3:
                    return { ...state, reason: 'Unable to Collect', selectedIndex: action.payload.selectedIndex };
                case 4:
                    return { ...state, reason: 'Other Reason 1', selectedIndex: action.payload.selectedIndex };
                case 5:
                    return { ...state, reason: 'Other Reason 2', selectedIndex: action.payload.selectedIndex };
                default:
                    return { ...state, reason: 'Unknown/Error', selectedIndex: action.payload.selectedIndex };
            }
        case 'clearForm':
            return initialState;
        default:
            return state;
    }
};

const FailureToDeliver = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { state: gstate, getClientData, setClientData } = useContext(GlobalStateContext);

    useFocusEffect(
        React.useCallback(() => {
            const { name, address } = getClientData();
            dispatch({ type: 'setInital', payload: { name, address } });
        }, [gstate])
    )
    //Form Validation
    useEffect(() => {
        if (state.name.length > 3 && state.address.length > 5 && state.reason.length > 1 && state.status.length > 1) {
            if (state.isValid === false) {
                dispatch({ type: 'setValid', payload: true });
            }
        } else {
            if (state.isValid === true) {
                dispatch({ type: 'setValid', payload: false });
            }
        }
    }, [state]);

    //Refs
    const nameInput = useRef();
    const addressInput = useRef();
    const radio_data = [
        {
            label: 'Retry on Route', value: 'Retry'
        },
        {
            label: 'Return to Pharmacy', value: 'Return'
        }
    ];

    const handleComplete = async () => {
        console.log(`${JSON.stringify(state)}`);
        dispatch({ type: 'setLoading', payload: true });
        let location = await Location.getCurrentPositionAsync({});
        try {
            const body = {
                name: state.name,
                address: state.address,
                status: state.status,
                reason: state.reason,
                location
            }
            let result = await serverAPi.post('/saveFailure', body);
            if (result.data.success) {
                //After success
                ToastAndroid.show(`💾 Failure to Deliver Saved.`, ToastAndroid.SHORT);
                Vibration.vibrate(SUCCESS_PATTERN);
                nameInput.current.clear();
                addressInput.current.clear();
                dispatch({ type: 'clearForm' });
                dispatch({ type: 'setLoading', payload: false });
            } else {
                dispatch({ type: 'setLoading', payload: false });
                ToastAndroid.show(`💣 ERROR SAVING: ${result.data.message}`, ToastAndroid.SHORT);
                Vibration.vibrate(ERROR_PATTERN);
            }

        } catch (e) {
            dispatch({ type: 'setLoading', payload: false });
            ToastAndroid.show(`💣 ERROR SAVING: ${e}`, ToastAndroid.SHORT);
            Vibration.vibrate(ERROR_PATTERN);
        }
    }

    const clearForm = () => {
        setClientData({ name: '', address: '' });
        dispatch({ type: 'clearForm' });
    };

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginTop: 5, flexGrow: 4 }} h4>Failure to Deliver</Text>
                <TouchableOpacity style={{ marginTop: 5, flexGrow: 2 }} onPress={clearForm}>
                    <Text ><Feather name="trash-2" size={25} color="#F08080" />Clear Form</Text>
                </TouchableOpacity>

            </View>

            <Input
                ref={nameInput}
                containerStyle={{ width: '100%' }}
                placeholder="Enter Client's name"
                value={state.name}
                label="Name"
                leftIcon={<Feather name='user' size={24} color="black" />}
                onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'name', value: value } })}
            />
            <Input
                ref={addressInput}
                value={state.address}
                containerStyle={{ width: '100%' }}
                placeholder="Enter Delivery Address"
                label="Address"
                leftIcon={<Feather name='home' size={24} color="black" />}
                onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'address', value: value } })}
            />
            <Text h4>Delivery Status</Text>
            <RadioButtonRN
                data={radio_data}
                selectedBtn={(button) => dispatch({ type: 'updateValue', payload: { key: 'status', value: button.value } })}
                icon={
                    <Feather
                        name="check"
                        size={25}
                        color="#2c9dd1"
                    />
                }
            />
            <Text h4>Rejection Reasons</Text>
            <ButtonGroup
                onPress={index => dispatch({ type: 'setReason', payload: { selectedIndex: index } })}
                selectedIndex={state.selectedIndex}
                buttons={buttons_group}
                containerStyle={{ height: 100 }}
            />
            <View style={styles.spacer}>

            </View>
            <Button
                raised
                disabled={!state.isValid}
                loading={state.loading}
                title='Complete '
                titleStyle={{ paddingLeft: 15 }}
                buttonStyle={{ backgroundColor: 'green' }}
                containerStyle={{ width: '100%' }}
                icon={<Feather name="save" size={24} color="black" />}
                onPress={handleComplete}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    spacer: {
        height: 70
    }
});

export default FailureToDeliver;