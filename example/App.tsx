import { ExpoStickyView } from 'expo-sticky-view';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function App() {
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
          <ExpoStickyView bottomOffset={0}>
            <View style={{ height: 200, width: '100%', borderColor: 'red', borderWidth: 5 }}/>
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
