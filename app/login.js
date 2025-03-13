// app/login.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { configureGoogleSignIn, signInWithGoogle, isAuthenticated } from '@/utils/auth';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        configureGoogleSignIn();
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const authenticated = await isAuthenticated();
        if (authenticated) {
            router.replace('/');
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            router.replace('/');
        } catch (error) {
            Alert.alert('Erro de Login', 'Não foi possível fazer login com Google.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Betel Quiz Bíblico</Text>
                <Text style={styles.subtitle}>Teste seu conhecimento bíblico</Text>
            </View>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Faça login para continuar</Text>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                >
                    <Feather name="user" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>
                        {loading ? 'Carregando...' : 'Entrar com Google'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."
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
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4B7BEC',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#636E72',
        textAlign: 'center',
        marginTop: 5,
    },
    loginContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    loginText: {
        fontSize: 16,
        color: '#2D3436',
        marginBottom: 20,
    },
    googleButton: {
        backgroundColor: '#4B7BEC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
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