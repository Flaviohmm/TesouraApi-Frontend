export type LoginResponse = { accessToken: string; tokenType: string; name: string; role: string }
export type RegisterRequest = { salonName: string; slug: string; ownerName: string; email: string; password: string; phone?: string }
export type Appointment = { id: string; clientName: string; professionalName: string; startsAt: string; endsAt: string; status: string; totalPrice: number; services: { name: string }[] }
export type Client = { id: string; name: string; phone: string; email?: string; loyaltyPoints: number }
export type Professional = { id: string; name: string; photoUrl?: string; isActive: boolean }
export type HairService = { id: string; name: string; durationMinutes: number; price: number; category?: string; isActive: boolean }
