import 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';


//Context Provider
import { Provider as GlobalStateProvider } from './src/context/globalState';

import BottomFlow from './src/screens/bottomFlow';
//Screens
import ResolveAuth from './src/screens/ResolveAuth';
import Login from './src/screens/LoginScreen';

//Components
import Logout from './src/components/Logout';
import SiteHeader from './src/components/SiteHeader';

//Nav stacks
const Stack = createStackNavigator();

const styles = StyleSheet.create({});

export default function App() {
  const navRef = useRef();
  return (

    <NavigationContainer >
      <GlobalStateProvider >
        <Stack.Navigator>
          <Stack.Screen
            name="Resolve"
            component={ResolveAuth}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerLeft: null
            }}
          />
          <Stack.Screen
            name="bottomFlow"
            component={BottomFlow}
            options={{
              headerTitle: props => <SiteHeader {...props} />,
              headerRight: props => <Logout />,
              headerLeft: null
            }}
          />
        </Stack.Navigator>
      </GlobalStateProvider>
    </NavigationContainer>

  );
}




//Header Title will be used for back button on Delivery Screens, will use navigation props to enable feature.