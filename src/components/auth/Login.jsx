import React, { useState } from 'react';
import Header from './common/Header';
import Form from './common/Form';
import { useForm } from '../../hooks/useForm';
import { loginUser } from '../../utils/authServices';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [errors, setErrors] = useState({});
    const [formData, handleChange] = useForm({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        
        if(formData.email.trim() ===''){
            setErrors({email: "Enter login"})
            console.log(formData);
            return;
        }
        if (formData.password.trim() === ''){
            setErrors({password: "Enter password"});
            return;
        }
        try {
            const response = await loginUser(formData);
            if(response.success) {
                console.log('Login successful');
                navigate('/main/');
            } else {
                setErrors({[response.type]: response.message})
            }
        } catch (error) {
            console.error("failed to login", error.message);
        }
    }


    const fields = [
        { type: "email", name: "email", id: "login-email", placeholder: "name@example.com", labelName: "Email address" },
        { type: "password", name: "password", className: "form-control", id: "login-password", placeholder: "Password", labelName: "Password" }
    ]
    return (
        <div className="container p-3 mx-auto h-100">
            <Header linkTo="/register"/>
            <Form
                action="login"
                method="post"
                fields={fields}
                errors={errors}
                button_text="Login"
                button_class="btn btn-success"
                button_type="submit"
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default Login;
