import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen() {
  const openGitHub = () => {
    Linking.openURL('https://github.com/XuanQuang1301');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1. Phần Header: Avatar và Thông tin cơ bản */}
      <View style={styles.header}>
        {/* Lấy trực tiếp avatar từ GitHub của bạn */}
        <Image
          source={{ uri: 'https://github.com/XuanQuang1301.png' }} 
          style={styles.avatar}
        />
        <Text style={styles.name}>Xuân Quang</Text>
        <Text style={styles.title}> 💻</Text>
        
        <TouchableOpacity style={styles.githubBtn} onPress={openGitHub} activeOpacity={0.8}>
          <MaterialIcons name="code" size={20} color="white" />
          <Text style={styles.githubText}>Github - @XuanQuang1301</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Phần Kỹ năng công nghệ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kỹ năng công nghệ</Text>
        <View style={styles.skillsContainer}>
          {['React Native', 'Spring Boot', 'Java', 'Node.js', 'React', 'MySQL', 'C++', 'Python'].map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Phần Dự án tiêu biểu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dự án đang thực hiện</Text>
        
        <View style={styles.projectCard}>
          <Text style={styles.projectName}>📱 My-App (Todo List)</Text>
          <Text style={styles.projectDesc}>Ứng dụng quản lý công việc Fullstack tích hợp Camera và tối ưu hiệu năng.</Text>
        </View>

        <View style={styles.projectCard}>
          <Text style={styles.projectName}>🛠️ Mini-Jira</Text>
          <Text style={styles.projectDesc}>Hệ thống quản lý dự án cho môn Cơ sở dữ liệu phân tán.</Text>
        </View>

        <View style={styles.projectCard}>
          <Text style={styles.projectName}>✈️ Smart Travel</Text>
          <Text style={styles.projectDesc}>Website tư vấn du lịch thông minh.</Text>
        </View>

        <View style={styles.projectCard}>
          <Text style={styles.projectName}>🛡️ Cloud Security</Text>
          <Text style={styles.projectDesc}>Đồ án an toàn bảo mật hệ thống thông tin (AWS/AzureGoat).</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    alignItems: 'center', 
    padding: 30, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border 
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginBottom: 15, 
    borderWidth: 3, 
    borderColor: COLORS.primary 
  },
  name: { 
    color: COLORS.primary, 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  title: { 
    color: COLORS.textSub, 
    fontSize: 16, 
    marginBottom: 15 
  },
  githubBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#333', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#555'
  },
  githubText: { 
    color: 'white', 
    marginLeft: 8, 
    fontWeight: '600',
    fontSize: 15
  },
  section: { 
    padding: 20 
  },
  sectionTitle: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  skillsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  skillBadge: { 
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: COLORS.primary 
  },
  skillText: { 
    color: COLORS.primary, 
    fontSize: 14,
    fontWeight: '600'
  },
  projectCard: { 
    backgroundColor: '#16213E',
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  projectName: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 6 
  },
  projectDesc: { 
    color: COLORS.textSub, 
    fontSize: 14, 
    lineHeight: 20 
  }
});