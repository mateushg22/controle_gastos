import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GastosScreen from './screens/GastosScreen';
import NovoGastoScreen from './screens/NovoGastoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Gastos" component={GastosScreen} />
        <Stack.Screen name="NovoGasto" component={NovoGastoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
