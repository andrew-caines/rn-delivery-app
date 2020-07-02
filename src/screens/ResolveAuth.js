import React, { useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { GlobalStateContext } from '../context/globalState';
import * as Location from 'expo-location';

const ResolveAuth = ({ navigation }) => {

    const { tryLocalLogin, setLocationPermission } = useContext(GlobalStateContext);
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
        })();
        //Look for cached login token & request Location Permission!
        setLocationPermission();
        tryLocalLogin(navigation);
    }, []);

    return (
        <View>
            <Text>If you are seeing this Screen, close the App Manually</Text>
        </View>
    )
}

export default ResolveAuth;