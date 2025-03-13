// components/Button.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Button = ({ title, onPress, icon, color = '#4B7BEC', style }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: color },
                style
            ]}
            onPress={onPress}
        >
            {icon && <Feather name={icon} size={20} color="white" style={styles.icon} />}
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 10,
    },
});

export default Button;