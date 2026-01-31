import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterButton from '../../components/FilterButton';
import InputModal from '../../components/InputModal';
import TodoItem, { Todo } from '../../components/TodoItem';
import { COLORS } from '../../constants/colors';

const STORAGE_KEY = 'MY_TODO_APP_DATA';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // --- LOGIC STORAGE ---
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) setTodos(JSON.parse(jsonValue));
      } catch (e) { console.error("Lỗi đọc data"); }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (e) { console.error("Lỗi lưu data"); }
    }
    saveTodos();
  }, [todos]);

  // --- LOGIC XỬ LÝ ---
  const handleAddData = (title: string, desc: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      description: desc.trim(),
      isDone: false
    };
    setTodos([newTodo, ...todos]);
    setModalVisible(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(item =>
      item.id === id ? { ...item, isDone: !item.isDone } : item
    ));
  };

  const deleteTodo = (id: string) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: 'cancel' },
      { text: "Xóa", style: 'destructive', onPress: () => setTodos(todos.filter(i => i.id !== id)) }
    ]);
  };

  const getFilteredList = () => {
    if (filterStatus === 'active') return todos.filter(t => !t.isDone);
    if (filterStatus === 'done') return todos.filter(t => t.isDone);
    return todos;
  };

  // --- GIAO DIỆN CHÍNH ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todo List</Text>
        <Text style={styles.headerSubtitle}>
          {todos.filter(t => !t.isDone).length} công việc cần làm
        </Text>
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <FilterButton title="Tất cả" value="all" currentStatus={filterStatus} onPress={setFilterStatus} />
        <FilterButton title="Đang làm" value="active" currentStatus={filterStatus} onPress={setFilterStatus} />
        <FilterButton title="Đã xong" value="done" currentStatus={filterStatus} onPress={setFilterStatus} />
      </View>

      {/* Danh sách */}
      <FlatList
        data={getFilteredList()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        // Gọi Component TodoItem 
        renderItem={({ item }) => (
          <TodoItem item={item} onToggle={toggleTodo} onDelete={deleteTodo} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có công việc nào</Text>
        }
      />

      {/* Nút FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal Nhập liệu */}
      <InputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddData}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingTop: 10, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: 'white' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 50 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, width: 60, height: 60,
    borderRadius: 30, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4
  },
  fabIcon: { fontSize: 32, color: '#000', fontWeight: 'bold', marginTop: -3 }
});