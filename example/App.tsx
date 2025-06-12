import { ExpoStickyView, StickyChangeEvent } from 'expo-sticky-view';
import React from 'react';
import { Animated, NativeSyntheticEvent, SafeAreaView, ScrollView, Text, useAnimatedValue, View, ViewStyle } from 'react-native';

export default function App() {
  const [rotation, setRotation] = React.useState(0)
  const onStickyChange = React.useCallback((event: NativeSyntheticEvent<StickyChangeEvent>) => {
    console.log('Sticky change:', event.nativeEvent);
    // For bottom, we are at max float at the start and 0 when complete so inverse the percent
    const percentComplete = 1 - event.nativeEvent.currentFloatDistance / event.nativeEvent.maxFloatDistance;
    setRotation(3600 * percentComplete)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} overScrollMode='never'>
        <View collapsable={false}>
          <ExpoStickyView topOffset={0}>
            <View style={{ height: 500, width: '100%', borderColor: 'red', borderWidth: 5 }}/>
          </ExpoStickyView>
          <ExpoStickyView topOffset={0}>
            <View style={{ height: 500, width: '100%', borderColor: 'green', borderWidth: 5 }}/>
          </ExpoStickyView>
          <ExpoStickyView topOffset={200}>
            <View style={{ height: 500, width: '100%', borderColor: 'blue', borderWidth: 5 }}/>
          </ExpoStickyView>
        </View>
        <View collapsable={false}>
          <View style={{ height: 1500, width: '100%', borderColor: 'yellow', borderWidth: 5 }}/>
          <ExpoStickyView bottomOffset={0} onStickyChange={onStickyChange}>
            <View style={{ height: 200, width: '100%', borderColor: 'red', borderWidth: 5, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[
                { backgroundColor: 'purple', width: 100, height: 100 }, 
                { transform: [{ rotate: `${rotation}deg` }]}
              ]} />
            </View>
          </ExpoStickyView>
        </View>
        <View style={{ height: 1500, width: '100%', borderColor: 'yellow', borderWidth: 5 }}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
};
