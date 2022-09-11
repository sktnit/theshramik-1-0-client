import * as Yup from 'yup'
import moment from 'moment';
import { constants } from './constants';

const emailValidator = () => {
  const sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
  const sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
  const sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
  const sQuotedPair = '\\x5c[\\x00-\\x7f]'
  const sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d'
  const sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22'
  const sDomain_ref = sAtom
  const sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')'
  const sWord = '(' + sAtom + '|' + sQuotedString + ')'
  const sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*'
  const sLocalPart = sWord + '(\\x2e' + sWord + ')*'
  const sAddrSpec = sLocalPart + '\\x40' + sDomain // complete RFC822 email address spec
  const sValidEmail = '^' + sAddrSpec + '$' // as whole string
  return sValidEmail
}

const phoneValidator = () => {
  const sValidNumber = '^((\\d{12}))$'
  return sValidNumber
}
const useValidate = ({
  firstname,
  lastname,
  password,
  confirmPassword,
  acceptTerms,
  email,
  phone,
  dob,
  gender,
  personWithDisability,
  community
}) => {
  let validationShape = {}
  if (firstname) {
    validationShape.firstname = Yup.string().required('Firstname is required')
  }
  if (lastname) {
    validationShape.lastname = Yup.string()
  }
  if (password) {
    validationShape.password = Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters')
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{}:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      )
  }
  if (confirmPassword) {
    validationShape.confirmPassword = Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match')
  }
  if (acceptTerms) {
    validationShape.acceptTerms = Yup.bool().oneOf([true], 'Accept Terms is required')
  }
  if (email) {
    validationShape.email = Yup.string()
      .required('Email is required')
      .matches(
        emailValidator(),
        'Email is invalid'
      )
  }
  if (phone) {
    validationShape.phone = Yup.string()
      .required('Phone Number is required')
      .matches(
        phoneValidator(),
        `Invalid phone number.`
      )
  }
  if (dob) {
    validationShape.dob = Yup.string()
      .required('Date of Birth is required')
      .nullable()
      .test("dob", "Please choose a valid date of birth", (value) => {
        return moment().diff(moment(value, ["MM-DD-YYYY"]), "years") >= 18;
      })
  }
  if (personWithDisability) {
    validationShape.personWithDisability = Yup.string()
      .required('Person with disablitiy is required')
      .test("personWithDisability", (value) => {
        return constants.PERSON_WITH_DISABILITY.includes(value.charAt(0).toUpperCase() + value.slice(1));
      })
  }
  if (gender) {
    validationShape.gender = Yup.string()
      .required('Gender is required')
      .test("gender", (value) => {
        return constants.GENDER.includes(value.charAt(0).toUpperCase() + value.slice(1));
      })
  }
  if (community) {
    validationShape.community = Yup.string()
      .required('Community is required')
      .test("community", (value) => {
        return constants.COMMUNITY.includes(value.charAt(0).toUpperCase() + value.slice(1));
      })
  }
  const validationSchema = Yup.object().shape(validationShape)
  return validationSchema
}

export default useValidate