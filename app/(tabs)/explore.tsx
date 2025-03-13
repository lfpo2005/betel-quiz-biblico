import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import verses from '@/data/verses.json';

// Componente simples para substituir o Collapsible
const SimpleCollapsible = ({ title, children }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View style={styles.collapsible}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#4B7BEC"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.collapsibleContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function ExploreScreen() {
  const today = new Date();

  const [dailyVerse, setDailyVerse] = useState(verses[0]);

  const generateNewVerse = () => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    setDailyVerse(verses[randomIndex]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Descubra mais sobre o Quiz Bíblico</Text>
      </View>

      <SimpleCollapsible title="Sobre o Quiz">
        <Text style={styles.text}>
          Este aplicativo contém perguntas sobre diferentes temas bíblicos.
          Teste seus conhecimentos e aumente sua pontuação!
        </Text>
      </SimpleCollapsible>

      <SimpleCollapsible title="Como Jogar">
        <Text style={styles.text}>
          Selecione uma categoria, responda as perguntas dentro do tempo limite
          e veja quantos pontos consegue fazer!
        </Text>
      </SimpleCollapsible>

      <SimpleCollapsible title="Dicas">
        <Text style={styles.text}>
          - Leia atentamente cada pergunta
          {'\n'}- Pense bem antes de responder
          {'\n'}- Estude a Bíblia regularmente para melhorar seu desempenho
        </Text>
      </SimpleCollapsible>

      <SimpleCollapsible title="Versículos Diários">
        <Text style={styles.text}>
          "{dailyVerse.text}"
          {'\n\n'}{dailyVerse.reference}
        </Text>
        <TouchableOpacity style={styles.newVerseButton} onPress={generateNewVerse}>
          <Text style={styles.newVerseButtonText}>Gerar novo versículo</Text>
        </TouchableOpacity>
      </SimpleCollapsible>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#4B7BEC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  collapsible: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  collapsibleHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  collapsibleContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  text: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  newVerseButton: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  newVerseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});