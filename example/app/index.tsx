import { Link } from 'expo-router';
import { ExpoStickyView } from 'expo-sticky-view';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} overScrollMode="never">
        <ExpoStickyView topOffset={0} style={styles.header}>
          <Text style={styles.text}>Expo Sticky View Examples</Text>
        </ExpoStickyView>
        <Link href="/header" style={styles.link}>
          <Text>Sticky header</Text>
        </Link>
        <Link href="/parallax" style={styles.link}>
          <Text>Top Sticky Parallax Slides</Text>
        </Link>
        <Link href="/custom-bottom" style={styles.link}>
          <Text>Bottom Sticky Custom Animation</Text>
        </Link>
        <Link href="/custom-top" style={styles.link}>
          <Text>Top Sticky Custom Animation</Text>
        </Link>
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
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  link: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
