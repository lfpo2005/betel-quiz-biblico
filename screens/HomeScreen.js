// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
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
                <Text style={styles.title}>Quiz Bíblico</Text>
                <Text style={styles.subtitle}>Desafio da Fé</Text>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.welcomeText}>Bem-vindo(a), {name}</Text>
                <Text style={styles.scoreText}>Sua pontuação: {totalScore} pontos</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Categories')}
                >
                    <Feather name="play-circle" size={24} color="white" />
                    <Text style={styles.menuButtonText}>Jogar</Text>
                </TouchableOpacity>

                {/* Outros botões podem ser adicionados aqui no futuro */}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho."
                </Text>
                <Text style={styles.footerVerse}>Salmos 119:105</Text>
            </View>
        </SafeAreaView>
    );
};

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
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4B7BEC',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginVertical: 10,
        width: '80%',
    },
    menuButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
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

export default HomeScreen;

// CategoryScreen.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import questionsData from '../data/questions.json';

const CategoryScreen = ({ navigation }) => {
    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate('Quiz', { categoryId: item.id })}
        >
            <Feather name={item.icon} size={24} color="white" />
            <Text style={styles.categoryText}>{item.name}</Text>
            <Text style={styles.categorySubtext}>{item.questions.length} perguntas</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Escolha uma categoria:</Text>

            <FlatList
                data={questionsData.categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
        margin: 15,
        textAlign: 'center',
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

export default CategoryScreen;

// QuizScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import questionsData from '../data/questions.json';

const QuizScreen = ({ route, navigation }) => {
    const { categoryId } = route.params;
    const category = questionsData.categories.find(cat => cat.id === categoryId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30 segundos por pergunta

    const currentQuestion = category.questions[currentQuestionIndex];

    useEffect(() => {
        // Timer para cada pergunta
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    if (!isAnswered) {
                        handleTimeOut();
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, isAnswered]);

    const handleTimeOut = () => {
        setIsAnswered(true);
        // Aguardar um momento antes de passar para a próxima
        setTimeout(() => {
            goToNextQuestion();
        }, 1500);
    };

    const handleOptionPress = (optionIndex) => {
        if (isAnswered) return;

        setSelectedOption(optionIndex);
        setIsAnswered(true);

        if (optionIndex === currentQuestion.correctAnswer) {
            setScore(prevScore => prevScore + currentQuestion.points);
        }

        // Aguardar um momento para mostrar a resposta correta
        setTimeout(() => {
            goToNextQuestion();
        }, 1500);
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < category.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setTimeLeft(30);
        } else {
            // Fim do quiz
            saveResults();
        }
    };

    const saveResults = async () => {
        try {
            // Salvar pontuação total
            const storedScore = await AsyncStorage.getItem('totalScore');
            const currentTotalScore = storedScore ? parseInt(storedScore) : 0;
            const newTotalScore = currentTotalScore + score;

            await AsyncStorage.setItem('totalScore', newTotalScore.toString());

            // Navegar para a tela de resultados
            navigation.navigate('Result', {
                score,
                totalQuestions: category.questions.length,
                categoryName: category.name
            });
        } catch (error) {
            console.log('Error saving results', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar os resultados');
        }
    };

    const getOptionStyle = (optionIndex) => {
        if (!isAnswered) {
            return styles.optionButton;
        }

        if (optionIndex === currentQuestion.correctAnswer) {
            return [styles.optionButton, styles.correctOption];
        }

        if (optionIndex === selectedOption && optionIndex !== currentQuestion.correctAnswer) {
            return [styles.optionButton, styles.wrongOption];
        }

        return styles.optionButton;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Pergunta {currentQuestionIndex + 1} de {category.questions.length}
                </Text>
                <View style={styles.timerContainer}>
                    <Feather name="clock" size={16} color="#636E72" />
                    <Text style={styles.timerText}>{timeLeft}s</Text>
                </View>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={getOptionStyle(index)}
                        onPress={() => handleOptionPress(index)}
                        disabled={isAnswered}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isAnswered && (
                <View style={styles.explanationContainer}>
                    <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                </View>
            )}

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Pontuação: {score}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        padding: 15,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressText: {
        fontSize: 14,
        color: '#636E72',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 14,
        color: '#636E72',
        marginLeft: 5,
    },
    questionContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    questionText: {
        fontSize: 18,
        color: '#2D3436',
        textAlign: 'center',
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    correctOption: {
        backgroundColor: '#26DE81',
        borderColor: '#26DE81',
    },
    wrongOption: {
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
    },
    optionText: {
        fontSize: 16,
        color: '#2D3436',
    },
    explanationContainer: {
        backgroundColor: '#FFF9C4',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    explanationText: {
        fontSize: 14,
        color: '#2D3436',
        fontStyle: 'italic',
    },
    scoreContainer: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3436',
    },
});

export default QuizScreen;

// ResultScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ResultScreen = ({ route, navigation }) => {
    const { score, totalQuestions, categoryName } = route.params;
    const percentage = Math.round((score / (totalQuestions * 10)) * 100);

    let resultMessage = '';
    let resultIcon = '';

    if (percentage >= 80) {
        resultMessage = 'Excelente! Você conhece muito bem a Bíblia!';
        resultIcon = 'award';
    } else if (percentage >= 60) {
        resultMessage = 'Muito bom! Continue estudando a Palavra.';
        resultIcon = 'thumbs-up';
    } else if (percentage >= 40) {
        resultMessage = 'Bom! Você está no caminho certo.';
        resultIcon = 'smile';
    } else {
        resultMessage = 'Continue estudando a Palavra de Deus!';
        resultIcon = 'book-open';
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Eu fiz ${score} pontos (${percentage}%) no Quiz Bíblico na categoria ${categoryName}! Baixe o app e teste seus conhecimentos!`,
            });
        } catch (error) {
            console.log('Error sharing result', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.resultContainer}>
                <Feather name={resultIcon} size={80} color="#4B7BEC" style={styles.resultIcon} />

                <Text style={styles.scoreText}>
                    {score} pontos
                </Text>

                <Text style={styles.percentageText}>
                    {percentage}%
                </Text>

                <Text style={styles.messageText}>
                    {resultMessage}
                </Text>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleShare}
                    >
                        <Feather name="share-2" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Compartilhar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Categories')}
                    >
                        <Feather name="repeat" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Jogar Novamente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Feather name="home" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Menu Principal</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.verseContainer}>
                <Text style={styles.verseText}>
                    "Esforça-te, e tem bom ânimo; não pasmes, nem te espantes; porque o Senhor, teu Deus, é contigo."
                </Text>
                <Text style={styles.verseReference}>
                    Josué 1:9
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        padding: 20,
    },
    resultContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        elevation: 2,
    },
    resultIcon: {
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4B7BEC',
        marginBottom: 5,
    },
    percentageText: {
        fontSize: 24,
        color: '#2D3436',
        marginBottom: 15,
    },
    messageText: {
        fontSize: 18,
        color: '#636E72',
        textAlign: 'center',
        marginBottom: 25,
    },
    buttonsContainer: {
        width: '100%',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4B7BEC',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#26DE81',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    verseContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    verseText: {
        fontSize: 14,
        color: '#636E72',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 5,
    },
    verseReference: {
        fontSize: 12,
        color: '#636E72',
    },
});

export default ResultScreen;