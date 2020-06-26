import React from 'react';
import { Image, StyleSheet } from 'react-native';

const SiteHeaer = () => {
    return (
        <Image
            style={styles.logo}
            source={require('../../assets/carerx-new-first.png')}
            resizeMethod="resize"
            resizeMode="contain"
        />
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 250,
        height: 55,
    }
});

export default SiteHeaer;