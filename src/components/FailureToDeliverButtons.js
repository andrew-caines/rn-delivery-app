import React from 'react';
import { Button, Text, } from 'react-native-elements';

export const Refused = () => {
    return (
        <Text>Refused</Text>
    )
};

export const NotHome = () => {
    return (
        <Text>Not Home</Text>
    )
};

export const TooLate = () => {
    return (
        <Text>Too Late</Text>
    )
};

export const UnableToCollect = () => {
    return (
        <Text>Unable to Collect</Text>
    )
};

export const Other1 = () => {
    return (
        <Text>Other Reason 1</Text>
    )
};

export const Other2 = () => {
    return (
        <Text>Other Reason 2</Text>
    )
};

export const buttons_group = [
    { element: Refused },
    { element: NotHome },
    { element: TooLate },
    { element: UnableToCollect },
    { element: Other1 },
    { element: Other2 },
]


