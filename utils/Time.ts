import dayjs from 'dayjs'

type SmartTimeInput = string | number | Date

export function smartTime(date: SmartTimeInput): string {
  const now = Date.now()
  const input = new Date(date).getTime()

  if (isNaN(input)) return ''

  const diffInSeconds = Math.floor((now - input) / 1000)

  if (diffInSeconds < 60) return 'just now'

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }

  const inputDate = dayjs(input)
  const currentYear = dayjs().year()

  if (inputDate.year() === currentYear) {
    return inputDate.format('MMM D')
  }

  return inputDate.format('MMM D, YYYY')
}
