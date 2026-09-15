export const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const initial = (name: string) => name.trim().slice(0, 1).toUpperCase()

export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
