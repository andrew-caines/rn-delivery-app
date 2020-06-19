import React, { useEffect, useRef } from 'react';
import { View,Text } from 'react-native'
import SignatureScreen from 'react-native-signature-canvas';

const SignaturePad = ({ text, onOK }) => {

    const ref = useRef();

    useEffect(() => {
        console.log(`SignatureScreen has loaded....`)
    }, []);

    const handleSignature = signature => {
        console.log(signature)
        onOK(signature)

    }

    const handleClear = () => {
        console.log(`signature data cleared`);
        //clearSignature();
    }

    const handleEnd = () => {
        ref.current.readSignature();
    }
    const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
    /*
    return (
        <Text style={{ backgroundColor: '#6699ff', width: '100%', height: '30%', borderWidth: 5 }}>
        </Text>
    )
    */
    return (
        <View style={{ flex: 1 }}>
            <SignatureScreen
                ref={ref}
                onOK={handleSignature}
                onClear={handleClear}
                autoClear={true}
                descriptionText={text}
                webStyle={style}
            />
        </View>
    );
}

export default SignaturePad;

/*
<Text style={{ backgroundColor: '#6699ff', width: '100%', height: '30%', borderWidth: 5 }}>
</Text>
*/