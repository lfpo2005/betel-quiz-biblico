// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Button from '@/components/Button';

export default function HomeScreen() {
  const [totalScore, setTotalScore] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedScore = await AsyncStorage.getItem('totalScore');
      const storedName = await AsyncStorage.getItem('playerName');

      if (storedScore) {
        setTotalScore(parseInt(storedScore));
      }

      if (storedName) {
        setName(storedName);
      } else {
        // Se não tiver nome salvo, pode adicionar uma lógica para pedir o nome
        setName('Jogador');
        await AsyncStorage.setItem('playerName', 'Jogador');
      }
    } catch (error) {
      console.log('Error loading data', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Betel Quiz Bíblico</Text>
        <Text style={styles.subtitle}>Desafio da Fé</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.welcomeText}>Bem-vindo(a), {name}</Text>
        <Text style={styles.scoreText}>Sua pontuação: {totalScore} pontos</Text>
      </View>

      <View style={styles.menuContainer}>
        <Button
          title="Jogar"
          icon="play-circle"
          onPress={() => router.push('/categories')}
          color="#4B7BEC"
        />

        <Button
          title="Perfil"
          icon="user"
          onPress={() => router.push('/profile')}
          color="#26DE81"
          style={{ marginTop: 10 }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho."
        </Text>
        <Text style={styles.footerVerse}>Salmos 119:105</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B7BEC',
  },
  subtitle: {
    fontSize: 18,
    color: '#4B7BEC',
    marginTop: 5,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#2D3436',
  },
  scoreText: {
    fontSize: 16,
    color: '#2D3436',
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footerVerse: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 5,
  },
});