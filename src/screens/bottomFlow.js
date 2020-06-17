import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
//Screens
import FeedScreen from './FeedScreen';
import DeliveryToHome from './DeliveryToHomeScreen';
import DeliveryToClient from './DeliveryToClientScreen';
import FailureToDeliver from './FailureToDeliverScreen';

const Tab = createBottomTabNavigator();

const BottomFlow = (props) => {
    return (
        <Tab.Navigator initialRouteName="Feed">
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    tabBarIcon: () => <Feather name="activity" size={24} color="black" />
                }}
            />
            <Tab.Screen
                name="Delivery To Home"
                component={DeliveryToHome}
                options={{
                    tabBarIcon: () => <Feather name="home" size={24} color="black" />
                }}
            />
            <Tab.Screen
                name="Delivery To Client"
                component={DeliveryToClient}
                options={{
                    tabBarIcon: () => <Feather name="users" size={24} color="black" />
                }}
            />
            <Tab.Screen
                name="Failure To Deliver"
                component={FailureToDeliver}
                options={{
                    tabBarIcon: () => <Feather name="alert-circle" size={24} color="black" />
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomFlow;