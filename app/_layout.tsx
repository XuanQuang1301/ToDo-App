import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

function CustomDrawerContent(props: any) {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn thoát tài khoản?", [
      { text: "Hủy", style: 'cancel' },
      { 
        text: "Thoát", 
        style: 'destructive', 
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          props.setUserToken(null);
        } 
      }
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fff' }}>
        {/* Header Drawer */}
        <View style={{ padding: 20, backgroundColor: '#1A1A2E', alignItems: 'center', marginTop: -50, paddingTop: 60, paddingBottom: 20 }}>
          <Image
            source={{ uri: 'https://github.com/XuanQuang1301.png' }}
            style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#00E676' }}
          />
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Xuân Quang</Text>
          <Text style={{ color: 'gray', fontSize: 14 }}>Lập trình viên React Native</Text>
        </View>
        
        <View style={{ flex: 1, paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Nút Đăng xuất thực tế */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
          onPress={handleLogout} 
        >
          <View style={{ width: 40 }}>
            <MaterialIcons name="logout" size={22} color="#f44336" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#f44336' }}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter(); 
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
    setIsReady(true);
  };

  useEffect(() => {
    checkLoginStatus();
  }, [segments]); // Kiểm tra lại mỗi khi chuyển màn hình

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!userToken && !inAuthGroup) {
      router.replace('/login');
    } else if (userToken && inAuthGroup) {
      router.replace('/');
    }
  }, [userToken, isReady, segments]);

  if (!isReady) return null;

  if (!userToken) {
    return (
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" /> 
          <Stack.Screen name="register" />
        </Stack>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}> 
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer 
          drawerContent={(props) => <CustomDrawerContent {...props} setUserToken={setUserToken} />}
          screenOptions={{ 
              headerTintColor: '#fff', 
              headerStyle: { backgroundColor: '#1A1A2E' },
              drawerActiveBackgroundColor: '#e3f2fd',
              drawerActiveTintColor: '#2196f3'
          }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Trang chủ',
              title: 'My Todo App', 
            }}
          />
          
          <Drawer.Screen
            name="setting"
            options={{
              drawerLabel: 'Cài đặt',  
              title: 'Cài đặt hệ thống',
            }}
          />

          {/* Ẩn các màn hình phụ khỏi Menu Drawer */}
          <Drawer.Screen
            name="task/[id]" 
            options={{
              drawerItemStyle: { display: 'none' }, 
              title: 'Chi tiết công việc', 
              headerLeft: () => (
                  <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
                      <MaterialIcons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
              ),
            }}
          />

          <Drawer.Screen
            name="(auth)"
            options={{
              drawerItemStyle: { display: 'none' },
              headerShown: false
            }}
          />
          <Drawer.Screen 
            name="(auth)/login" 
            options={{ drawerItemStyle: { display: 'none' } }} 
          />
          <Drawer.Screen 
            name="(auth)/register" 
            options={{ drawerItemStyle: { display: 'none' } }} 
          />
        </Drawer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}