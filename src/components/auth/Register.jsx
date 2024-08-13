import React, { useState } from 'react';
import Header from './common/Header';
import Form from './common/Form';
import useForm from '../../hooks/useForm';
import { registerUser } from '../../utils/authServices';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [errors, setErrors] = useState({})
    const [formData, handleChange] = useForm({
        email: '',
        password: '',
        initialMileage: ''
    })
    const navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault();
        const newErrors = {};

        if(!/^[\w-]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)){
            newErrors.email = 'Invalid email address';
        }
        if(formData.password.length < 5) {
            newErrors.password = 'Password must be at least 5 characters';
        }
        if(!/^\d+$/.test(formData.initialMileage)) {
            newErrors.initialMileage = 'Only positive numbers are allowed';
        }
        setErrors(newErrors);
        if(Object.keys(newErrors).length === 0){
            try {
                const response = await registerUser(formData);
                if (response.success) {
                    navigate('/main', );
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                setErrors({email: error.message})
                console.error('failed to register', error)
            }
        }
    }

    const fields = [
        { type: "email", name: "email", id: "register-email", placeholder: "name@example.com", labelName: "Email address" },
        { type: "password", name: "password", className: "form-control", id: "register-password", placeholder: "Password", labelName: "Password" },
        { type: "text", name: "initialMileage", id: "initial-mileage", placeholder: "Mileage, km", labelName: "Mileage, km" }
    ]
    return (
        <div className="container p-3 mx-auto h-100">
            <Header linkTo="/login"/>
            <Form
                action="register"
                method="post"
                fields={fields}
                errors={errors}
                formData={formData}
                button_text="Register"
                button_class="btn btn-success"
                button_type="submit"
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default Register;
