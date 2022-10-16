import { Request } from 'express'
import { SortingParams } from './SortingParams'

export default function getSortingParams(req: Request): SortingParams {
 

  const { sortBy, sortOrder, limit, offset } = req.query
  const sort = sortBy || 'id'
  const order = sortOrder || 'ASC'
  const parsedLimit = parseInt(limit, 10)
  const parsedOffset = parseInt(offset, 10)
  const pagination = {
    limit: parsedLimit || 10,
    offset: parsedOffset > -1 ? offset : 0,
  }

    return {
      order,
      sort, 
      pagination,
    }
}
