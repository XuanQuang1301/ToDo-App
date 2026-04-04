import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
let isPushing = false;
// Định nghĩa kiểu dữ liệu cho một Task (Todo)
export interface Todo {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  imageBase64: string | null;
}

interface TodoItemProps {
  item: Todo;
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void; 
}

export default function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  const router = useRouter();

  const handlePressDetail = () => {
    router.push({
      pathname: `/task/${item.id}`,
      params: {
        title: item.title,
        desc: item.description,
        image: item.imageBase64, // Truyền chuỗi base64 sang trang detail
      },
    });
  };

  return (
    <View style={styles.itemContainer}>
      {/* PHẦN 1: CHECKBOX (CHỈ DÀNH CHO TOGGLE) */}
      <TouchableOpacity
        style={styles.checkboxTouchable}
        onPress={() => onToggle(item.id)}
        activeOpacity={0.6}
      >
        <Text style={styles.checkBoxIcon}>
          {item.isDone ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>

      {/* PHẦN 2: NỘI DUNG VÀ ẢNH (BẤM VÀO ĐỂ XEM CHI TIẾT) */}
      <TouchableOpacity
        style={styles.contentTouchable}
        onPress={handlePressDetail} // CHỈ ĐỂ XEM CHI TIẾT
        activeOpacity={0.8}
      >
        <View style={styles.textContainer}>
          <Text
            style={[styles.itemTitle, item.isDone && styles.textDone]}
            numberOfLines={1} // Không cho tiêu đề quá 1 dòng
          >
            {item.title}
          </Text>

          {item.description ? (
            <Text
              style={[styles.itemDescription, item.isDone && styles.textDone]}
              numberOfLines={2} // Không cho mô tả quá 2 dòng
            >
              {item.description}
            </Text>
          ) : null}

          {/* Hiển thị ảnh nhỏ (Thumbnail) nếu có */}
          {item.imageBase64 && (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
                style={[styles.todoImage, item.isDone && { opacity: 0.5 }]}
              />
              <Text style={styles.zoomText}>🔍 Chạm để phóng to</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* PHẦN 3: NÚT XÓA */}
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteBtn}
        activeOpacity={0.6}
      >
        <MaterialIcons
          name="delete-forever"
          size={24}
          color={COLORS.danger}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Khung chứa toàn bộ Item
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg, // Thường là màu tối hoặc trắng tùy theme
    padding: 16,
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2, // Tạo bóng đổ nhẹ trên Android
    shadowColor: '#000', // Tạo bóng đổ trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Vùng bấm dành riêng cho Checkbox
  checkboxTouchable: {
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40, // Đảm bảo vùng bấm đủ lớn
  },
  checkBoxIcon: {
    fontSize: 22,
    marginTop: 2,
  },

  // Vùng bấm dành riêng cho Nội dung (Xem chi tiết)
  contentTouchable: {
    flex: 1, // Chiếm toàn bộ diện tích còn lại
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  // Tiêu đề công việc
  itemTitle: {
    color: COLORS.textMain, // Chữ trắng hoặc đen tùy theme
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  // Mô tả công việc
  itemDescription: {
    color: COLORS.textSub, // Chữ xám mờ
    fontSize: 14,
    lineHeight: 20, // Tăng độ giãn dòng cho dễ đọc
  },

  // Style khi công việc đã hoàn thành
  textDone: {
    textDecorationLine: 'line-through', // Gạch ngang chữ
    color: '#888888', // Làm mờ chữ đi
    opacity: 0.6,
  },

  // Vùng chứa ảnh
  imageWrapper: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  todoImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    resizeMode: 'cover', // Giúp ảnh không bị méo
  },
  zoomText: {
    color: COLORS.primary, // Màu xanh lá cây hoặc dương
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Nút Xóa
  deleteBtn: {
    padding: 12,
    backgroundColor: '#2a1212', // Màu nền đỏ tối
    borderRadius: 10,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});