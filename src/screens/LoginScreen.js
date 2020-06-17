import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

const Login = ({ navigation }) => {
    const errorMessage = null;
    const loading = false;
    const serverOnline = true;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text h4 >Login to Delivery App v1.0</Text>
            <Input
                leftIcon={<Feather name="mail" size={24} color="black" />}
                label="Email"
                value={email}
                onChangeText={email => setEmail(email)}
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
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage} </Text> : null}
            <Button
                style={styles.buttonSpace}
                title="Login"
                raised
                loading={loading}
                onPress={() => onSubmit({ email, password })
                }
            />
            <Button
                title="Fake Successful Login "
                raised
                buttonStyle={{ backgroundColor: 'orange' }}
                type='outline'
                iconRight={true}
                icon={() => <Feather name="chevrons-right" size={24} color="black" />}
                onPress={() => navigation.navigate('bottomFlow')
                }
            />
            <View style={{ flexDirection: 'row' }}>
                <Text>Server Online:</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#e0e0eb" }}
                    thumbColor={serverOnline ? "#00e600" : "#cc2900"}
                    disabled={true}
                    value={serverOnline}
                />
                {!serverOnline ? <Text>Offline. Please contact Helpdesk</Text> : null}
            </View>


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
});

export default Login;