import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { deleteContact } from '../database/database';
import Avatar from '../components/Avatar';
import PrimaryButton from '../components/PrimaryButton';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ContactDetails'>;
  route: RouteProp<RootStackParamList, 'ContactDetails'>;
};

export default function ContactDetailsScreen({ navigation, route }: Props) {
  const { contact } = route.params;

  // Exibe Alert de confirmação antes de deletar — ação irreversível
  function confirmarExclusao() {
    Alert.alert(
      'Excluir Contato',
      `Deseja excluir "${contact.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteContact(contact.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      {/* Área do avatar e nome principal */}
      <View style={styles.cabecalho}>
        <Avatar name={contact.name} size={88} fontSize={34} />
        <Text style={styles.nome}>{contact.name}</Text>
      </View>

      {/* Card com informações — separador no TOPO de cada linha (exceto a primeira)
          para não depender de saber qual é o último item */}
      <View style={styles.card}>
        <LinhaInfo label="Telefone" valor={contact.phone} primeira />
        {contact.email ? (
          <LinhaInfo label="E-mail" valor={contact.email} />
        ) : null}
        {contact.birthday ? (
          <LinhaInfo label="Aniversário" valor={contact.birthday} />
        ) : null}
      </View>

      {/* Ações */}
      <View style={styles.acoes}>
        <PrimaryButton
          title="Editar Contato"
          onPress={() => navigation.navigate('ContactForm', { contact })}
        />
        <PrimaryButton
          title="Excluir Contato"
          onPress={confirmarExclusao}
          destructive
        />
      </View>
    </ScrollView>
  );
}

// Linha individual do card; primeira=true remove a borda superior (sem separador acima)
function LinhaInfo({
  label,
  valor,
  primeira = false,
}: {
  label: string;
  valor: string;
  primeira?: boolean;
}) {
  return (
    <View style={[styles.linha, !primeira && styles.linhaSeparador]}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  cabecalho: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  nome: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    marginTop: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  linha: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linhaSeparador: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  linhaLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  linhaValor: {
    fontSize: 16,
    color: '#000',
  },
  acoes: {
    gap: 12,
  },
});
