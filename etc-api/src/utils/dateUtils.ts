import * as moment from "moment";

class DateUtils {
  public getNow(): Date {
    return new Date()
  }

  public getNowMs(): number {
    return Date.now()
  }

  public getDiffDays(dateFrom: Date, dateTo: Date): number {
    const from = moment(dateFrom)
    const to = moment(dateTo)
    return from.diff(to, 'days')
  }

  public getDiffDaysToNow(date: Date): number {
    const currentDate = moment().startOf('day')
    const requestedDate = moment(date).startOf('day')

    return currentDate.diff(requestedDate, 'days')
  }

  public getDaysToNow(dateFrom: Date | string): number {
    const from = moment(dateFrom).utc().startOf('day')
    const now = moment().utc().startOf('day')

    return from.diff(now, 'days')
  }

  public getEndDate(dateFrom: Date, duration: number): Date {
    const from = moment(dateFrom).startOf('day')
    return from.add(+duration - 1, 'days').toDate()
  }
}

export const dateUtils = new DateUtils()
