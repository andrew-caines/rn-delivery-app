import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, Modal } from 'react-native';
import { Button, Input, Text, } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import SignaturePad from '../components/SignaturePad';

const DeliveryToClient = (props) => {
    const [signature, setSignature] = useState(null);
    const [sigModalVis, setSigModalVis] = useState(false);
    //Refs
    const nameInput = useRef();
    const addressInput = useRef();
    const codInput = useRef();
    const signeeInput = useRef();

    //Helper Functions
    const handleSignature = (signature) => {
        console.log(`Got signature data`);
        setSigModalVis(false);
        setSignature(signature);
    };

    return (
        <View>
            <Text style={{ marginTop: 5 }} h4>Client Delivery</Text>
            <Input
                ref={nameInput}
                containerStyle={{ width: '100%' }}
                placeholder="Enter Client's name"
                label="Name"
                leftIcon={<Feather name='user' size={24} color="black" />}
                onChangeText={val => val}
            />
            <Input
                ref={addressInput}
                containerStyle={{ width: '100%' }}
                placeholder="Enter Delivery Address"
                label="Address"
                leftIcon={<Feather name='home' size={24} color="black" />}
                onChangeText={val => val}
            />
            <Input
                ref={codInput}
                containerStyle={{ width: '45%' }}
                defaultValue="0"
                label="C.O.D"
                leftIcon={<Feather name='dollar-sign' size={24} color="black" />}
                keyboardType='number-pad'
                onChangeText={val => val}
            />
            <Input
                ref={signeeInput}
                label="Signee"
                leftIcon={<Feather name='pen-tool' size={24} color="black" />}
                onChangeText={val => val}
            />

            {signature ?
                <Image resizeMode='contain' source={{ uri: signature }} style={{ width: 400, height: 200 }} />
                :
                <><Button title="Capture Signature" onPress={() => { setSigModalVis(!sigModalVis) }} />
                    <Modal transparent visible={sigModalVis}>
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
                />
                <Button
                    raised
                    title='Complete '
                    titleStyle={{ paddingLeft: 15 }}
                    buttonStyle={{ backgroundColor: 'green' }}
                    containerStyle={{ width: '55%' }}
                    icon={<Feather name="save" size={24} color="black" />}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({});

export default DeliveryToClient;