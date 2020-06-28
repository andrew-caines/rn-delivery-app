import React, { useState, useEffect, useRef, useContext, useReducer } from 'react';
import { View, StyleSheet, Modal, Image, ToastAndroid, Vibration, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Input, Text, } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { Feather } from '@expo/vector-icons';
import SignaturePad from '../components/SignaturePad';
import { GlobalStateContext } from '../context/globalState';
import serverAPI from '../api/server';
import * as Location from 'expo-location';

const ERROR_PATTERN = [400, 1600, 400, 1600, 400, 800];
const SUCCESS_PATTERN = [400, 400];

const initalState = {
    home: { ID: '', address: '', name: '' },
    bagsDropped: 0,
    bagsPickedUp: 0,
    binsDropped: 0,
    binsPickedUp: 0,
    signee: '',
    signature: null,
    sigModalVisible: false,
    formIsValid: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'updateValue': //This will handle updating any indiviudal value, so dont need to make an action type for each update
            return { ...state, [action.payload.key]: action.payload.value };
        case 'toggleSignatureModal':
            return { ...state, sigModalVisible: !state.sigModalVisible };
        case 'setFormIsValid':
            console.log(`Form was set to: ${action.payload}`);
            return { ...state, formIsValid: action.payload };
        case 'clearForm':
            return initalState;
        default:
            return state;
    }
}

