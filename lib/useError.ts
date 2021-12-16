import axios, { AxiosError } from 'axios'
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
  raw: any
}

type ErrorMapper = { [key: number | string]: string }
type ErrorRenderer = (error: unknown, errorMap?: ErrorMapper) => void
type ErrorParser = {
  parse: (error: unknown, errorMap?: ErrorMapper) => FormattedError | undefined
}

function lookupErrorMessage(errorMap: ErrorMapper, error: AxiosError): string | undefined {
  // FIXME(ggicci): more robust error mapping
  const resp = error.response
  if (resp) {
    return errorMap[resp.status]
  }
  return undefined
}

function parseError(i18n: I18n, error: unknown, errorMap?: ErrorMapper): FormattedError | undefined {
  if (isNil(error)) {
    return undefined
  }

  const formattedError = {
    statusCode: 0,
    title: '',
    message: error as string,
    raw: error,
  } as FormattedError

  // TODO(ggicci): more robust error parsing
  // Server side ValidationError(422) -> FormattedError

  if (axios.isAxiosError(error)) {
    const resp = error.response

    if (!resp) {
      formattedError.title = i18n.t('error.no-response')
      return formattedError
    }

    formattedError.statusCode = resp.status
    formattedError.title = `${resp.status} ${resp.statusText}`

    let customMappedMessage: string = ''
    if (errorMap) {
      customMappedMessage = lookupErrorMessage(errorMap, error) || ''
    }
    formattedError.message = customMappedMessage || resp.data || error.message
  } else if (isError(error)) {
    formattedError.message = error.message
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
