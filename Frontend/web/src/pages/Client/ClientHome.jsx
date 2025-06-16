import NavbarClient from './Components/NavbarClient';

function ClientHome() {
  return (
    <div className="flex h-screen">
      <NavbarClient />
      <main className="flex-1 p-10 bg-white">
      </main>
    </div>
  )
}

export default ClientHome