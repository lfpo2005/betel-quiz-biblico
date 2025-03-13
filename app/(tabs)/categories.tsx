// app/(tabs)/categories.tsx
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

// Dados de exemplo - você deverá criar um arquivo data/questions.json com estes dados
const categoriesData = [
    {
        id: 1,
        name: 'Antigo Testamento',
        icon: 'book',
        color: '#4B7BEC',
        questionsCount: 10
    },
    {
        id: 2,
        name: 'Novo Testamento',
        icon: 'bookmark',
        color: '#26DE81',
        questionsCount: 10
    },
    {
        id: 3,
        name: 'Personagens Bíblicos',
        icon: 'users',
        color: '#FFA502',
        questionsCount: 10
    },
    {
        id: 4,
        name: 'Versículos Populares',
        icon: 'star',
        color: '#FF6B6B',
        questionsCount: 10
    },
    {
        id: 5,
        name: 'Parábolas de Jesus',
        icon: 'message-circle',
        color: '#A55EEA',
        questionsCount: 10
    }
];

export default function CategoryScreen() {
    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryItem, { backgroundColor: item.color }]}
            onPress={() => router.push({
                pathname: '/quiz',
                params: { categoryId: item.id }
            })}
        >
            <Feather name={item.icon} size={24} color="white" />
            <Text style={styles.categoryText}>{item.name}</Text>
            <Text style={styles.categorySubtext}>{item.questionsCount} perguntas</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Categorias</Text>
                <Text style={styles.headerSubtitle}>Escolha uma categoria para jogar</Text>
            </View>

            <FlatList
                data={categoriesData}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        padding: 20,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#636E72',
        marginTop: 5,
    },
    listContainer: {
        padding: 15,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    categoryText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        flex: 1,
    },
    categorySubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
});