import React from 'react'
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View
} from 'react-native'

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>CareerOnTrack</Text>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1a1a1a',
    }
});
