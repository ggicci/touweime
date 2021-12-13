import Information from 'components/Information'
import useTranslation from 'next-translate/useTranslation'

const Support = () => {
  const { t } = useTranslation('common')
  const title = t('errors.not-implemented')
  return <Information variant="warning" title={title}></Information>
}

export default Support
