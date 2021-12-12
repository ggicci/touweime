import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import MarkdownRenderer from 'components/MarkdownRenderer'
import { useRouter } from 'next/router'

interface Props {
  name: string
}

const MarkdownDocument = (props: Props) => {
  const { name } = props
  const router = useRouter()

  return (
    <Container component={Paper} variant="outlined" sx={{ my: 3, py: 2 }}>
      <MarkdownRenderer remote={`/files/${router.locale || 'zh'}/${name}.md`}></MarkdownRenderer>
    </Container>
  )
}

export default MarkdownDocument
