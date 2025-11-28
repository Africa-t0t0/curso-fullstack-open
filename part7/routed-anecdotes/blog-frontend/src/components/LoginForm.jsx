import React from 'react'

const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => {
    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit({ username, password });
      };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="username">username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button id="login-button" type="submit">login!</button>
            </form>
        </div>
    )
}

export default LoginForm