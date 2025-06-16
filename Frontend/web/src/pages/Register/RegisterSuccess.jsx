import "../../App.css";

const RegisterSuccess = () => {
  return (
    <div className="flex h-screen bg-white px-10 py-6 gap-10">
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://placehold.co/800x1200.png"
            alt="Anecacao"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold">Registration Successful</h1>
            <p className="text-lg">Thank you for registering!</p>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p>Your account has been created successfully.</p>
          <p>
            If you have any questions, feel free to contact our support team.
          </p>
          <p>
            You can now <strong><a href="/login" className="text-[#9E896A]">log in</a></strong> to your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccess;