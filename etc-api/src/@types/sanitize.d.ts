import * as express from 'express'

declare global {
  namespace Express {
    interface Request {
      headerInt(headerName: string): number
      headerString(headerName: string): string
      headerFloat(headerName: string): number
      headerEmail(headerName: string): string
      headerPattern(headerName: string, pattern: RegExp): string
      headerOneOf(headerName: string, arr: Array<any>): string
      bodyInt(bodyParam: string): number
      bodyString(bodyParam: string): string
      bodyFloat(bodyParam: string): number
      bodyEmail(bodyParam: string): string
      bodyPattern(bodyParam: string, pattern: RegExp): string
      boydOneOf(bodyName: string, arr: Array<any>): string
      queryInt(queryParam: string): number
      queryString(queryParam: string): string
      queryFloat(queryParam: string): number
      queryEmail(queryParam: string): string
      queryPattern(queryParam: string, pattern: RegExp): string
      queryOneOf(queryName: string, arr: Array<any>): string
      paramInt(paramName: string): number
      paramString(paramName: string): string
      paramFloat(paramName: string): number
      paramEmail(paramName: string): string
      paramPattern(paramName: string, pattern: RegExp): string
      paramOneOf(paramName: string, arr: Array<any>): string
    }
  }
}
