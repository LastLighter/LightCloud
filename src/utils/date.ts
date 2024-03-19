export function getCurDateString() {
    const curDate = new Date()
    const dateString = `${curDate.getFullYear()}-${curDate.getMonth() + 1}-${curDate.getDate()} ${curDate.getHours()}:${curDate.getMinutes()}`
    return dateString
}

export function transferLocalDate(date: string){
    const parts = date.split("T") // 将日期和时间部分分开
    const datePart = parts[0]
    const timePart = parts[1].substring(0,5)
    return datePart + ' ' + timePart
}