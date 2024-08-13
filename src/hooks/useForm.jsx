import {useState} from 'react';

export const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (name, value) => {
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    // const handleSubmit = (callback) => (e) => {
    //     e.preventDefault();
    //     callback(formData);
    // };
    return [formData, handleChange];
};

export default useForm;