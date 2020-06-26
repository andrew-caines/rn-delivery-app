import React, { useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { GlobalStateContext } from '../context/globalState';
/*
This app will:  
1.) Confirm they mean to logout.
2.) On confirmation, tell GlobalStateContext to delete the token from state and from localAsyncStorage
3.) After that completes, it will then navigate them back to the Login Screen.

*/
const Logout = (props) => {
    const navigation = useNavigation();
    const { Logout } = useContext(GlobalStateContext);
    return (
        <TouchableOpacity onPress={() => Logout(navigation)}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 5
            }}>
                <Feather name="log-out" size={24} color="black" />
                <Text>Logout</Text>
            </View>
        </TouchableOpacity>
    );
}

export default Logout;