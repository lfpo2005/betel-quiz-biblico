// components/Collapsible.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const Collapsible = ({ title, children }) => {
    const [expanded, setExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleExpand = () => {
        setExpanded(!expanded);
        Animated.timing(animation, {
            toValue: expanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const rotateIcon = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleExpand} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                    <Feather name="chevron-down" size={20} color="#636E72" />
                </Animated.View>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    content: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
    },
});

export default Collapsible;