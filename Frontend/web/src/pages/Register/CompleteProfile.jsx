import CompleteProfileForm from "./Components/CompleteProfileForm";
import RegisterHeader from "./Components/RegisterHeader";
import "../../App.css";

const CompleteProfile = () => {
  return (
    <div className="flex bg-white px-10 py-6 gap-10">

      <div className="w-full flex items-center justify-center">
        <div className="w-full p-10 bg-white rounded-lg shadow-lg">
          <RegisterHeader title="Completa tu perfil" />
          <CompleteProfileForm />
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
