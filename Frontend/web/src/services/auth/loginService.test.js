import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginService, authService } from './loginService'
import apiClient from '../api/apiService'

vi.mock('../api/apiService')

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  describe('setAuthData', () => {
    it('guarda datos en localStorage cuando rememberMe es true', () => {
      const token = 'test-token'
      const userData = { id: 1, email: 'test@example.com' }
      
      authService.setAuthData(token, 'Bearer', userData, true)
      
      expect(localStorage.getItem('auth_token')).toBe(token)
      expect(localStorage.getItem('token_type')).toBe('Bearer')
      expect(JSON.parse(localStorage.getItem('user_data'))).toEqual(userData)
    })

    it('guarda datos en sessionStorage cuando rememberMe es false', () => {
      const token = 'test-token'
      const userData = { id: 1, email: 'test@example.com' }
      
      authService.setAuthData(token, 'Bearer', userData, false)
      
      expect(sessionStorage.getItem('auth_token')).toBe(token)
      expect(sessionStorage.getItem('token_type')).toBe('Bearer')
      expect(JSON.parse(sessionStorage.getItem('user_data'))).toEqual(userData)
    })
  })

  describe('getToken', () => {
    it('obtiene token de localStorage', () => {
      localStorage.setItem('auth_token', 'local-token')
      expect(authService.getToken()).toBe('local-token')
    })

    it('obtiene token de sessionStorage si no está en localStorage', () => {
      sessionStorage.setItem('auth_token', 'session-token')
      expect(authService.getToken()).toBe('session-token')
    })
  })

  describe('isAuthenticated', () => {
    it('retorna true si hay token', () => {
      localStorage.setItem('auth_token', 'test-token')
      expect(authService.isAuthenticated()).toBe(true)
    })

    it('retorna false si no hay token', () => {
      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('clearAuthData', () => {
    it('limpia todos los datos de autenticación', () => {
      localStorage.setItem('auth_token', 'token')
      sessionStorage.setItem('auth_token', 'token')
      
      authService.clearAuthData()
      
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(sessionStorage.getItem('auth_token')).toBeNull()
    })
  })
})

describe('loginService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('realiza login exitoso y guarda datos', async () => {
      const mockAuthResponse = {
        data: { token: 'auth-token', tokenType: 'Bearer' }
      }
      const mockUserResponse = {
        data: { id: 1, email: 'test@example.com', roles: [{ name: 'ROLE_CLIENT' }] }
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockAuthResponse)
      vi.mocked(apiClient.get).mockResolvedValue(mockUserResponse)

      const result = await loginService.login('test@example.com', 'password', true)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      })
      expect(apiClient.get).toHaveBeenCalledWith('/users/me')
      expect(result).toEqual({
        success: true,
        user: mockUserResponse.data,
        token: 'auth-token'
      })
    })

    it('maneja error 401 correctamente', async () => {
      const error = {
        response: { status: 401 }
      }
      vi.mocked(apiClient.post).mockRejectedValue(error)

      await expect(loginService.login('test@example.com', 'wrong-password'))
        .rejects.toEqual({
          success: false,
          message: 'Correo o contraseña incorrectos',
          status: 401
        })
    })

    it('maneja errores de red', async () => {
      const error = new Error('Network error')
      vi.mocked(apiClient.post).mockRejectedValue(error)

      await expect(loginService.login('test@example.com', 'password'))
        .rejects.toEqual({
          success: false,
          message: 'Error al iniciar sesión',
          status: 500
        })
    })
  })

  describe('validateSession', () => {
    it('valida sesión exitosamente', async () => {
      localStorage.setItem('auth_token', 'valid-token')
      const mockUserResponse = {
        data: { id: 1, email: 'test@example.com' }
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockUserResponse)

      const result = await loginService.validateSession()

      expect(result).toEqual({
        success: true,
        user: mockUserResponse.data
      })
    })

    it('maneja sesión inválida', async () => {
      localStorage.setItem('auth_token', 'invalid-token')
      const error = { response: { status: 401 } }
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(loginService.validateSession())
        .rejects.toEqual({
          success: false,
          message: 'Session expired or invalid',
          status: 401
        })
    })
  })
})