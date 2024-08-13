import React, { useState } from 'react';
import cl from './styles/FormItem.module.css'
const FormItem = (props) => {
    const [text, setText] = useState('');
    const handleInput = (e) => {
        const newValue = e.target.value;
        setText(newValue);
        props.onChange(props.name, newValue);
    }
    return (
        <div className="form-floating mb-3" >
                <input
                    className={`form-control ${props.error ? 'error': ''}`}
                    type={props.type} 
                    name={props.name} 
                    id={props.id} 
                    placeholder={props.placeholder} 
                    value={text}
                    onChange={handleInput} 
                />
                <label htmlFor={props.id}>{props.labelName}</label>
                {props.error && <div className={cl.errorText}>{props.error}</div>}
        </div>
    );
}

export default FormItem;
