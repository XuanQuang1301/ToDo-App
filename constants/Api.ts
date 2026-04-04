const BASE_URL = 'http://192.168.1.142:8082/api/todos'; 

export const deleteTodoApi = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Không thể xóa công việc');
        return true;
    } catch (error) {
        console.error("Lỗi xóa API:", error);
        return false;
    }
};

export const updateTodoApi = async (id: string, todoData: any) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData), 
        });
        if (!response.ok) throw new Error('Không thể cập nhật công việc');
        return await response.json(); 
    } catch (error) {
        console.error("Lỗi cập nhật API:", error);
        return null;
    }
};