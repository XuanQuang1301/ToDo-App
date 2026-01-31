import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
interface FilterButtonProps{
    title: string, 
    value: string, 
    currentStatus: string; 
    onPress: (value: string) => void; 
}
export default function FilterButton({title, value, currentStatus, onPress} : FilterButtonProps){
    const isActive = currentStatus === value; 
    return (
        <TouchableOpacity
        onPress={() => onPress(value)}
        style = {[styles.filterBtn, isActive && styles.filterBtnActive]}
        > 
            <Text style = {[styles.filterText, isActive && styles.filterTextActive]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create ({
    filterBtn: {
        paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
        borderWidth: 1, borderColor: COLORS.border, marginRight: 10,
        backgroundColor: COLORS.cardBg
    }, filterBtnActive: {
        backgroundColor: COLORS.primary, 
        borderColor: COLORS.primary
    }, filterText: {
        color: COLORS.textSub, 
        fontWeight: '600', 
        fontSize: 13
    }, filterTextActive: {
        color: '#000', 
        fontWeight: 'bold'
    }
})
