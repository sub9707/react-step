import React from 'react';
import Container from "../common/Container";
import useDarkMode from '../../hooks/useDarkmode';

import ReactIcon from '@/assets/react.svg';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { toggleDarkMode, isDarkMode } = useDarkMode();
    const navigate = useNavigate();

    const homeBtnHandler = () =>{
        navigate('/');
    }

    return (
        <header className="bg-white dark:bg-dark-3">
            <Container>
                <div className="flex items-center justify-between h-16">
                    <button onClick={homeBtnHandler} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <img src={ReactIcon} alt="logo"/>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">React Steps</span>
                    </button>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full cursor-pointer bg-gray-100 text-gray-700 hover:scale-105 transition-transform duration-200 dark:bg-gray-700 dark:text-gray-300"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-7.757l-.707-.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </Container>
        </header>
    );
};

export default Header;