import React, { useRef, useState } from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import { View, StyleSheet } from 'react-native';
import { Button, ButtonGroup, Input, Text, } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { buttons_group, Refused, NotHome, TooLate, UnableToCollect, Other1, Other2 } from '../components/FailureToDeliverButtons';

const DeliveryToHome = (props) => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    //Refs
    const nameInput = useRef();
    const addressInput = useRef();
    const radio_data = [
        {
            label: 'Retry on Route'
        },
        {
            label: 'Return to Pharmacy'
        }
    ];

    return (
        <View>
            <Text style={{ marginTop: 5 }} h4>Failure to Deliver</Text>
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
            <Text h4>Delivery Status</Text>
            <RadioButtonRN
                data={radio_data}
                selectedBtn={(e) => console.log(e)}
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
                onPress={index => setSelectedIndex(index)}
                selectedIndex={selectedIndex}
                buttons={buttons_group}
                containerStyle={{ height: 100 }}
            />
            <View style={styles.spacer}>

            </View>
            <Button
                raised
                title='Complete '
                titleStyle={{ paddingLeft: 15 }}
                buttonStyle={{ backgroundColor: 'green' }}
                containerStyle={{ width: '100%' }}
                icon={<Feather name="save" size={24} color="black" />}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    spacer: {
        height: 70
    }
});

export default DeliveryToHome;