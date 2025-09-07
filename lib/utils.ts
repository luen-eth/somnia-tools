import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatNumber(num: number | string) {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return new Intl.NumberFormat('en-US').format(number)
}
