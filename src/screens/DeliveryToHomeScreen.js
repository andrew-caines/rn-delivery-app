import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-community/picker';



const DeliveryToHome = (props) => {

    const [home, setHome] = useState({ label: '', value: '' });
    const [signee, setSignee] = useState('');
    const [pickItems, setPickItems] = useState([]);
    let Items;
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
        Items = listOfHomes.map((item, index) => {
            return (<Picker.Item key={index} label={item.label} value={item.value} />);
        });
        setPickItems(Items);
    }, [])


    return (
        <View>
            <Text>Select Home for Delivery</Text>
            <Picker
                selectedValue={home}
                onValueChange={(value) => setHome(value)}
                prompt="Select Home"
            >
                {pickItems}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({});

export default DeliveryToHome;