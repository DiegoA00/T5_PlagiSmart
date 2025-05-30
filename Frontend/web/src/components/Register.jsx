import './../styles/Register.css';

function Register() {
    return (
        <div className="page-container">
            <h1 className="text-3xl font-bold mb-6">Register</h1>
            <div className= "side-container">
                <div className="image-container">
                    <iframe className="image" src="https://postgrados.espol.edu.ec/sites/default/files/gva-sliderlayer-upload/slider-estudiar/postgradosEspol-estudiar-slider-3.jpg" alt="Placeholder">
                    </iframe>
                    <div className="text-container">
                        <p className="side-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </div>
                </div>
            </div>
            <div className="form-container">
                <div className="form-header">
                    <p className="form-title">
                        Welcome
                    </p>
                    <div className="form-choice">
                        <label class="switch" className="choice-item">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                            <span className="choice-text">Login</span>
                            <input type="checkbox" />
                            <span className="choice-text">Register</span>
                        </label>
                    </div>
                </div>
                <form className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username">
                        </input>

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email">
                        </input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password">
                        </input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password">
                        </input>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Register
                    </button>
                    <p className="mt-4 text-sm text-gray-600">
                        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;