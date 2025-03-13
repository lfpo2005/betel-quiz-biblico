// components/OptionButton.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const OptionButton = ({ text, onPress, selected, correct, showAnswer, disabled }) => {
    const getBackgroundColor = () => {
        if (showAnswer) {
            if (correct) return '#26DE81'; // verde para correto
            if (selected && !correct) return '#FF6B6B'; // vermelho para incorreto
        }
        if (selected) return '#4B7BEC'; // azul para selecionado
        return 'white'; // padrão
    };

    const getTextColor = () => {
        if (showAnswer && (correct || (selected && !correct))) return 'white';
        if (selected) return 'white';
        return '#2D3436';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() }
            ]}
            onPress={onPress}
            disabled={disabled || showAnswer}
        >
            <Text style={[styles.text, { color: getTextColor() }]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    text: {
        fontSize: 16,
    },
});

export default OptionButton;