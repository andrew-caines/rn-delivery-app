import React, { useEffect, useContext } from 'react';
import { GlobalStateContext } from '../context/globalState';

const ResolveAuth = ({ navigation }) => {

    const { tryLocalLogin } = useContext(GlobalStateContext);
    useEffect(() => {
        //Look for cached login token
        tryLocalLogin(navigation);
    }, []);

    return null;
}

export default ResolveAuth;