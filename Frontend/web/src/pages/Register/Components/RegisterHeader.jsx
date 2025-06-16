import LoginSwitcher from './LoginSwitcher';

const RegisterHeader = () => {
    return (
        <header className='space-y-4'>
            <h1 className='text-3xl font-bold text-center'>¡Bienvenido a PlagiSmart!</h1>
            <div className="flex justify-center">
                <LoginSwitcher />
            </div>
        </header>
    )
}

export default RegisterHeader;