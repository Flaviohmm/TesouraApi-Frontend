export const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const initial = (name: string) => name.trim().slice(0, 1).toUpperCase()

export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`

  const area = digits.slice(0, 2)
  const number = digits.slice(2)

  if (number.length <= 4) return `(${area}) ${number}`
  if (digits.length <= 10) return `(${area}) ${number.slice(0, 4)}-${number.slice(4)}`
  
  return `(${area}) ${number.slice(0, 5)}-${number.slice(5)}`
}
