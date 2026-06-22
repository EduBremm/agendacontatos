import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  destructive?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

// Botão primário reutilizável; destructive=true usa cor vermelha de ação perigosa
export default function PrimaryButton({
  title,
  onPress,
  destructive = false,
  loading = false,
  style,
  disabled = false,
}: PrimaryButtonProps) {
  const inativo = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        destructive ? styles.destrutivo : styles.primario,
        inativo && styles.inativo,
        style,
      ]}
      onPress={onPress}
      disabled={inativo}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.texto}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primario: {
    backgroundColor: '#4F6EF7',
  },
  destrutivo: {
    backgroundColor: '#FF3B30',
  },
  inativo: {
    opacity: 0.6,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
