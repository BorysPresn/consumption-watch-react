import React from 'react';
import Title from '../../UI/Title';
import { Link } from 'react-router-dom';

const Header = ({linkTo}) => {
    return (
        <div className="row text-center mb-3">
            <div className="col title">
                <Title>Welcome to Consumption Watch</Title>
                {
                    linkTo === '/login' ? (
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    ) : (
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    )
                }
                
            </div>
        </div>
    );
}

export default Header;
