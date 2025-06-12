import { ExpoStickyView } from 'expo-sticky-view';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

export default function ParallaxSlides() {
  const [height, setHeight] = React.useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onLayout={(evt) => setHeight(evt.nativeEvent.layout.height)}
        style={styles.container}
      >
        <Text style={styles.text}>
          Parallax Slides Example.{'\n'}
          CSS Equivalent: position: sticky; top: 0{'\n'}
          Shows how to use ExpoStickyView to make full height slides that stick
          to the top one after another.
        </Text>
        <View collapsable={false}>
          <ExpoStickyView
            style={[styles.slide, { borderColor: 'red', height }]}
            topOffset={0}
          >
            <Text style={styles.text}>Slide One</Text>
          </ExpoStickyView>
          <ExpoStickyView
            style={[styles.slide, { borderColor: 'green', height }]}
            topOffset={0}
          >
            <Text style={styles.text}>Slide Two</Text>
          </ExpoStickyView>
          <ExpoStickyView
            style={[styles.slide, { borderColor: 'blue', height }]}
            topOffset={0}
          >
            <Text style={styles.text}>Slide Three</Text>
          </ExpoStickyView>
        </View>
        <View
          style={{
            height: 1500,
            width: '100%',
            borderColor: 'yellow',
            borderWidth: 5,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  slide: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 5,
  },
});
