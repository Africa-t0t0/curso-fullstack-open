import { useState, useEffect } from 'react';

const Togglable = (props) => {
    const [visible, setVisible] = useState(props.initialVisible || false);

    // Actualizar el estado visible si initialVisible cambia
    useEffect(() => {
        setVisible(props.initialVisible || false);
    }, [props.initialVisible]);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };
    const cancelButtonLabel = visible ? 'cancel' : 'view';

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button
                    onClick={toggleVisibility}
                    data-testid="toggle-button"
                >{props.buttonLabel}</button>
            </div>
            <div
                className='togglableContent'
                style={showWhenVisible}
            >
                {props.children}
                <button onClick={toggleVisibility}>{cancelButtonLabel}</button>
            </div>
        </div>
    );
};

export default Togglable;
