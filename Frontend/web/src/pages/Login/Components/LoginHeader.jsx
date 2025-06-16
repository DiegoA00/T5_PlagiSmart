import LoginSwitcher from './LoginSwitcher';

const LoginHeader = () => {
    return (
        <header className='space-y-4'>
            <h1 className='text-3xl font-bold text-center'>¡Bienvenido a PlagiSmart!</h1>
            <div className="flex justify-center">
                <LoginSwitcher />
            </div>
            <div className="max-w-md mx-auto">
                <p className='text-sm text-gray-600 text-left mt-6 mb-2'>
                    Ingresa a tu cuenta para acceder a todas las funcionalidades de PlagiSmart.
                </p>
                <p className='text-sm text-gray-600 text-left mb-2'>
                    Si aún no tienes una cuenta, puedes registrarte fácilmente.
                </p>
            </div>
        </header>
    )
}

export default LoginHeader;