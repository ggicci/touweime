import axios, { AxiosError } from 'axios'
import isError from 'lodash/isError'
import { I18n } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import { ProviderContext, useSnackbar } from 'notistack'

type ErrorMapper = { [key: number | string]: string }
type ErrorDisplayer = (error: unknown, errorMap?: ErrorMapper) => void

function lookupErrorMessage(errorMap: ErrorMapper, error: AxiosError): string | undefined {
  // FIXME(ggicci): more robust error mapping
  const resp = error.response
  if (resp) {
    return errorMap[resp.status]
  }
  return undefined
}

function snackError(enqueueSnackbar: ProviderContext['enqueueSnackbar'], i18n: I18n): ErrorDisplayer {
  // const { t } = i18n
  return (error: unknown, errorMap?: ErrorMapper) => {
    if (axios.isAxiosError(error)) {
      let message: string = ''
      if (errorMap) {
        message = lookupErrorMessage(errorMap, error) || ''
      }
      if (!message) {
        message = error.message
      }
      enqueueSnackbar(message, { variant: 'error' })
    } else if (isError(error)) {
      enqueueSnackbar(error.message, { variant: 'error' })
    } else {
      enqueueSnackbar(error as string, { variant: 'error' })
    }
  }
}

export function useSnackError(): ErrorDisplayer {
  const { enqueueSnackbar } = useSnackbar()
  const i18n = useTranslation('common')

  return snackError(enqueueSnackbar, i18n)
}
