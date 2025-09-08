import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRoleRedirect } from './useRoleRedirect'
import { authService } from '../services/auth/loginService'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

vi.mock('../services/auth/loginService')

describe('useRoleRedirect', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    const { useNavigate } = require('react-router-dom')
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('redirige a admin para ROLE_ADMIN', () => {
    vi.mocked(authService.getUserData).mockReturnValue({
      roles: [{ name: 'ROLE_ADMIN' }]
    })

    const { result } = renderHook(() => useRoleRedirect())
    result.current()

    expect(mockNavigate).toHaveBeenCalledWith('/admin/solicitudes')
  })

  it('redirige a técnico para ROLE_TECHNICIAN', () => {
    vi.mocked(authService.getUserData).mockReturnValue({
      roles: [{ name: 'ROLE_TECHNICIAN' }]
    })

    const { result } = renderHook(() => useRoleRedirect())
    result.current()

    expect(mockNavigate).toHaveBeenCalledWith('/tecnico/lotes')
  })

  it('redirige a cliente para ROLE_CLIENT', () => {
    vi.mocked(authService.getUserData).mockReturnValue({
      roles: [{ name: 'ROLE_CLIENT' }]
    })

    const { result } = renderHook(() => useRoleRedirect())
    result.current()

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('redirige a login cuando no hay datos de usuario', () => {
    vi.mocked(authService.getUserData).mockReturnValue(null)

    const { result } = renderHook(() => useRoleRedirect())
    result.current()

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('prioriza ROLE_ADMIN cuando hay múltiples roles', () => {
    vi.mocked(authService.getUserData).mockReturnValue({
      roles: [
        { name: 'ROLE_CLIENT' },
        { name: 'ROLE_ADMIN' },
        { name: 'ROLE_TECHNICIAN' }
      ]
    })

    const { result } = renderHook(() => useRoleRedirect())
    result.current()

    expect(mockNavigate).toHaveBeenCalledWith('/admin/solicitudes')
  })
})