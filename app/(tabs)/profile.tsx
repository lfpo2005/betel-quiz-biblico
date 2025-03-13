// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button';
import ScoreDisplay from '@/components/ScoreDisplay';

export default function ProfileScreen() {
    const [name, setName] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [quizzesTaken, setQuizzesTaken] = useState(0);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedName = await AsyncStorage.getItem('playerName');
            const storedScore = await AsyncStorage.getItem('totalScore');
            const storedQuizzes = await AsyncStorage.getItem('quizzesTaken');

            if (storedName) setName(storedName);
            if (storedScore) setTotalScore(parseInt(storedScore));
            if (storedQuizzes) setQuizzesTaken(parseInt(storedQuizzes));
        } catch (error) {
            console.log('Error loading user data', error);
        }
    };

    const saveName = async () => {
        if (name.trim() === '') {
            Alert.alert('Erro', 'O nome não pode estar vazio');
            return;
        }

        try {
            await AsyncStorage.setItem('playerName', name);
            setEditingName(false);
            Alert.alert('Sucesso', 'Nome salvo com sucesso!');
        } catch (error) {
            console.log('Error saving name', error);
            Alert.alert('Erro', 'Não foi possível salvar o nome');
        }
    };

    const resetProgress = async () => {
        Alert.alert(
            'Resetar Progresso',
            'Tem certeza que deseja apagar todo o seu progresso? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sim, resetar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.setItem('totalScore', '0');
                            await AsyncStorage.setItem('quizzesTaken', '0');
                            setTotalScore(0);
                            setQuizzesTaken(0);
                            Alert.alert('Sucesso', 'Seu progresso foi resetado');
                        } catch (error) {
                            console.log('Error resetting progress', error);
                            Alert.alert('Erro', 'Não foi possível resetar o progresso');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Feather name="user" size={50} color="#4B7BEC" />
                </View>

                {editingName ? (
                    <View style={styles.nameEditContainer}>
                        <TextInput
                            style={styles.nameInput}
                            value={name}
                            onChangeText={setName}
                            placeholder="Seu nome"
                            maxLength={20}
                        />
                        <View style={styles.editButtonsRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingName(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={saveName}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.nameContainer}>
                        <Text style={styles.nameText}>{name}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => setEditingName(true)}>
                            <Feather name="edit-2" size={18} color="#4B7BEC" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Pontuação Total</Text>
                        <ScoreDisplay score={totalScore} total={quizzesTaken * 100} />
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Quizzes Concluídos</Text>
                        <Text style={styles.statValue}>{quizzesTaken}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <Button
                    title="Resetar Progresso"
                    icon="refresh-cw"
                    onPress={resetProgress}
                    color="#FF6B6B"
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Betel Quiz Bíblico v1.0.0</Text>
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
        padding: 20,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EBF3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    editButton: {
        marginLeft: 10,
        padding: 5,
    },
    nameEditContainer: {
        width: '100%',
        marginBottom: 20,
    },
    nameInput: {
        borderWidth: 1,
        borderColor: '#DFE6E9',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    editButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#DFE6E9',
    },
    cancelButtonText: {
        color: '#636E72',
        fontWeight: 'bold',
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#4B7BEC',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statsContainer: {
        width: '100%',
    },
    statItem: {
        borderTopWidth: 1,
        borderTopColor: '#DFE6E9',
        paddingVertical: 15,
    },
    statLabel: {
        fontSize: 14,
        color: '#636E72',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    actionsContainer: {
        margin: 20,
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    footerText: {
        color: '#636E72',
        fontSize: 12,
    },
});