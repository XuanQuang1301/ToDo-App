import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputModal from '../modal';

interface Todo{
  id: string, 
  title: string, 
  description: string, 
  isDone: boolean
} 
export default function App(){
  const [todos, setTodos] = useState([
    {id: '1', title: 'Học React Native', description: "Làm xong phần cơ bản", isDone: false}, 
    {id: '2', title: 'Tập thể dục!!!', description: 'Đều đặn hàng ngày', isDone: true}, 
    {id: '3', title: 'Lam bai tap ve nha', description: 'lam xong', isDone: false}
  ]); 
  const [titleText, setTitletext] = useState(''); 
  const [descText, setDescText] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false); 
  
  const handleAdd = ()=> {
    if(titleText.trim().length === 0){
      Alert.alert("Chưa có phần tiêu đề...", "Bạn cần nhập tiêu đề..."); 
      return; 
    }
    const newTodo = {
      id: Date.now().toString(), 
      title: titleText.trim(), 
      description: descText.trim(), 
      isDone: false
    }; 
  setTodos([newTodo, ...todos]); 
  setTitletext(''); 
  setDescText(''); 
  }
  const toggleTodo = (id: string) => {
    setTodos(todos.map(item => 
      item.id === id ? {...item, isDone: !item.isDone} : item
    ))
  }
  const deleteTodo = (id: string) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa công việc này không?", [
      {text: "Hủy", style: 'cancel'}, 
      {text: "Xóa", style: 'destructive', onPress: () => setTodos(todos.filter(item => item.id !== id))}
    ])
  }
  {/*Giao diện*/}
  const renderTodoItem= ({item} :{item:Todo}) => (
    <View style = {[styles.itemContainer]}> 
      <TouchableOpacity
      style = {styles.itemContentTouchable}
      onPress = {() => toggleTodo(item.id)}
      activeOpacity={0.7}
      > 
      <Text style = {styles.checkBoxIcon}> {item.isDone ? "✅" : "⬜"} </Text>
      <View style = {styles.textContainer}> 
        <Text style = {[styles.itemTitle, item.isDone && styles.textDone]}> 
            {item.title}
        </Text>
        {item.description ? (
          <Text style = {[styles.itemDescription, item.isDone && styles.textDone]} numberOfLines={2}> 
            {item.description}
          </Text>
        ) : null}
      </View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => deleteTodo(item.id)}
      style = {styles.deleteBtn}
      > 
      {/* <Text style = {styles.deleteIcon}>🗑️👊</Text> */}
      <MaterialIcons 
        name="delete-forever" 
        size={22} 
        color={COLORS.danger} 
      />
      </TouchableOpacity>
    </View>
  ) 
  const handleAddData = (title: string, desc: string) => {
    const newTodo = {
      id: Date.now().toString(), 
      title: title.trim(), 
      description: desc.trim(), 
      isDone: false
    }
    setTodos([newTodo, ...todos]); 
    setModalVisible(false); 
  }
  return (
    <SafeAreaView style = {styles.container}>
      <StatusBar style = "light" backgroundColor={COLORS.background}  />
      {/*Header*/}
      <View style = {styles.header}> 
          <Text style = {styles.headerTitle}> My Todo List</Text>
          <Text style = {styles.headerSubtitle}> {todos.filter(t => !t.isDone).length} công việc cần làm!!!</Text>
      </View>
      {/*List công việc*/ }      
      <FlatList 
      data = {todos}
      keyExtractor={item => item.id}
      renderItem={renderTodoItem}
      contentContainerStyle = {styles.listContent}
      keyboardShouldPersistTaps="handled"
      /> 
      <TouchableOpacity 
        style = {styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >  
      <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <InputModal   
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddData}
      />
    </SafeAreaView>
  )
}; 
const COLORS = {
  background: '#121212',    // Nền chính tối hẳn
  cardBg: '#222222',        // Nền của các thẻ (sáng hơn nền chính chút)
  primary: '#00E676',       // Màu xanh lá tươi (Accent color)
  textMain: '#FFFFFF',      // Chữ chính màu trắng
  textSub: '#AAAAAA',       // Chữ phụ (mô tả) màu xám
  border: '#333333',        // Màu viền nhẹ
  danger: '#FF5252'         // Màu đỏ cho nút xóa
};
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.background
  }, 
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.cardBg, 
    padding: 16, 
    borderRadius: 15, 
    marginVertical: 6, 
    borderWidth: 1, 
    borderColor: COLORS.border
  }, 
  itemContentTouchable: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    flex: 1

  }, checkBoxIcon:{
    fontSize: 20, 
    marginRight: 12,  
    marginTop: 2
  }, textContainer:{
    flex: 1, 
    justifyContent: 'center'
  }, 
  itemTitle: {
    color: COLORS.textMain, 
    fontSize: 17, 
    fontWeight: '600', 
    marginBottom: 4
  }, textDone:{
    textDecorationLine: 'line-through', 
    color: '#555555'
  }, itemDescription:{
    color: COLORS.textSub, 
    fontSize: 14
  }, deleteBtn: {
      padding: 10, 
      backgroundColor: '#2a1212', 
      borderRadius: 8, 
      marginLeft: 8
  }, deleteIcon: {
    fontSize: 18, 
    color: COLORS.danger
  }, header:{
    padding: 20, 
    paddingTop: 10, 
    backgroundColor: COLORS.background
  }, headerTitle:{
      fontSize: 28, 
      fontWeight: '800', 
      color: COLORS.primary, 
      marginBottom: 5
  }, headerSubtitle: {
    fontSize: 14, 
    color: 'white', 
  }, 
  listContent: {
    padding: 16, 
    paddingBottom: 20, 
  }, formContainer: {
      padding: 16, backgroundColor: COLORS.cardBg, 
      borderTopWidth: 1, 
      borderTopColor: COLORS.border, 
      borderRadius: 20, 
      elevation: 10,  // tạo bóng đổ
      shadowColor: '#000', 
      shadowOffset: {width: 0, height: -3}, 
      shadowOpacity: 0.2, shadowRadius: 5
  }, inputTitle: {
    backgroundColor: COLORS.background, 
    color: COLORS.textMain, 
    padding: 15, 
    borderRadius: 12, 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: COLORS.border
  }, inputDesc: {
    backgroundColor: COLORS.background, 
    color: COLORS.textMain, 
    padding: 15, 
    borderRadius: 12, 
    fontSize: 14, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    height: 80
  }, addButton:{
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16
  }, 
  addButtonText:{
    fontSize: 16, 
    color: '#000000', 
    fontWeight: 'bold', 
    letterSpacing: 1
  }, 
  fab: {
    position: 'absolute', 
    bottom: 30, 
    right: 20, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    // Tạo bóng đổ cho nút nổi lên trên 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 4}, 
    shadowOpacity:0.3, 
    shadowRadius: 4
  }, 
  fabIcon: {
    fontSize: 32,       // Kích thước dấu cộng
    color: '#000000',   // Màu chữ đen
    fontWeight: 'bold',
    marginTop: -3
  }
})