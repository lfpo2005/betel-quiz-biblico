// components/ProgressBar.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ProgressBar = ({ current, total, color = '#4B7BEC' }) => {
    const progress = (current / total) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${progress}%`, backgroundColor: color }
                    ]}
                />
            </View>
            <Text style={styles.text}>{`${current} de ${total}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    progressContainer: {
        height: 10,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
    text: {
        fontSize: 12,
        color: '#636E72',
        textAlign: 'right',
        marginTop: 5,
    },
});

export default ProgressBar;