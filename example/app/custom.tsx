import { ExpoStickyView, type StickyChangeEvent } from 'expo-sticky-view';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CustomAnimation() {
  const [height, setHeight] = React.useState(0);
  const [percent, setPercent] = React.useState(0);
  // In a real app, you would use reanimated spring animations to smooth out the animation between callback invocations.
  const onStickyChange = React.useCallback(
    (event: StickyChangeEvent) => {
      const percentComplete =
        1 -
        event.currentFloatDistance /
          event.maxFloatDistance;
      setPercent(percentComplete);
    },
    [],
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        onLayout={(evt) => setHeight(evt.nativeEvent.layout.height)}
        overScrollMode="never"
      >
        <Text style={styles.text}>
          Custom Animation Example.{'\n'}
          CSS Equivalent: position: sticky; bottom: 0{'\n'}
          Shows how to take over vertical scrolling to play a custom animation
          for some pixel "duration".
        </Text>
        <View style={styles.space} />
        <View collapsable={false}>
          {/* This is the "duration" of our animation.  This is the height in pixels that our animation container will float over */}
          <View style={{ height: 1500 }} />
          <ExpoStickyView
            style={[styles.animationContainer, { height }]}
            bottomOffset={0}
            onStickyChange={onStickyChange}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={[
                  styles.rectangle,
                  { transform: [{ rotate: `${3600 * percent}deg` }] },
                ]}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <View
                style={[styles.progressBar, { width: `${percent * 100}%` }]}
              />
            </View>
          </ExpoStickyView>
        </View>
        <View style={styles.space} />
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
  animationContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black',
  },
  rectangle: {
    width: 100,
    height: 100,
    backgroundColor: 'purple',
  },
  progressBar: {
    height: 5,
    backgroundColor: 'blue',
    borderRadius: 2.5,
  },
  space: {
    height: 500,
    width: '100%',
    borderColor: 'yellow',
    borderWidth: 5,
  },
});
