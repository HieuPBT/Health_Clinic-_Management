import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const ArticleDetails = ({ article }) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.description}>{article.description}</Text>
                <Image source={{ uri: article.image }} style={{width: '100%', aspectRatio: 16 / 10, borderRadius: 10 }} />
                <Text style={styles.content}>{article.content}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontWeight: '900',
        fontSize: 24,
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
    },
});

export default ArticleDetails;
