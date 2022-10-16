import { Request } from 'express'
import * as _ from 'lodash'
import { FilteringParams } from './FilteringParams'

export default function getFilteringParams(req: Request): FilteringParams {
  return _.get(req, ['query', 'filter'], {})
}
