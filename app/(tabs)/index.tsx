import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterButton from '../../components/FilterButton';
import InputModal from '../../components/InputModal';
import TodoItem from '../../components/TodoItem';
import { COLORS } from '../../constants/colors';

const API_URL = 'http://192.168.1.142:8082/api/todos'; 

export default function App() {
  // 1. Quản lý trạng thái giao diện local
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userToken');
      setUserId(id);
    };
    getUserId();
  }, []);
  // 2. TanStack Query quản lý dữ liệu Server
  const { data: todos = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['todos', userId], 
    queryFn: async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token); 
      if (!token) return [];      
      const response = await fetch(API_URL, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (!response.ok) throw new Error("Server error");
      return response.json();
    },
  });

  // 3. Xử lý Thêm
  const handleAddData = async (title: string, desc: string, imageBase64: string | null) => {
    try {
      const token = await AsyncStorage.getItem('userToken');  
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          isDone: false,
          imageBase64: imageBase64, 
        })
      });

      if (response.ok) {
        setModalVisible(false);
        refetch();
      } else {
        const errorText = await response.text();
        Alert.alert("Lỗi Backend", errorText);
      }
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  // 4. Xử lý Toggle
  const toggleTodo = async (item: any) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/${item.id}`, { 
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...item,
          isDone: !item.isDone 
        })
      });
      if (response.ok) refetch();
    } catch (error) {
      console.error("Lỗi khi update:", error); 
    }
  };

  // 5. Xử lý Xóa
  const deleteTodo = (id: string) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: 'cancel' },
      { text: "Xóa", style: 'destructive', onPress: async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          if (response.ok) refetch(); 
        } catch (error) {
          console.error("Lỗi khi xóa:", error); 
        }
      }}
    ]);
  };

  // 6. Phân đoạn danh sách
  const getSections = () => {
    const activeList = todos.filter((t: any) => !t.isDone); 
    const doneList = todos.filter((t: any) => t.isDone); 
    let sections = []; 
    if (filterStatus !== 'done' && activeList.length > 0) sections.push({ title: 'Đang làm', data: activeList });
    if (filterStatus !== 'active' && doneList.length > 0) sections.push({ title: 'Đã hoàn thành', data: doneList });
    return sections;
  };

  // Màn hình loading
  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.background, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{color: 'white', textAlign: 'center', marginTop: 10}}>Đang kết nối Server...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todo List</Text>
        <Text style={styles.headerSubtitle}>
          {todos.filter((t: any) => !t.isDone).length} công việc cần làm
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton title="Tất cả" value="all" currentStatus={filterStatus} onPress={setFilterStatus} />
        <FilterButton title="Đang làm" value="active" currentStatus={filterStatus} onPress={setFilterStatus} />
        <FilterButton title="Đã xong" value="done" currentStatus={filterStatus} onPress={setFilterStatus} />
      </View>

      <SectionList 
        sections={getSections()}
        onRefresh={refetch}
        refreshing={isRefetching}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TodoItem 
            item={item} 
            onToggle={() => toggleTodo(item)} 
            onDelete={() => deleteTodo(item.id)} 
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có công việc nào...</Text>}
      /> 

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <InputModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleAddData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: 'white' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 50 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, width: 60, height: 60,
    borderRadius: 30, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  fabIcon: { fontSize: 32, color: '#000', fontWeight: 'bold' },
  sectionHeader: {
    color: COLORS.textSub, fontSize: 14, fontWeight: 'bold', 
    marginBottom: 10, marginTop: 20, textTransform: 'uppercase', letterSpacing: 1
  }
});