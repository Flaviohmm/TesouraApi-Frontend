export type LoginResponse = { accessToken: string; tokenType: string; name: string; role: string }
export type RegisterRequest = { salonName: string; slug: string; ownerName: string; email: string; password: string; phone?: string }
export type Appointment = { id: string; clientName: string; professionalName: string; startsAt: string; endsAt: string; status: string; totalPrice: number; loyaltyPointsRedeemed: number; loyaltyDiscountAmount: number; services: { name: string }[] }
export type Client = { id: string; name: string; phone: string; email?: string; birthday?: string; notes?: string; loyaltyPoints: number }
export type ClientRequest = { name: string; phone: string; email?: string; birthday?: string; notes?: string }
export type Schedule = { id?: string; weekday: number; startTime: string; endTime: string; breakStart?: string; breakEnd?: string }
export type Professional = { id: string; name: string; photoUrl?: string; bio?: string; commissionRate?: number; isActive: boolean; schedules?: Schedule[] }
export type ProfessionalRequest = { name: string; bio?: string; commissionRate?: number; schedules: Schedule[] }
export type HairService = { id: string; name: string; description?: string; durationMinutes: number; price: number; category?: string; isActive: boolean }
export type HairServiceRequest = { name: string; description?: string; durationMinutes: number; price: number; category?: string }
export type AvailableSlot = { startsAt: string; endsAt: string; professionalId: string }
export type AppointmentRequest = { clientId: string; professionalId: string; startsAt: string; serviceIds: string[]; notes?: string; createdVia?: string; redeemPoints?: number }
export type Salon = {
  id: string
  name: string
  slug: string
  phone?: string
  address?: string
  timezone?: string
  logoUrl?: string
  subscriptionPlan?: string
  subscriptionStatus?: string
  trialEndsAt?: string
  createdAt: string
  updatedAt: string
  platformCommissionRate?: number
}
export type SalonRequest = { name: string; phone?: string; address?: string; timezone?: string; logoUrl?: string }
export type Me = { userId: string; salonId: string; name: string; email: string; phone?: string; role: string }
export type TransactionType = 'income' | 'expense' | 'commission'
export type Transaction = { id: string; appointmentId?: string; type: TransactionType; amount: number; description?: string; createdAt: string }
export type StripeAccountStatus = { connected: boolean; chargesEnabled: boolean; accountId?: string }
