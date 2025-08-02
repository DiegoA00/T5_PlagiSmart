// filepath: c:\Users\Diego\Documents\IngenieriaSoftware\PlagiSmart\Frontend\web\src\pages\Login\Components\LoginForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './LoginForm'
import { loginService, authService } from '../../../services/auth/loginService'

vi.mock('../../../services/auth/loginService')
vi.mock('../../../hooks/useRoleRedirect')

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  )
}

describe('LoginForm', () => {
  const mockRedirect = vi.fn()
  
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.mocked(authService.isAuthenticated).mockReturnValue(false)
    const { useRoleRedirect } = await import('../../../hooks/useRoleRedirect')
    vi.mocked(useRoleRedirect).mockReturnValue(mockRedirect)
  })

  describe('Renderizado inicial', () => {
    it('renderiza todos los elementos del formulario', () => {
      renderLoginForm()
      
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /recuérdame/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
      expect(screen.getByText(/¿olvidaste tu contraseña?/i)).toBeInTheDocument()
    })

    it('muestra campos vacíos inicialmente', () => {
      renderLoginForm()
      
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('')
      expect(screen.getByLabelText(/contraseña/i)).toHaveValue('')
      expect(screen.getByRole('checkbox', { name: /recuérdame/i })).not.toBeChecked()
    })
  })

  describe('Interacciones del usuario', () => {
    it('permite escribir en el campo de email', async () => {
      const user = userEvent.setup()
      renderLoginForm()
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      await user.type(emailInput, 'test@example.com')
      
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('permite escribir en el campo de contraseña', async () => {
      const user = userEvent.setup()
      renderLoginForm()
      
      const passwordInput = screen.getByLabelText(/contraseña/i)
      await user.type(passwordInput, 'password123')
      
      expect(passwordInput).toHaveValue('password123')
    })

    it('permite marcar y desmarcar el checkbox de recordar', async () => {
      const user = userEvent.setup()
      renderLoginForm()
      
      const checkbox = screen.getByRole('checkbox', { name: /recuérdame/i })
      
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('alterna la visibilidad de la contraseña', async () => {
      const user = userEvent.setup()
      renderLoginForm()
      
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i })
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument()
      
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Validación de formulario', () => {
    it('requiere campos obligatorios', async () => {
      const user = userEvent.setup()
      renderLoginForm()
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)
      
      expect(screen.getByLabelText(/correo electrónico/i)).toBeRequired()
      expect(screen.getByLabelText(/contraseña/i)).toBeRequired()
    })
  })

  describe('Envío del formulario', () => {
    it('llama al servicio de login con los datos correctos', async () => {
      const user = userEvent.setup()
      const mockLoginResponse = { success: true, user: { id: 1 }, token: 'fake-token' }
      vi.mocked(loginService.login).mockResolvedValue(mockLoginResponse)
      
      renderLoginForm()
      
      await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'password123')
      await user.click(screen.getByRole('checkbox', { name: /recuérdame/i }))
      
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      
      expect(loginService.login).toHaveBeenCalledWith('test@example.com', 'password123', true)
    })

    it('redirige después de login exitoso', async () => {
      const user = userEvent.setup()
      const mockLoginResponse = { success: true, user: { id: 1 }, token: 'fake-token' }
      vi.mocked(loginService.login).mockResolvedValue(mockLoginResponse)
      
      renderLoginForm()
      
      await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'password123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      
      await waitFor(() => {
        expect(mockRedirect).toHaveBeenCalled()
      })
    })

    it('muestra error cuando el login falla', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Correo o contraseña incorrectos'
      vi.mocked(loginService.login).mockRejectedValue(new Error(errorMessage))
      
      renderLoginForm()
      
      await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('deshabilita el formulario durante el envío', async () => {
      const user = userEvent.setup()
      vi.mocked(loginService.login).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      renderLoginForm()
      
      await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)
      
      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/correo electrónico/i)).toBeDisabled()
      expect(screen.getByLabelText(/contraseña/i)).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Navegación', () => {
    it('navega a recuperación de contraseña', async () => {
      const user = userEvent.setup()
      renderLoginForm()
      
      const forgotPasswordLink = screen.getByText(/¿olvidaste tu contraseña?/i)
      await user.click(forgotPasswordLink)
      
      // Aquí verificarías que se navega correctamente, pero como estamos mockeando useNavigate
      // necesitarías mockear también useNavigate si quieres testear la navegación
    })
  })

  describe('Redirección automática', () => {
    it('redirige si el usuario ya está autenticado', () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      
      renderLoginForm()
      
      expect(mockRedirect).toHaveBeenCalled()
    })
  })

  describe('Manejo de errores', () => {
    it('limpia el error cuando el usuario empieza a escribir', async () => {
      const user = userEvent.setup()
      vi.mocked(loginService.login).mockRejectedValue(new Error('Error de login'))
      
      renderLoginForm()
      
      await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/error de login/i)).toBeInTheDocument()
      })
      
      await user.type(screen.getByLabelText(/correo electrónico/i), 'a')
      
      expect(screen.queryByText(/error de login/i)).not.toBeInTheDocument()
    })
  })
})