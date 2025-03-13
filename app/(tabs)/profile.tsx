// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Button from '@/components/Button';
import ScoreDisplay from '@/components/ScoreDisplay';
import { getCurrentUser, signOut } from '@/utils/auth';

export default function ProfileScreen() {
    const [user, setUser] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [quizzesTaken, setQuizzesTaken] = useState(0);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            // Carregar usuário autenticado
            const userData = await getCurrentUser();
            setUser(userData);

            // Carregar dados do jogo
            const storedScore = await AsyncStorage.getItem('totalScore');
            const storedQuizzes = await AsyncStorage.getItem('quizzesTaken');

            if (storedScore) setTotalScore(parseInt(storedScore));
            if (storedQuizzes) setQuizzesTaken(parseInt(storedQuizzes));
        } catch (error) {
            console.log('Error loading user data', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/login');
                        } catch (error) {
                            console.error('Erro ao fazer logout:', error);
                            Alert.alert('Erro', 'Não foi possível fazer logout');
                        }
                    },
                },
            ]
        );
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
                {user?.pictureUrl ? (
                    <Image source={{ uri: user.pictureUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Feather name="user" size={50} color="#4B7BEC" />
                    </View>
                )}

                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{user?.name || 'Usuário'}</Text>
                    <Text style={styles.emailText}>{user?.email || ''}</Text>
                </View>

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

                <Button
                    title="Sair da Conta"
                    icon="log-out"
                    onPress={handleLogout}
                    color="#636E72"
                    style={{ marginTop: 10 }}
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
        marginBottom: 15,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EBF3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    emailText: {
        fontSize: 14,
        color: '#636E72',
        marginTop: 5,
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