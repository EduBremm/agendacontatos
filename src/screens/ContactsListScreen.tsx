import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAllContacts } from '../database/database';
import { Contact } from '../models/Contact';
import { RootStackParamList } from '../types';
import ContactCard from '../components/ContactCard';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ContactsList'>;
};

export default function ContactsListScreen({ navigation }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [busca, setBusca] = useState('');

  // Recarrega a lista toda vez que a tela recebe foco (ex.: ao voltar do formulário)
  useFocusEffect(
    useCallback(() => {
      setContacts(getAllContacts());
    }, [])
  );

  // Configura o botão "+" no canto direito do header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.botaoHeader}
          onPress={() => navigation.navigate('ContactForm', { contact: undefined })}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.textoBotaoHeader}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Filtro local: compara nome e telefone com o texto de busca
  const contatosFiltrados = contacts.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.name.toLowerCase().includes(termo) ||
      c.phone.includes(busca)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.barraBusca}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por nome ou telefone..."
          placeholderTextColor="#8E8E93"
          value={busca}
          onChangeText={setBusca}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={contatosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onPress={() => navigation.navigate('ContactDetails', { contact: item })}
          />
        )}
        contentContainerStyle={
          contatosFiltrados.length === 0
            ? styles.listaVaziaContainer
            : styles.listaConteudo
        }
        ListEmptyComponent={
          <View style={styles.estadoVazio}>
            <View style={styles.iconePlaceholder}>
              <Text style={styles.iconeTitulo}>AB</Text>
            </View>
            <Text style={styles.tituloVazio}>
              {busca ? 'Nenhum resultado' : 'Nenhum contato ainda'}
            </Text>
            <Text style={styles.subtituloVazio}>
              {busca
                ? 'Tente outro nome ou número de telefone.'
                : 'Toque em "+" para adicionar seu primeiro contato.'}
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  barraBusca: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputBusca: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  listaConteudo: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  listaVaziaContainer: {
    flex: 1,
  },
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  iconePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconeTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8E8E93',
  },
  tituloVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtituloVazio: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  botaoHeader: {
    marginRight: 16,
    padding: 4,
  },
  textoBotaoHeader: {
    fontSize: 30,
    color: '#4F6EF7',
    fontWeight: '300',
    lineHeight: 34,
  },
});
