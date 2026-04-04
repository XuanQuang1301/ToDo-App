import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView, Modal,
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
  onSave: (title: string, desc: string, imageBase64: string | null) => void; 
}

export default function InputModal({ visible, onClose, onSave }: InputModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null); 

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync(); 
    if(permissionResult.granted === false){
      Alert.alert("Lỗi", "Bạn đã từ chối quyền truy cập Camera"); 
      return; 
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'], 
      allowsEditing: true, 
      quality: 0.3, 
      base64: true, 
    })
    if(!result.canceled && result.assets[0].base64){
      setImageBase64(result.assets[0].base64); 
    }
  }

  // reset dữ liệu khi mở lên 
  useEffect(() => {
    if(visible){
        setTitle(''); 
        setDesc(''); 
        setImageBase64(null); 
    } 
  }, [visible]); 

  const handleSave = () => {
    if(title.trim().length === 0) {
        Alert.alert('Bạn chưa nhập tiêu đề', 'Vui lòng nhập tiêu đề để lưu công việc')
        return; 
    } 
    onSave(title, desc, imageBase64)
  }

  return (
    <Modal
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
      presentationStyle='pageSheet'
    > 
      <SafeAreaView style={styles.container}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{flex: 1}}
        > 
          {/* HEADER (Chỉ giữ đúng 3 phần tử để space-between hoạt động tốt) */}
          <View style={styles.header}> 
            <TouchableOpacity onPress={onClose} style={styles.cloessBtn}> 
              <Text style={styles.closeText}>Hủy</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Thêm mới</Text>
            
            <TouchableOpacity onPress={handleSave} style={styles.saveBtnTop}> 
                <Text style={styles.saveTextTop}>Lưu</Text>
            </TouchableOpacity>
          </View>

          {/* BODY */}
          <View style={styles.body} > 
            <Text style={styles.label}>Tiêu đề</Text> 
            <TextInput 
              style={styles.inputTitle}
              placeholder='Nhập tên công việc...'
              placeholderTextColor={COLORS.textSub}
              value={title}
              onChangeText={setTitle}
              autoFocus={true}
            /> 
            
            <Text style={styles.label}>Mô tả</Text>
            <TextInput 
              style={styles.inputDesc}
              placeholder='Chi tiết...'
              placeholderTextColor={COLORS.textSub}
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            /> 

            {/* MỚI: Hiển thị ảnh xem trước nếu đã chụp */}
            {imageBase64 && (
              <Image 
                source={{ uri: `data:image/jpeg;base64,${imageBase64}` }} 
                style={styles.previewImage} 
              />
            )}
            <TouchableOpacity style={styles.cameraBtn} onPress={openCamera}>
              <Text style={styles.cameraBtnText}>📷 Chụp ảnh đính kèm</Text>
            </TouchableOpacity>

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
  }, 
  header:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border
  }, 
  cloessBtn:{
    padding: 8
  }, 
  closeText:{
    color: COLORS.textSub, 
    fontSize: 16
  }, 
  headerTitle:{
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.textMain
  }, 
  saveBtnTop:{
    padding: 8
  }, 
  saveTextTop:{
    color: COLORS.primary, 
    fontSize: 16, 
    fontWeight: 'bold'
  }, 
  body: {
    padding: 20, 
    flex: 1, 
  }, 
  inputTitle: {
    backgroundColor: COLORS.inputBg, 
    color: COLORS.textMain, 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: COLORS.border
  }, 
  label: {
    color: 'white', 
    marginBottom: 8, 
    marginTop: 16, 
    fontWeight: '600'
  }, 
  inputDesc: {
    backgroundColor: COLORS.inputBg, 
    color: COLORS.textMain, 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: COLORS.border
  }, 
  addButton: {
    backgroundColor: COLORS.primary, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginTop: 10
  }, 
  addButtonText: {
    color: '#000', 
    fontWeight: 'bold', 
    fontSize: 16
  },
  // STYLE CHO CAMERA VÀ ẢNH
  cameraBtn: { 
    backgroundColor: 'transparent', 
    padding: 14, 
    borderRadius: 12, 
    marginTop: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: COLORS.primary,
    borderStyle: 'dashed'
  },
  cameraBtnText: { 
    color: COLORS.primary, 
    fontWeight: 'bold',
    fontSize: 15
  },
  previewImage: {
    width: 120, 
    height: 120, 
    borderRadius: 12, 
    marginTop: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  }
});