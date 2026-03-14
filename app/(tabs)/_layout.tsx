import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/colors';
export default function TabLayout(){
    return (
        <Tabs 
        screenOptions={{
            tabBarActiveTintColor: COLORS.primary, 
            tabBarInactiveTintColor: 'gray', 
            tabBarStyle: {backgroundColor: '#1A1A2E', borderTopWidth: 0}, 
            headerStyle: {backgroundColor: '#1A1A2E'}, 
            headerTintColor: '#fff', 
        }}
        >
            {/* Nút Tab 1: Màn hình Todo (chỉ vào file index.tsx của bạn) */}
        <Tabs.Screen
            name="index"
            options={{
            title: 'Công việc',
            tabBarIcon: ({ color }) => <MaterialIcons name="format-list-bulleted" size={24} color={color} />,
            headerShown: false 
            }}
        />
        
        {/* Nút Tab 2: Màn hình Cá nhân */}
        <Tabs.Screen
            name="profile"
            options={{
            title: 'Cá nhân',
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
            }}
        />
        </Tabs>
    )
}