import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import { useErrorParser } from 'lib/error'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

interface Props {
  isLoading: boolean
  error: unknown
  loginRedirect?: boolean
}

const ErrorPage = (props: Props) => {
  const { error, isLoading, loginRedirect } = props
  const { t } = useTranslation('common')
  const router = useRouter()
  const formattedError = useErrorParser().parse(error)

  if (isLoading === true) {
    // TODO(ggicci): with a delay to show the loading indicator
    return <LinearProgress></LinearProgress>
  }

  if (!formattedError) {
    return null
  }

  if (formattedError.statusCode === 401 && loginRedirect) {
    router.push('/login')
    return null
  }

  const seeDocs = formattedError.documentationUrl ? (
    <Link to={formattedError.documentationUrl} target="_blank">
      {t('error-report.see-docs')}&#x2197;
    </Link>
  ) : null

  let debug = null
  if (process.env.NODE_ENV === 'development') {
    debug = <pre>{JSON.stringify(formattedError, null, 2).replaceAll('\\n', '\n')}</pre>
  }

  // Render error.
  return (
    <Container component={Paper} variant="outlined" sx={{ mt: 3, py: 3 }}>
      <Typography variant="h2" gutterBottom sx={{ display: 'flex' }}>
        <FontAwesomeSvgIcon icon={faTimes} fontSize="inherit"></FontAwesomeSvgIcon>
        {formattedError.title}
      </Typography>
      <Typography gutterBottom>{formattedError.message}</Typography>

      {seeDocs}

      {/* debug (dev only) */}
      <Typography fontSize="0.75rem" component="div">
        {debug}
      </Typography>
    </Container>
  )
}

export default ErrorPage
