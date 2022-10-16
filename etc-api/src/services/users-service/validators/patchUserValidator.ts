import { check } from 'express-validator'
import { NOT_EMAIL } from '../../../utils/validationMessages'

/**
 * these are the fields that can be updated
 */

export default [
  check('firstName')
    .optional()
    .trim()
    .stripLow(true),
  check('lastName')
    .optional()
    .trim()
    .stripLow(true),
  check('company')
    .optional()
    .trim()
    .stripLow(true),
  check('role')
    .optional()
    .trim()
    .stripLow(true),
  check('city')
    .optional()
    .trim()
    .stripLow(true),
  check('notes')
    .optional()
    .trim()
    .stripLow(true),
  check('representative')
    .optional({ nullable: true })
    .exists()
    .isEmail()
    .withMessage(NOT_EMAIL)
]