const DeliveryToHome = ({ navigation }) => {

    const { setClientData } = useContext(GlobalStateContext);
    const [state, dispatch] = useReducer(reducer, initalState);
    const [pickItems, setPickItems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);

    //Refs
    const bagd = useRef();
    const bind = useRef();
    const bagp = useRef();
    const binp = useRef();
    const sign = useRef();

    //On Did Mount
    useEffect(() => {
        async function getHomes() {
            setLoading(true);
            try {
                let response = await serverAPI.get('/homesByPharmacy');
                const Items = response.data.map((item, index) => {
                    return (<Picker.Item key={item.ID} label={item.name} value={{ ID: item.ID, address: item.address, name: item.name }} />);
                });
                Items.unshift(<Picker.Item key={0} label="Select a Home to deliver to" value={null} enabled={false} />)
                setPickItems(Items);
                setLoading(false);
            } catch (e) {
                //There is a condition, since this reacts to changes in state (login/logout) that it will attempt to grab this when a person logs out, and since that route
                // is protected it will throw a 401. This just handles this rejection. it swallows it.
                //console.log(`Got error while grabbing homes: ${e}`);
                setLoading(false);
                return;
            }
        }
        getHomes();
    }, [refresh]);

    //Form validation!
    useEffect(() => {
        //Each time a value is updated, check to see if form is valid enough to complete!
        //Between items dropped off, the value must be greater than 1 (atleast 1 bin or bag dropped off)
        //There must be a minimum of 3 characters in the signee name field
        //There must be signature data
        //Amount of items picked up, can be 0 or more
        // Must not update state, if its already true or false, only update when there is a change.
        if ((state.home !== null && state.home.name !== '') && (state.bagsDropped + state.binsDropped >= 1) && (state.signee.length > 3) && state.signature) {
            if (!state.formIsValid) {
                //Only dispatch if it was previously invalid, to prevent infinite loops
                dispatch({ type: 'setFormIsValid', payload: true });
            }
        } else {
            if (state.formIsValid) {
                //It was previously true, toggle to false, to prevent infinite reloops
                dispatch({ type: 'setFormIsValid', payload: false });
            }
        }
    }, [state]);

    //Helper Functions
    const handleSignature = (signature) => {
        dispatch({ type: 'updateValue', payload: { key: 'signature', value: signature } });
        dispatch({ type: 'toggleSignatureModal' });
    }

    const clearForm = () => {
        //The element has its own clear method.
        bagd.current.clear();
        bind.current.clear();
        sign.current.clear();
        bagp.current.clear();
        binp.current.clear();
        dispatch({ type: 'clearForm' });
    }

    const handleComplete = async () => {
        setLoading(true);
        let location = await Location.getCurrentPositionAsync({});
        console.log(`location:" ${JSON.stringify(location)}`)

        const body = {
            type: 'Home',
            address: state.home.address,
            client_name: state.home.name,
            signee: state.signee,
            signature: state.signature,
            bagsDropped: state.bagsDropped,
            bagsPickedUp: state.bagsPickedUp,
            binsDropped: state.binsDropped,
            binsPickedUp: state.binsPickedUp,
            money: 0,
            location: JSON.stringify(location)
        };
        try {
            const response = await serverAPI.post('/saveDelivery', body);
            if (response.data.success) {
                setLoading(false);
                ToastAndroid.show(`💾 Delivery Saved! `, ToastAndroid.SHORT);
                Vibration.vibrate(SUCCESS_PATTERN);
                clearForm();
            } else {
                setLoading(false);
                console.log(`Got into the else: response.data.message: ${response.data.message}`);
                ToastAndroid.show(`💣 ERROR SAVING: ${response.data.message}`, ToastAndroid.SHORT);
                Vibration.vibrate(ERROR_PATTERN);
            }

        } catch (e) {
            console.log(`💣 Got into trapped error in saving delivery: ${e}`);
            setLoading(false);
            Vibration.vibrate(ERROR_PATTERN);
        }


    }

    const handleRefused = () => {
        //set the client data to globalState, then navigate to refused page
        setClientData({ name: state.home.name, address: state.home.address });
        navigation.navigate('Failure To Deliver');
    }

    const refreshHomes = () => {
        setRefresh(!refresh);
    }

    return (
        <View style={{ marginHorizontal: 5 }}>
            <Text style={{ marginTop: 5 }} h4>Select Home for Delivery</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={refreshHomes}>
                    {loading ? <ActivityIndicator size="small" color="#00ff00" /> : <Feather style={{ flexGrow: 1, }} color="green" name="refresh-cw" size={24} />}
                </TouchableOpacity>
                <Picker
                    style={{ flexGrow: 10 }}
                    selectedValue={state.home}
                    onValueChange={(value) => dispatch({ type: 'updateValue', payload: { key: 'home', value: value } })}
                    prompt="Select Home"
                    mode="dropdown"
                >
                    {pickItems}
                </Picker>

            </View>
            <Text>Amount of Item(s) Dropped off</Text>
            <View style={{ flexDirection: 'row' }}>
                <Input
                    ref={bind}
                    containerStyle={{ width: '45%' }}
                    label="Bins"
                    leftIcon={<Feather name='box' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'binsDropped', value: value } })} />
                <Input
                    ref={bagd}
                    containerStyle={{ width: '45%' }}
                    label="Bags"
                    leftIcon={<Feather name='shopping-bag' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'bagsDropped', value: value } })} />
            </View>
            <Input
                ref={sign}
                label="Signee"
                leftIcon={<Feather name='pen-tool' size={24} color="black" />}
                onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'signee', value: value } })}
            />

            {state.signature ?
                <Image resizeMode='contain' source={{ uri: state.signature }} style={{ width: 400, height: 200 }} />
                :
                <><Button title="Capture Signature" onPress={() => dispatch({ type: 'toggleSignatureModal' })} />
                    <Modal transparent visible={state.sigModalVisible}>
                        <SignaturePad text='Please sign to confirm delivery' onOK={handleSignature} />
                    </Modal>
                </>
            }

            <Text>Amount of Item(s) Picked up</Text>
            <View style={{ flexDirection: 'row' }}>
                <Input
                    ref={binp}
                    containerStyle={{ width: '45%' }}
                    label="Bins"
                    leftIcon={<Feather name='box' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'binsPickedUp', value: value } })}
                />
                <Input
                    ref={bagp}
                    containerStyle={{ width: '45%' }}
                    label="Bags"
                    leftIcon={<Feather name='shopping-bag' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'bagsPickedUp', value: value } })}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Button
                    type='clear'
                    title='Refused'
                    titleStyle={{ paddingLeft: 15 }}
                    buttonStyle={{ backgroundColor: 'orange' }}
                    containerStyle={{ width: '35%' }}
                    icon={<Feather name="thumbs-down" size={24} color="black" />}
                    onPress={handleRefused}
                />
                <Button
                    disabled={!state.formIsValid}
                    loading={loading}
                    raised
                    title='Complete '
                    titleStyle={{ paddingLeft: 15 }}
                    buttonStyle={{ backgroundColor: 'green' }}
                    containerStyle={{ width: '55%' }}
                    icon={<Feather name="save" size={24} color="black" />}
                    onPress={handleComplete}
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    pickContainer: {
        flexDirection: 'row',
        alignContent: 'center',
    },
});

export default DeliveryToHome;
