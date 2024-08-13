 
export const registerUser = async (data) => {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result
    } 
    catch (error) {
        console.error("Failed to redister User", error)
    }
}
    
export const loginUser = async (data) => {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result
    } 
    catch (error) {
        console.error("Failed to login", error)
    }
}
