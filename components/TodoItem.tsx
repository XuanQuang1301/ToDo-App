import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
export interface Todo{
    id: string; 
    title: string; 
    description: string; 
    isDone: boolean; 
}
interface TodoItemProps{
    item: Todo; 
    onToggle: (id: string) => void; 
    onDelete: (id: string) => void; 
}
export default function TodoItem({item, onToggle, onDelete} : TodoItemProps){
    return (
        <View style = {styles.itemContainer}> 
            <TouchableOpacity
            style = {styles.itemContentTouchable}
            onPress={() => onToggle(item.id)}
            activeOpacity={0.7}
            > 
                <Text style = {styles.checkBoxIcon}>{item.isDone ? "✅" : "⬜"} </Text>
                <View style={styles.textContainer}> 
                    <Text style = {[styles.itemTitle, item.isDone && styles.textDone]}>     
                        {item.title}
                    </Text>
                    {item.description ? (
                    <Text style = {[styles.itemDescription, item.isDone && styles.textDone]} numberOfLines = {2}> 
                    {item.description} 
                    </Text>
                ) : null}
                </View>
                
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=> onDelete(item.id)}
            style = {styles.deleteBtn}
            > 
                <MaterialIcons name="delete-forever" size={22} color={COLORS.danger} />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    itemContentTouchable: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1
    }, checkBoxIcon: {
        fontSize: 20, marginRight: 12, marginTop: 2
    }, itemTitle: {
        color: COLORS.textMain, fontSize: 17, fontWeight: '600', marginBottom: 6
    }, textDone: {
        textDecorationLine: 'line-through', color: '#555555'
    }, itemDescription: {
        color: COLORS.textSub, fontSize: 14
    }, deleteBtn: {
        padding: 10, backgroundColor: '#2a1212', borderRadius: 8, marginLeft: 8
    }, itemContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 15,
        marginVertical: 6, borderWidth: 1, borderColor: COLORS.border
    }, textContainer: {
        flex: 1, justifyContent: 'center', 
        flexDirection: 'column', 
        alignItems: 'flex-start'
    }
})