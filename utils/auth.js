// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

// URL da sua API
const API_URL = 'http://SEU_IP_LOCAL:8080';

// Configurar o Google Sign-In
export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: 'SEU_WEB_CLIENT_ID_DO_GOOGLE', // use o client ID web, não o do Android
        offlineAccess: true,
    });
};

// Login com o Google
export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        // Enviar o token ID para o backend
        const response = await axios.post(`${API_URL}/api/mobile/auth/google`, {
            idToken: userInfo.idToken,
        });

        // Armazenar o token JWT
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        console.error('Erro ao fazer login com Google:', error);
        throw error;
    }
};

// Logout
export const signOut = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

// Verificar se o usuário está autenticado
export const isAuthenticated = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return !!token;
    } catch (error) {
        return false;
    }
};

// Obter usuário atual
export const getCurrentUser = async () => {
    try {
        const userString = await AsyncStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    } catch (error) {
        return null;
    }
};

// Obter token JWT
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('token');
    } catch (error) {
        return null;
    }
};

// Configurar axios para incluir o token em todas as requisições
export const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};