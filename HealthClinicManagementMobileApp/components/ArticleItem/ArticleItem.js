import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../configs/constants';

const ArticleItem = ({ article, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={{uri: article.image}} style={{width: '100%', aspectRatio: 16/10, borderRadius: 10}}/>
        <Text style={styles.title}>{article.title.toUpperCase()}</Text>
        <Text style={styles.description}>{article.description}</Text>
        <Text style={styles.description}>{article.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10
  },
  description: {
    fontSize: 14,
    color: COLORS.text_color,
    marginTop: 5,
  },
});

export default ArticleItem;
