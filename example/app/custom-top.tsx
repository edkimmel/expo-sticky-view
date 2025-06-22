import { ExpoStickyView, type StickyChangeEvent } from 'expo-sticky-view';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


type StickyRectangleProps = {  
  height: number;
  topOffset?: number;
  marginTop?: number;
};

const StickyRectangle: React.FC<StickyRectangleProps> = ({ height, marginTop, topOffset }) => {
  const [percent, setPercent] = React.useState(0);
  // In a real app, you would use reanimated spring animations to smooth out the animation between callback invocations.
  const onStickyChange = React.useCallback(
    (event: StickyChangeEvent) => {
      const percentComplete =
        event.currentFloatDistance /
          event.maxFloatDistance;
      setPercent(percentComplete);
    },
    [],
  );

  return (
    <ExpoStickyView
      style={[styles.animationContainer, { height, marginTop }]}
      topOffset={topOffset ?? 0}
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
  )
}

export default function CustomAnimation() {
  const [height, setHeight] = React.useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        onLayout={(evt) => setHeight(evt.nativeEvent.layout.height)}
        overScrollMode="never"
      >
        <Text style={styles.text}>
          Custom Animation Example.{'\n'}
          CSS Equivalent: position: sticky; top: 0{'\n'}
          Shows how to take over vertical scrolling to play a custom animation
          for some pixel "duration".
        </Text>
        <View style={styles.space} />
        <Text style={styles.text}>
          No top offset, no margin, no previous siblings
        </Text>
        <View collapsable={false} style={styles.stickyParent}>
          <StickyRectangle height={height / 2} />
          {/* This is the "duration" of our animation.  This is the height in pixels that our animation container will float over */}
          <View style={{ height: 1500 }} />
        </View>

        <Text style={styles.text}>
          Top offset and margin
        </Text>
        <View collapsable={false} style={styles.stickyParent}>
          {/* Simple example, no top offset, no margin, no previous siblings */}
          <StickyRectangle height={height / 2} topOffset={100} marginTop={100} />
          {/* This is the "duration" of our animation.  This is the height in pixels that our animation container will float over */}
          <View style={{ height: 1500 }} />
        </View>

        <Text style={styles.text}>
          Siblings before the sticky view
        </Text>
        <View collapsable={false} style={styles.stickyParent}>
          <View style={styles.space} />
          {/* Simple example, no top offset, no margin, no previous siblings */}
          <StickyRectangle height={height / 2} topOffset={100} marginTop={100} />
          {/* This is the "duration" of our animation.  This is the height in pixels that our animation container will float over */}
          <View style={{ height: 1500 }} />
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
  stickyParent: {
    backgroundColor: 'gray',
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
