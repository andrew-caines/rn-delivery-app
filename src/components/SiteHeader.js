import React from 'react';
import { Image, StyleSheet } from 'react-native';

const SiteHeaer = () => {
    return (
        <Image
            style={styles.logo}
            source={require('../../assets/carerx-logo.png')}
        />
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 250,
        height: 55,
        resizeMode: 'stretch'
    }
});

export default SiteHeaer;