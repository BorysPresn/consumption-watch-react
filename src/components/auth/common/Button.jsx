import React from 'react';

const Button = (props) => {
    return (
        <button type={props.type} className={props.className} id={props.id}>{props.name}</button>
    );
}

export default Button;
