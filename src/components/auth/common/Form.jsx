import React from 'react';
import FormItem from './FormItem';
import Button from './Button';

const Form = ({action, method, fields, errors = {}, button_text, button_class, button_type, onChange, onSubmit, formData = {}}) => {
    return (
        <div className="row justify-content-center">
            
            <form onSubmit={onSubmit} action={`/${action}`} method={method} className="col col-sm-7 col-md-5" id="registration-form">
                {fields.map(field => (
                    <FormItem
                        key={field.id}
                        type={field.type}
                        name={field.name} 
                        value={formData[field.name]}
                        id={field.id}
                        placeholder={field.placeholder}
                        labelName={field.labelName}
                        onChange={onChange}
                        error={errors[field.name]}
                    />
                ))}
                <Button
                    type={button_type} 
                    className={button_class}
                    id={`${action}-btn`}
                    name={button_text}
                />
            </form>
        </div>
    );
}

export default Form;
