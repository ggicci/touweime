import Information from 'components/Information'
import useTranslation from 'next-translate/useTranslation'

const Discover = () => {
  const { t } = useTranslation('common')
  const title = t('errors.not-implemented')
  return <Information variant="error" title={title}></Information>
}

export default Discover
