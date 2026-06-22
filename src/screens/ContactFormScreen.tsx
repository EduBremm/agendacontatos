import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { insertContact, updateContact } from '../database/database';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ContactForm'>;
  route: RouteProp<RootStackParamList, 'ContactForm'>;
};

// Interface de erros de validação dos campos obrigatórios
interface ErrosFormulario {
  name?: string;
  phone?: string;
}

// Tela unificada para cadastro e edição — distinguida pela presença de contact nos params
export default function ContactFormScreen({ navigation, route }: Props) {
  const contatoExistente = route.params?.contact;

  // Estado dos campos — pré-populado quando editando
  const [name, setName] = useState(contatoExistente?.name ?? '');
  const [phone, setPhone] = useState(contatoExistente?.phone ?? '');
  const [email, setEmail] = useState(contatoExistente?.email ?? '');
  const [birthday, setBirthday] = useState(contatoExistente?.birthday ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrosFormulario>({});

  // Valida os campos obrigatórios e popula os erros inline
  function validar(): boolean {
    const novosErros: ErrosFormulario = {};
    if (!name.trim()) {
      novosErros.name = 'Nome é obrigatório';
    }
    if (!phone.trim()) {
      novosErros.phone = 'Telefone é obrigatório';
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // Persiste o contato (insert ou update) e volta para a tela anterior
  function salvar() {
    if (!validar()) return;

    setLoading(true);
    try {
      if (contatoExistente) {
        updateContact({
          id: contatoExistente.id,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          birthday: birthday.trim() || undefined,
        });
      } else {
        insertContact({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          birthday: birthday.trim() || undefined,
        });
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label="Nome *"
          value={name}
          onChangeText={(texto) => {
            setName(texto);
            if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
          }}
          placeholder="Ex: João Silva"
          error={errors.name}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <InputField
          label="Telefone *"
          value={phone}
          onChangeText={(texto) => {
            setPhone(texto);
            if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
          }}
          placeholder="Ex: (11) 99999-9999"
          keyboardType="phone-pad"
          error={errors.phone}
          returnKeyType="next"
        />

        <InputField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: joao@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <InputField
          label="Aniversário"
          value={birthday}
          onChangeText={setBirthday}
          placeholder="Ex: 15/03/1990"
          returnKeyType="done"
          onSubmitEditing={salvar}
        />
      </ScrollView>

      {/* Botão Salvar fixo no rodapé, fora do ScrollView */}
      <View style={styles.rodape}>
        <PrimaryButton title="Salvar" onPress={salvar} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 8,
  },
  rodape: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
});
