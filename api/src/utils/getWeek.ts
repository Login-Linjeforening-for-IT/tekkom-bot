export default function getWeek() {
    const now = new Date()
    const target = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    const dayNumber = (target.getUTCDay() + 6) % 7
    target.setUTCDate(target.getUTCDate() - dayNumber + 3)
    const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
    const diff = target.getTime() - firstThursday.getTime()
    const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000))
    return week
}
