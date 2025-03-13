// app/quiz.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import OptionButton from '@/components/OptionButton';
import ProgressBar from '@/components/ProgressBar';

// Dados de exemplo - substitua pelo seu arquivo questions.json
const questionsData = {
    categories: [
        {
            id: 1,
            name: "Antigo Testamento",
            questions: [
                {
                    question: "Quem construiu a arca?",
                    options: ["Abraão", "Moisés", "Noé", "Davi"],
                    correctAnswer: 2,
                    explanation: "Noé construiu a arca conforme Deus ordenou (Gênesis 6:14-22).",
                    points: 10
                },
                {
                    question: "Quantos livros tem o Antigo Testamento?",
                    options: ["27", "39", "46", "66"],
                    correctAnswer: 1,
                    explanation: "O Antigo Testamento possui 39 livros.",
                    points: 10
                }
                // Adicione mais perguntas
            ]
        },
        // Adicione mais categorias
    ]
};

export default function QuizScreen() {
    const params = useLocalSearchParams();
    const categoryId = parseInt(params.categoryId.toString());

    const category = questionsData.categories.find(cat => cat.id === categoryId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30 segundos por pergunta

    const currentQuestion = category.questions[currentQuestionIndex];

    useEffect(() => {
        // Timer para cada pergunta
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    if (!showAnswer) {
                        handleTimeOut();
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, showAnswer]);

    const handleTimeOut = () => {
        setShowAnswer(true);
        // Aguardar um momento antes de passar para a próxima
        setTimeout(() => {
            goToNextQuestion();
        }, 2000);
    };

    const handleOptionPress = (optionIndex) => {
        if (showAnswer) return;

        setSelectedOption(optionIndex);
        setShowAnswer(true);

        if (optionIndex === currentQuestion.correctAnswer) {
            setScore(prevScore => prevScore + currentQuestion.points);
        }

        // Aguardar um momento para mostrar a resposta correta
        setTimeout(() => {
            goToNextQuestion();
        }, 2000);
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < category.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
            setShowAnswer(false);
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

            // Salvar número de quizzes concluídos
            const storedQuizzes = await AsyncStorage.getItem('quizzesTaken');
            const quizzesTaken = storedQuizzes ? parseInt(storedQuizzes) : 0;
            await AsyncStorage.setItem('quizzesTaken', (quizzesTaken + 1).toString());

            // Navegar para a tela de resultados
            router.push({
                pathname: '/result',
                params: {
                    score: score,
                    totalQuestions: category.questions.length,
                    categoryName: category.name
                }
            });
        } catch (error) {
            console.log('Error saving results', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar os resultados');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        Alert.alert(
                            "Sair do Quiz?",
                            "Se você sair agora, perderá seu progresso neste quiz.",
                            [
                                {
                                    text: "Cancelar",
                                    style: "cancel"
                                },
                                {
                                    text: "Sair",
                                    onPress: () => router.back()
                                }
                            ]
                        );
                    }}
                >
                    <Feather name="arrow-left" size={24} color="#4B7BEC" />
                </TouchableOpacity>
                <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>

            <View style={styles.progressContainer}>
                <ProgressBar current={currentQuestionIndex + 1} total={category.questions.length} color="#4B7BEC" />
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
                    <OptionButton
                        key={index}
                        text={option}
                        onPress={() => handleOptionPress(index)}
                        selected={selectedOption === index}
                        correct={index === currentQuestion.correctAnswer}
                        showAnswer={showAnswer}
                        disabled={showAnswer}
                    />
                ))}
            </View>

            {showAnswer && (
                <View style={styles.explanationContainer}>
                    <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                </View>
            )}

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Pontuação: {score}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3436',
        marginLeft: 10,
    },
    progressContainer: {
        marginBottom: 20,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
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