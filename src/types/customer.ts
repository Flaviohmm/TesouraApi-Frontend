export type PublicSalon = { id: string; name: string; slug: string; phone?: string; address?: string; logoUrl?: string }
export type PublicService = { id: string; name: string; description?: string; durationMinutes: number; price: number; category?: string }
export type PublicProfessional = { id: string; name: string; photoUrl?: string; bio?: string }
export type PublicSalonDetail = PublicSalon & { timezone?: string; services: PublicService[]; professionals: PublicProfessional[] }
export type CustomerLoginResponse = { accessToken: string; tokenType: string; expiresIn: number; customerId: string; name: string }
export type Customer = { id: string; name: string; email: string; phone?: string }
export type PublicAppointmentRequest = { professionalId: string; startsAt: string; serviceIds: string[]; notes?: string }
