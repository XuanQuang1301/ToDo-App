import { Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Màn hình Cài đặt</Text>
      <Text style={{ marginTop: 10 }}>Sắp tới sẽ làm nút Dark/Light mode ở đây!</Text>
    </View>
  );
}