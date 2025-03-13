// components/ScoreDisplay.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ScoreDisplay = ({ score, total, showIcon = true }) => {
    const percentage = Math.round((score / total) * 100) || 0;

    const getColor = () => {
        if (percentage >= 80) return '#26DE81';
        if (percentage >= 60) return '#4B7BEC';
        if (percentage >= 40) return '#FFA502';
        return '#FF6B6B';
    };

    const getIcon = () => {
        if (percentage >= 80) return 'award';
        if (percentage >= 60) return 'thumbs-up';
        if (percentage >= 40) return 'smile';
        return 'book-open';
    };

    return (
        <View style={styles.container}>
            {showIcon && (
                <Feather name={getIcon()} size={24} color={getColor()} style={styles.icon} />
            )}
            <Text style={[styles.text, { color: getColor() }]}>
                {score} / {total} ({percentage}%)
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ScoreDisplay;