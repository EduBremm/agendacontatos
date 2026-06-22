import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Paleta de cores usadas para os avatares — distribuída por hash do nome
const PALETA: string[] = [
  '#4F6EF7',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#C77DFF',
  '#F4A261',
  '#2EC4B6',
  '#E63946',
  '#457B9D',
];

// Mapeia um nome para uma cor da paleta de forma determinística
function corDoNome(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETA[Math.abs(hash) % PALETA.length];
}

// Extrai até 2 iniciais: primeira letra do primeiro e do último nome
function iniciais(name: string): string {
  const partes = name.trim().split(/\s+/);
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return partes[0].substring(0, 2).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
  fontSize?: number;
}

export default function Avatar({ name, size = 44, fontSize = 18 }: AvatarProps) {
  const cor = corDoNome(name || '?');
  const texto = name ? iniciais(name) : '?';

  return (
    <View
      style={[
        styles.circulo,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: cor },
      ]}
    >
      <Text style={[styles.texto, { fontSize }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#fff',
    fontWeight: '700',
  },
});
