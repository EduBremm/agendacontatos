import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact } from '../models/Contact';
import Avatar from './Avatar';

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
}

// Card da listagem: exibe avatar com iniciais, nome e telefone do contato
export default function ContactCard({ contact, onPress }: ContactCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Avatar name={contact.name} size={46} fontSize={18} />
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={styles.telefone} numberOfLines={1}>
          {contact.phone}
        </Text>
      </View>
      <Text style={styles.chevron}>{'›'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  telefone: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: '#C7C7CC',
    marginLeft: 8,
  },
});
