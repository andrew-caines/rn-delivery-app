import React from 'react';
import { View, StyleSheet } from 'react-native';
import Logo from '../svgs/LogoSVG';

const SiteHeaer = () => {
    return (
        <View style={{ position: 'relative',  right: 75 }}>
            <Logo />
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 250,
        height: 55,
    }
});

export default SiteHeaer;