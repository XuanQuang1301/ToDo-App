import React, { useEffect, useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';


interface InputModalProps {
  visible: boolean;                        // Trạng thái ẩn/hiện
  onClose: () => void;                     // Hàm để đóng modal
  onSave: (title: string, desc: string) => void; // Hàm để lưu dữ liệu
}

export default function InputModal({ visible, onClose, onSave }: InputModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  //reset dữ liệu khi mở lên 
  useEffect(() => {
    if(visible){
        setTitle(''); 
        setDesc(''); 
    } 
  }, [visible]); 
  const handleSave = () => {
    if(title.trim().length === 0) {
        Alert.alert('Bạn chưa nhập tiêu đề', 'Vui lòng nhập tiêu đề để lưu công việc')
        return; 
    } 
    onSave(title, desc)
  }
  return (
    <Modal
    animationType = 'slide'
    visible={visible}
    onRequestClose={onClose}
    presentationStyle='pageSheet'
    > 
    <SafeAreaView style = {styles.container}> 
        <KeyboardAvoidingView
        behavior= {Platform.OS === "ios" ? "padding" : "height"}
        style = {{flex: 1}}
        > 
        <View style = {styles.header}> 
            <TouchableOpacity
            onPress={onClose}
            style = {styles.cloessBtn}
            > 
            <Text style = {styles.closeText}> Hủy </Text>
            </TouchableOpacity>
            <Text style = {styles.headerTitle}> Thêm mới </Text>
            <TouchableOpacity
            onPress={handleSave}
            style = {styles.saveBtnTop}
            > 
                <Text style = {styles.saveTextTop}>Lưu</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.body} > 
            <Text style = {styles.label}> Tiêu đề </Text> 
                <TextInput 
                style = {styles.inputTitle}
                placeholder=' Nhập tên công việc...'
                placeholderTextColor={COLORS.textSub}
                value= {title}
                onChangeText={setTitle}
                autoFocus = {true}
            /> 
            <Text style = {styles.label}>Mô tả</Text>
            <TextInput 
                style = {styles.inputDesc}
                placeholder=' Chi tiết...'
                placeholderTextColor={COLORS.textSub}
                value= {desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            /> 
            <TouchableOpacity style={styles.addButton} onPress={handleSave}>
              <Text style={styles.addButtonText}>LƯU CÔNG VIỆC</Text>
            </TouchableOpacity>
        </View> 
        </KeyboardAvoidingView>
    </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.background, 

  }, header:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border
  }, cloessBtn:{
    padding: 8
  }, closeText:{
    color: COLORS.textSub, 
    fontSize: 16
  }, headerTitle:{
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.textMain
  }, saveBtnTop:{
    padding: 8
  }, saveTextTop:{
    color: COLORS.primary, 
    fontSize: 16, 
    fontWeight: 'bold'
  }, body: {
    padding: 20, 
    flex: 1, 
  }, inputTitle: {
    backgroundColor: COLORS.inputBg, 
    color: COLORS.textMain, 
    borderRadius: 12, 
    padding: 16, fontSize: 16, 
    borderWidth: 1, 
    borderColor: COLORS.border
  }, label: {
    color: 'white', 
    marginBottom: 8, 
    marginTop: 16, 
    fontWeight: '600'
  }, inputDesc: {
    backgroundColor: COLORS.inputBg, 
    color: COLORS.textMain, 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: COLORS.border
  }, addButton: {
    backgroundColor: COLORS.primary, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginTop: 20
  }, addButtonText: {
    color: '#000', 
    fontWeight: 'bold', 
    fontSize: 16
  }
});