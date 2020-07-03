import React, { useRef, useState, useContext, useReducer, useEffect } from 'react';
import { View, StyleSheet, Image, Modal, ToastAndroid, Vibration } from 'react-native';
import * as Location from 'expo-location';
import { Button, Input, Text, } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import SignaturePad from '../components/SignaturePad';
import { GlobalStateContext } from '../context/globalState';
import { ERROR_PATTERN, SUCCESS_PATTERN } from '../constants/app-wide';
import serverAPI from '../api/server';

const initalState = {
    name: '',
    address: '',
    signee: '',
    money: 0,
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
            return { ...state, formIsValid: action.payload };
        case 'clearForm':
            return initalState;
        default:
            return state;
    }
}

const DeliveryToClient = ({ navigation }) => {

    const { setClientData } = useContext(GlobalStateContext);
    const [state, dispatch] = useReducer(reducer, initalState);
    const [loading, setLoading] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const [locModalVis, setLocModalVis] = useState(false);
    //Refs
    const nameInput = useRef();
    const addressInput = useRef();
    const codInput = useRef();
    const signeeInput = useRef();

    useEffect(() => {
        //A quick check to see if Locations is enabled!
        async function requestPermissions() {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                //Show a popup letting them know Location is required!
                setLocationPermission(false);
                setLocModalVis(true);
            } else {
                setLocationPermission(true);
            }
        }

        requestPermissions();
    }, []);

    useEffect(() => {
        //Each time a value is updated, check to see if form is valid enough to complete!
        //Between items dropped off, the value must be greater than 1 (atleast 1 bin or bag dropped off)
        //There must be a minimum of 3 characters in the signee name field
        //There must be signature data
        //Amount of items picked up, can be 0 or more
        // Must not update state, if its already true or false, only update when there is a change.
        if ((state.name !== null && state.name !== '') && (state.address !== null && state.address.length > 5) && (state.signee.length > 3) && state.signature) {
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

    const handleComplete = async () => {

        setLoading(true);
        const location = await Location.getCurrentPositionAsync({});

        const body = {
            type: 'Client',
            address: state.address,
            client_name: state.name,
            signee: state.signee,
            signature: state.signature,
            money: state.money,
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
        if ((state?.name && state.name !== '') && (state?.address && state.address !== '')) {
            setClientData({ name: state.name, address: state.address });
            navigation.navigate('Failure To Deliver');
        } else {
            ToastAndroid.show(`You must first create a delivery, to fail...`, ToastAndroid.SHORT);
            Vibration.vibrate(ERROR_PATTERN);
        }
    }

    //Helper Functions
    const handleSignature = (signature) => {
        dispatch({ type: 'updateValue', payload: { key: 'signature', value: signature } });
        dispatch({ type: 'toggleSignatureModal' });
    }

    const clearForm = () => {
        //The element has its own clear method.
        nameInput.current.clear();
        addressInput.current.clear();
        codInput.current.clear();
        signeeInput.current.clear();
        dispatch({ type: 'clearForm' });
    }

    return (
        <View>
            <Text style={{ marginTop: 5 }} h4>Client Delivery</Text>
            <Input
                ref={nameInput}
                containerStyle={{ width: '100%' }}
                placeholder="Enter Client's name"
                label="Name"
                leftIcon={<Feather name='user' size={24} color="black" />}
                onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'name', value: value } })}
            />
            <Input
                ref={addressInput}
                containerStyle={{ width: '100%' }}
                placeholder="Enter Delivery Address"
                label="Address"
                leftIcon={<Feather name='home' size={24} color="black" />}
                onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'address', value: value } })}
            />
            <Input
                ref={codInput}
                containerStyle={{ width: '45%' }}
                defaultValue="0"
                label="C.O.D"
                leftIcon={<Feather name='dollar-sign' size={24} color="black" />}
                keyboardType='number-pad'
                onChangeText={(value) => dispatch({ type: 'updateValue', payload: { key: 'money', value: value } })}
            />
            <Input
                ref={signeeInput}
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
                    <View style={{ width: 400, height: 150 }}></View>
                </>
            }

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
                    disabled={!state.formIsValid || !locationPermission}
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
            <Modal visible={locModalVis} animationType="fade" transparent onDismiss={() => setLocModalVis(false)} onRequestClose={() => setLocModalVis(false)} >
                <View style={styles.locModal}>
                    <View style={styles.modalView}>
                        <Feather name="alert-triangle" size={72} color="black" />
                        <Text>Location Permissions are Required to use this Application</Text>
                        <Text>You you clicked Deny in Error, restart the Application and try again, or grant Permissions in the Settings > Apps > CareRX Delivery settings.</Text>
                        <Button title="Understood" onPress={() => setLocModalVis(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    locModal: {
        margin: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    }
});

export default DeliveryToClient;