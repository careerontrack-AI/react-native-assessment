import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// TODO: Task 1 - Complete Login Screen
// The UI is already set up! You just need to:
// 1. Call login() from useAuth() hook when button is pressed
// 2. Show loading state (use the loading state variable)
// 3. Show error message if login fails (use Alert.alert)
// 
// Hint: The form validation is already done, just implement handleLogin function!

export default function SplashScreeen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>CareerOnTrack</Text>
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

