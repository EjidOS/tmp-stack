import { check } from 'express-validator'
import {
  EMPTY,
  NOT_EMAIL,
  NOT_PHONE,
  WRONG_COMPANY_VALUE
} from '../../../utils/validationMessages'

/**
 * EXPECTS:
 * ------------------------------
 * firstName
 * lastName
 * company
 * role
 * email
 * phone_number
 * city
 * notes
 * representative
 */

export default [
  check('firstName')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .trim()
    .stripLow(true),
  check('lastName')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .trim()
    .stripLow(true),
  check('company')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .equals('Etc')
    .withMessage(WRONG_COMPANY_VALUE),
  check('role')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .trim()
    .stripLow(true),
  check('email')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .isEmail()
    .withMessage(NOT_EMAIL),
  check('phone_number')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .isMobilePhone('any')
    .withMessage(NOT_PHONE)
    .trim(),
  check('city')
    .not()
    .isEmpty()
    .withMessage(EMPTY)
    .trim()
    .stripLow(true),
  check('notes')
    .optional({ nullable: true })
    .trim()
    .stripLow(true),
  check('representative')
    .optional({ nullable: true })
    .exists()
    .isEmail()
    .withMessage(NOT_EMAIL)
]
