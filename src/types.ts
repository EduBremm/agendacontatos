import { Contact } from './models/Contact';

// Tipagem das rotas do Stack Navigator
export type RootStackParamList = {
  ContactsList: undefined;
  ContactDetails: { contact: Contact };
  ContactForm: { contact?: Contact };
};
