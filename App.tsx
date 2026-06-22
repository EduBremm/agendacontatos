import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './src/types';
import ContactsListScreen from './src/screens/ContactsListScreen';
import ContactDetailsScreen from './src/screens/ContactDetailsScreen';
import ContactFormScreen from './src/screens/ContactFormScreen';

// A importação de database.ts garante que o schema SQLite é criado
// antes de qualquer tela tentar acessar o banco
import './src/database/database';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // GestureHandlerRootView é obrigatório para react-native-gesture-handler v2+
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="ContactsList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F2F2F7',
              shadowColor: 'transparent',
              elevation: 0,
            },
            headerTintColor: '#4F6EF7',
            headerTitleStyle: {
              fontWeight: '700',
              color: '#000',
              fontSize: 17,
            },
            cardStyle: { backgroundColor: '#F2F2F7' },
          }}
        >
          <Stack.Screen
            name="ContactsList"
            component={ContactsListScreen}
            options={{ title: 'Contatos' }}
          />
          <Stack.Screen
            name="ContactDetails"
            component={ContactDetailsScreen}
            options={{ title: 'Detalhes' }}
          />
          <Stack.Screen
            name="ContactForm"
            component={ContactFormScreen}
            options={({ route }) => ({
              title: route.params?.contact ? 'Editar Contato' : 'Novo Contato',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
