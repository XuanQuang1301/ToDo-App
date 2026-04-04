import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteTodoApi } from '../../constants/Api';
import { COLORS } from '../../constants/colors';

const BASE_URL = 'http://192.168.1.142:8082/api/todos'; 

export default function TaskDetail() {
    const { id, title, desc, image, isDone } = useLocalSearchParams();
    const router = useRouter();
    const [newTitle, setNewTitle] = useState(title as string);
    const [newDesc, setNewDesc] = useState(desc as string);
    const [newImage, setNewImage] = useState(image as string | null);
    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa công việc "${title}" không? Hành động này không thể hoàn tác.`,
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xóa", 
                    style: "destructive", 
                    onPress: async () => {
                        console.log("Đang xóa Task ID:", id);
                        const success = await deleteTodoApi(id as string);
                        if (success) {
                            Alert.alert("Thành công", "Đã xóa công việc!");
                            router.replace('/(tabs)'); 
                        } else {
                            Alert.alert("Lỗi", "Không thể xóa công việc này.");
                        }
                    } 
                }
            ]
        );
    };

    // 3. Hàm xử lý Lưu thay đổi (Update Task)
    const handleSave = async () => {
    // Tạo object dữ liệu chuẩn để gửi lên Spring Boot
    const updateData = {
        title: newTitle,
        description: newDesc,
        imageBase64: newImage,
        // Ép kiểu chuẩn xác, tránh việc params bị hiểu nhầm thành chuỗi "true"/"false"
        isDone: isDone === 'true'  
    };

    console.log("Dữ liệu gửi đi:", updateData);

    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            Alert.alert("Thành công", "Đã cập nhật công việc!");
            // Quan trọng: Dùng replace để ép trang chủ load lại hoàn toàn
            router.replace('/(tabs)'); 
        }
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
    }
};

    // 4. Hàm xử lý Chụp ảnh mới (giống trang chủ)
    const takePhoto = async () => {
        // Yêu cầu quyền camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Bạn cần cấp quyền truy cập Camera!");
            return;
        }

        // Mở Camera
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
            base64: true, // Lấy chuỗi base64
        });

        if (!result.canceled && result.assets[0].base64) {
            setNewImage(result.assets[0].base64); // Cập nhật ảnh mới vào State
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            {/* 💡 SỬ DỤNG STACK.SCREEN ĐỂ ĐẶT NÚT LÊN HEADER */}
            <Stack.Screen 
                options={{
                    title: 'Chỉnh sửa công việc', // Đổi tiêu đề header
                    headerShown: true,
                    headerStyle: { backgroundColor: '#1A1A2E' }, // Đồng bộ màu drawer
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    
                    // NÚT PHẢI: XÓA & LƯU
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 20 }}>
                                <MaterialIcons name="delete-forever" size={26} color={COLORS.danger} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave}>
                                <MaterialIcons name="check-circle" size={26} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    ),
                }} 
            />

            {/* Khung Chỉnh sửa Tiêu đề */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tiêu đề:</Text>
                <TextInput
                    style={styles.input}
                    value={newTitle}
                    onChangeText={setNewTitle}
                    placeholder="Nhập tiêu đề công việc..."
                    placeholderTextColor="#666"
                />
            </View>

            {/* Khung Chỉnh sửa Mô tả */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Mô tả chi tiết:</Text>
                <TextInput
                    style={[styles.input, styles.descInput]}
                    value={newDesc}
                    onChangeText={setNewDesc}
                    placeholder="Nhập mô tả..."
                    placeholderTextColor="#666"
                    multiline={true} // Cho phép nhập nhiều dòng
                    numberOfLines={4}
                    textAlignVertical="top" // Chữ bắt đầu từ đỉnh
                />
            </View>

            {/* Khung Chỉnh sửa/Hiển thị Ảnh */}
            <View style={styles.imageContainer}>
                <Text style={styles.label}>Hình ảnh:</Text>
                {newImage ? (
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${newImage}` }}
                            style={styles.fullImage}
                            resizeMode="cover"
                        />
                        {/* Nút Xóa ảnh hiện tại */}
                        <TouchableOpacity style={styles.removeImageBtn} onPress={() => setNewImage(null)}>
                            <MaterialIcons name="cancel" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.noImage}>
                        <Text style={{ color: '#666', fontStyle: 'italic' }}>Không có ảnh đính kèm</Text>
                    </View>
                )}
                
                {/* Nút Chụp ảnh mới */}
                <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                    <MaterialIcons name="add-a-photo" size={22} color="white" />
                    <Text style={styles.photoBtnText}>
                        {newImage ? "Chụp ảnh thay thế" : "Chụp ảnh đính kèm"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Nút Quay lại hệ thống (đã có ở header), ta có thể xóa nút thủ công đi */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Màu tối giống drawer
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginVertical: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary, // Màu xanh lá
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 15,
        fontSize: 17,
        color: 'white',
        backgroundColor: '#1A1A2E', // Màu nền input tối
    },
    descInput: {
        height: 120, // Tăng chiều cao cho mô tả
    },
    imageContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
    },
    fullImage: {
        width: '100%',
        height: 350,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#333',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 5,
        borderRadius: 20,
    },
    noImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#1A1A2E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    photoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00E676', // Xanh lá cây
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 15,
        elevation: 5,
    },
    photoBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});