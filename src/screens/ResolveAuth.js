import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ResolveAuth = ({ navigation }) => {
    return (
        <View>
            <Text>You should never see me, and if you do it should be a loading spinner. I am shown while checking local storage for a token.</Text>
            <Button title="Click me to pretend you logged in" onPress={() => navigation.navigate("bottomFlow")} />
        </View>
    );
}
const styles = StyleSheet.create({});

export default ResolveAuth;