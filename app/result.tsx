// app/result.tsx
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '@/components/Button';
import ScoreDisplay from '@/components/ScoreDisplay';

export default function ResultScreen() {
    const params = useLocalSearchParams();

    const score = parseInt(params.score.toString());
    const totalQuestions = parseInt(params.totalQuestions.toString());
    const categoryName = params.categoryName.toString();

    const totalPossibleScore = totalQuestions * 10;
    const percentage = Math.round((score / totalPossibleScore) * 100);

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
                message: `Eu fiz ${score} pontos (${percentage}%) no Betel Quiz Bíblico na categoria ${categoryName}! Baixe o app e teste seus conhecimentos!`,
            });
        } catch (error) {
            console.log('Error sharing result', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.resultContainer}>
                <Feather name={resultIcon} size={80} color="#4B7BEC" style={styles.resultIcon} />

                <Text style={styles.categoryText}>{categoryName}</Text>

                <ScoreDisplay score={score} total={totalPossibleScore} showIcon={false} />

                <Text style={styles.messageText}>
                    {resultMessage}
                </Text>

                <View style={styles.buttonsContainer}>
                    <Button
                        title="Compartilhar"
                        icon="share-2"
                        onPress={handleShare}
                        color="#4B7BEC"
                    />

                    <Button
                        title="Jogar Novamente"
                        icon="repeat"
                        onPress={() => router.push('/categories')}
                        color="#26DE81"
                        style={{ marginTop: 10 }}
                    />

                    <Button
                        title="Menu Principal"
                        icon="home"
                        onPress={() => router.push('/')}
                        color="#FFA502"
                        style={{ marginTop: 10 }}
                    />
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
}

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
    categoryText: {
        fontSize: 18,
        color: '#636E72',
        marginBottom: 15,
    },
    messageText: {
        fontSize: 18,
        color: '#636E72',
        textAlign: 'center',
        marginVertical: 15,
    },
    buttonsContainer: {
        width: '100%',
        marginTop: 10,
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