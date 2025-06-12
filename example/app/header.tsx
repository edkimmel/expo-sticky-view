import { Link } from 'expo-router';
import { ExpoStickyView } from 'expo-sticky-view';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const HEADER_HEIGHT = 50;
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} overScrollMode="never">
        <ExpoStickyView topOffset={0} style={styles.header}>
          <Text style={styles.text}>
            This is a sticky header that all content floats under
          </Text>
        </ExpoStickyView>
        <View style={styles.space} />
        <ExpoStickyView topOffset={HEADER_HEIGHT} style={styles.header}>
          <Text style={styles.text}>
            Except another sticky element configured to stick below it!
          </Text>
        </ExpoStickyView>
        <View style={styles.space} />
        <View style={styles.space} />
        <View style={styles.space} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    zIndex: 1,
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    height: HEADER_HEIGHT,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  space: {
    height: 400,
    width: '100%',
    borderColor: 'yellow',
    borderWidth: 5,
  },
});
