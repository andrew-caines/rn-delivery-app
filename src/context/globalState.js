import React, { useReducer, useEffect } from 'react';
import serverAPI from '../api/server';
import { AsyncStorage } from 'react-native';
import * as Location from 'expo-location';

//Inital State
const initalState = {
    displayname: '',
    assoc_dispensary: '',
    serverOnline: 'false',
    token: '',
    locationHasPermission: false,
    loading: false,
    loginFailureMessage: '',
    loginFailure: false,
    clientName: '',
    clientAddress: ''

};

const reducer = (state, action) => {
    switch (action.type) {
        case 'setLocationPermission':
            return { ...state, locationHasPermission: action.payload };
        case 'toggleLoading':
            return { ...state, loading: !state.loading };
        case 'setServerStatus':
            return { ...state, serverOnline: action.payload };
        case 'loginSuccess':
            return { ...state, token: action.payload.token, loginFailure: false };
        case 'loginFailure':
            return { ...state, loginFailure: true, loginFailureMessage: action.payload };
        case 'updateClientData':
            return { ...state, clientName: action.payload.name, clientAddress: action.payload.address };
        default:
            return state;
    }
}

//Context
export const GlobalStateContext = React.createContext();

//Provider
export const Provider = (props) => {
    const [state, dispatch] = useReducer(reducer, initalState);

    useEffect(() => {
        //Check to see if server is online.
        //check to see if location services are turned on and have permission
        async function checkPermissions() {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                dispatch({ type: 'setLocationPermission', payload: false });
            } else {
                dispatch({ type: 'setLocationPermission', payload: true });
            }
            try {
                let result = await serverAPI.get('/status');
                if (result.data.status) {
                    dispatch({ type: 'setServerStatus', payload: true });
                } else {
                    dispatch({ type: 'setServerStatus', payload: false });
                }
            } catch (e) {
                dispatch({ type: 'setServerStatus', payload: false });
                return;
            }

        }

        checkPermissions();

    }, []);

    const Login = async (username, password, navigation) => {
        //Change login button to spinner
        //Take thier username, password. Test against server, if successful get token, store it on device, and in state.
        //On failure display warning.
        //stop spinner
        //Navigation to bottomFlow

        dispatch({ type: 'toggleLoading' });
        try {
            let result = await serverAPI.post('login', { username, password });
            if (result.data.success) {
                //Successs Stash token, store in local storage, turn off spinner, navigate to bottomFlow
                dispatch({ type: 'loginSuccess', payload: { token: result.data.token } });
                await AsyncStorage.setItem('token', result.data.token);
                dispatch({ type: 'toggleLoading' });
                navigation.navigate('bottomFlow');
            }
        } catch (e) {
            //failure
            dispatch({ type: 'toggleLoading' });
            console.log(e.response)
            switch (e.response.status) {
                case 404:
                    //username or password is wrong
                    dispatch({ type: 'loginFailure', payload: 'Username or Password is Incorrect!' });
                    return;
                case 422:
                    //They failed to supply username, or password
                    dispatch({ type: 'loginFailure', payload: 'You must provide both username & password!' });
                    return;
                default:
                    dispatch({ type: 'loginFailure', payload: e.data.error });
                    return;
            }

        }

    }

    const Logout = async (navigation) => {
        //Delete local Token
        //Navigate back to login screen!
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
    }

    const tryLocalLogin = async (navigation) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            navigation.navigate('bottomFlow');
        } else {
            navigation.navigate('Login');
        }
    }

    const setClientData = async ({ name, address }) => {
        //This function is how you stash client data between a home/client screen and failure to deliver screen
        console.log(`setClientdata called with : ${name} ${address}`);
        dispatch({ type: 'updateClientData', payload: { name, address } });
    };

    const getClientData = () => {
        console.log(`getClientData called sending down: ${state.clientName} & ${state.clientAddress}`);
        return { name: state.clientName, address: state.clientAddress };
    }

    //Memonized value to prevent massive repaints.
    const value = React.useMemo(() => {
        return { state, tryLocalLogin, Login, Logout, setClientData, getClientData };
    }, [state]);

    return (
        <GlobalStateContext.Provider value={value} >
            {props.children}
        </GlobalStateContext.Provider>
    )
}
