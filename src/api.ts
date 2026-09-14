const API_URL = import.meta.env.VITE_API_URL ?? ''

export type LoginResponse = { accessToken: string; tokenType: string; name: string; role: string }
export type RegisterRequest = { salonName: string; slug: string; ownerName: string; email: string; password: string; phone?: string }
export type Appointment = { id: string; clientName: string; professionalName: string; startsAt: string; endsAt: string; status: string; totalPrice: number; services: { name: string }[] }
export type Client = { id: string; name: string; phone: string; email?: string; loyaltyPoints: number }
export type Professional = { id: string; name: string; photoUrl?: string; isActive: boolean }
export type HairService = { id: string; name: string; durationMinutes: number; price: number; category?: string; isActive: boolean }

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tesoura_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message ?? 'Não foi possível concluir a solicitação.')
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}
