import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Image, ToastAndroid, Vibration } from 'react-native';
import { Button, Input, Text, } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { Feather } from '@expo/vector-icons';
import SignaturePad from '../components/SignaturePad';
//TODOS
//Introduce a reducer to make clearing, and setting easier.
const ERROR_PATTERN = [400, 1600, 400, 1600, 400, 800];
const SUCCESS_PATTERN = [400, 400];

const DeliveryToHome = (props) => {

    const [home, setHome] = useState({ label: '', value: '' });
    const [signee, setSignee] = useState('');
    const [pickItems, setPickItems] = useState([]);
    const [bagsDropped, setBagsDropped] = useState(0);
    const [binsDropped, setBinsDropped] = useState(0);
    const [bagsPicked, setBagsPicked] = useState(0);
    const [binsPicked, setBinsPicked] = useState(0);
    const [signature, setSignature] = useState('');
    const [sigModalVis, setSigModalVis] = useState(false);

    //Refs
    const bagd = useRef();
    const bind = useRef();
    const bagp = useRef();
    const binp = useRef();
    const sign = useRef();

    //On Did Mount
    useEffect(() => {
        const listOfHomes = [
            { label: 'Fake home 1', value: 'UID0002' },
            { label: 'Fake home 2', value: 'UID0001' },
            { label: 'Fake home 3', value: 'UID0001' },
            { label: 'Fake home 4', value: 'UID0001' },
            { label: 'Fake home 5', value: 'UID0001' },
            { label: 'Fake home 6', value: 'UID0001' },
            { label: 'Fake home 7', value: 'UID0001' },
            { label: 'Fake home 8', value: 'UID0001' },
            { label: 'Fake home 9', value: 'UID0001' },
            { label: 'Fake home 10', value: 'UID0001' },
            { label: 'Fake home 11', value: 'UID0001' },
            { label: 'Fake home 12', value: 'UID0001' },
            { label: 'Fake home 13', value: 'UID0001' },
            { label: 'Fake home 14', value: 'UID0001' },
            { label: 'Fake home 15', value: 'UID0001' },
        ];
        const Items = listOfHomes.map((item, index) => {
            return (<Picker.Item key={index} label={item.label} value={item.value} />);
        });
        setPickItems(Items);
    }, [])

    //Helper Functions
    const handleSignature = (signature) => {
        console.log(`Got signature data`);
        setSigModalVis(false);
        setSignature(signature);
    }
    const clearForm = () => {
        setHome({ label: '', value: '' });
        setSignee('');
        setBagsDropped(0)
        setBinsDropped(0);
        setBagsPicked(0);
        setBinsPicked(0)
        setSignature(null);
        //Native Inputs
        bagd.current.clear();
        bind.current.clear();
        sign.current.clear();
        bagp.current.clear();
        binp.current.clear();
    }

    const handleComplete = () => {
        //what happens when completed.
        //Save Form data to server.
        //Show reponse to user (success,fail)
        //Shake device for success short, fail bad pattern
        //Clear form data
        //Currently stubbed, dont do save, but do the rest
        ToastAndroid.show("Delivery Saved!", ToastAndroid.SHORT);
        Vibration.vibrate(SUCCESS_PATTERN);
        clearForm();
    }

    return (
        <View style={{ marginHorizontal: 5 }}>
            <Text style={{marginTop:5}} h4>Select Home for Delivery</Text>
            <Picker
                selectedValue={home}
                onValueChange={(value) => setHome(value)}
                prompt="Select Home"
            >
                {pickItems}
            </Picker>
            <Text>Amount of Item(s) Dropped off</Text>
            <View style={{ flexDirection: 'row' }}>
                <Input
                    ref={bind}
                    containerStyle={{ width: '45%' }}
                    label="Bins"
                    leftIcon={<Feather name='box' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={val => setBinsDropped(val)} />
                <Input
                    ref={bagd}
                    containerStyle={{ width: '45%' }}
                    label="Bags"
                    leftIcon={<Feather name='shopping-bag' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={val => setBinsDropped(val)} />
            </View>
            <Input
                ref={sign}
                label="Signee"
                leftIcon={<Feather name='pen-tool' size={24} color="black" />}
                onChangeText={val => setSignee(val)}
            />

            {signature ?
                <Image resizeMode='contain' source={{ uri: signature }} style={{ width: 400, height: 200 }} />
                :
                <><Button title="Capture Signature" onPress={() => { setSigModalVis(!sigModalVis) }} />
                    <Modal transparent visible={sigModalVis}>
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
                    onChangeText={val => setBinsPicked(val)}
                />
                <Input
                    ref={bagp}
                    containerStyle={{ width: '45%' }}
                    label="Bags"
                    leftIcon={<Feather name='shopping-bag' size={24} color="black" />}
                    keyboardType='number-pad'
                    onChangeText={val => setBagsPicked(val)}
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
                />
                <Button
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
