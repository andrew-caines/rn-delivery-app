import React, { useState, useContext } from 'react';
import { View, StyleSheet, Switch, Modal } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { GlobalStateContext } from '../context/globalState';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Login = ({ navigation }) => {
    const { state, Login, setLocationPermission } = useContext(GlobalStateContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [locPermission, setLocPermission] = useState(false);
    const [locModalVis, setLocModalVis] = useState(false);

    const retryPermissons = async () => {

        let { status } = await Location.requestPermissionsAsync({});
        if (status !== 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            setLocationPermission(true);
            setLocPermission(true);
        } else {
            setLocationPermission(false);
            setLocPermission(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text h4 >Login to Delivery App v1.0</Text>
            <Input
                leftIcon={<Feather name="user" size={24} color="black" />}
                label="Username"
                value={username}
                onChangeText={username => setUsername(username)}
                autoCapitalize='none'
                autoCorrect={false}
            />
            <Input
                leftIcon={<Feather name="lock" size={24} color="black" />}
                label="Password"
                value={password}
                onChangeText={pass => setPassword(pass)}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
            />
            {state.loginFailure ? <Text style={styles.errorMessage}>{state.loginFailureMessage} </Text> : null}
            <Button
                style={styles.buttonSpace}
                title="Login"
                raised
                loading={state.loading}
                onPress={() => Login(username, password, navigation)
                }
            />
            <View style={{ flexDirection: 'row' }}>
                <Text>Server Online:</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#e0e0eb" }}
                    thumbColor={state.serverOnline ? "#00e600" : "#cc2900"}
                    disabled={true}
                    value={state.serverOnline}
                />
                {!state.serverOnline ? <Text>Offline. Please contact Helpdesk</Text> : null}
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text>Location Permissions Granted:</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#e0e0eb" }}
                    thumbColor={state.locationHasPermission ? "#00e600" : "#cc2900"}
                    disabled={true}
                    value={state.locationHasPermission}
                />
            </View>
            {!state.locationHasPermission ?
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'red' }}>You must grant this program access to your Location!</Text>
                    <TouchableOpacity onPress={() => retryPermissons()}>
                        <Feather name="refresh-cw" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                : null}
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
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 200
    },
    buttonSpace: {
        paddingHorizontal: 15
    },
    errorMessage: {
        color: 'red',
        fontSize: 16,
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 10
    },
    locModal: {
        margin: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    }
});

export default Login;