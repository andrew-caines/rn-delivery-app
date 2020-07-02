import React, { useEffect, useContext } from 'react';
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

    return null;
}

export default ResolveAuth;