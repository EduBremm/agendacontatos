import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e garante que o app funciona corretamente em ambientes Expo Go e builds nativos (Android Studio)
registerRootComponent(App);
