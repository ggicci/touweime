import axios from 'axios'
import isError from 'lodash/isError'
import isNil from 'lodash/isNil'
import { I18n } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import { ProviderContext, useSnackbar } from 'notistack'

export interface FormattedError {
  statusCode: number
  title: string
  message: string
  code?: string
  documentationUrl?: string
}

function isFormattedError(error: unknown): error is FormattedError {
  const formattedError = error as FormattedError
  return !isNil(formattedError.statusCode) && !isNil(formattedError.title) && !isNil(formattedError.message)
}

type ErrorMapper = { [key: number | string]: string }
type ErrorRenderer = (error: unknown, errorMap?: ErrorMapper) => void
type ErrorParser = {
  parse: (error: unknown, errorMap?: ErrorMapper) => FormattedError | null
}

function lookupErrorMessage(errorMap: ErrorMapper, status: number): string | undefined {
  return errorMap[status]
}

export function formatError(error: unknown): FormattedError | null {
  if (isNil(error)) {
    return null
  }

  if (isFormattedError(error)) {
    return error
  }

  const formattedError = {
    statusCode: 0,
    title: '',
    message: error as string,
  } as FormattedError

  if (axios.isAxiosError(error)) {
    const resp = error.response

    if (!resp) {
      formattedError.title = 'error.no-response'
      return formattedError
    }

    formattedError.statusCode = resp.status
    formattedError.title = `${resp.status} ${resp.statusText}`
    formattedError.message = resp.data || error.message
  } else if (isError(error)) {
    formattedError.message = error.message
  }

  return formattedError
}

function parseError(i18n: I18n, error: unknown, errorMap?: ErrorMapper): FormattedError | null {
  const formattedError = formatError(error)

  // Add custom error mapping.
  if (formattedError) {
    if (errorMap) {
      const customMessage = lookupErrorMessage(errorMap, formattedError.statusCode)
      if (customMessage) {
        formattedError.message = customMessage
      }
    }
  }

  // Translate error message.
  if (formattedError) {
    const i18nKey = formattedError.title
    formattedError.title = i18n.t(i18nKey, null, { default: i18nKey })
  }

  return formattedError
}

function createErrorParser(i18n: I18n): ErrorParser {
  return {
    parse: (error: unknown, errorMap?: ErrorMapper) => {
      return parseError(i18n, error, errorMap)
    },
  }
}

function snackError(i18n: I18n, enqueueSnackbar: ProviderContext['enqueueSnackbar']): ErrorRenderer {
  return (error: unknown, errorMap?: ErrorMapper) => {
    const formattedError = parseError(i18n, error, errorMap)
    enqueueSnackbar(formattedError!.message, { variant: 'error' })
  }
}

export function useErrorParser(): ErrorParser {
  const i18n = useTranslation('common')
  return createErrorParser(i18n)
}

export function useSnackError(): ErrorRenderer {
  const { enqueueSnackbar } = useSnackbar()
  const i18n = useTranslation('common')

  return snackError(i18n, enqueueSnackbar)
}
