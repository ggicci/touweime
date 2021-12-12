import Typography from '@mui/material/Typography'
import axios from 'axios'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import React, { useEffect } from 'react'

interface Props {
  remote?: string
  markdown?: string
}

const MarkdownRenderer = (props: Props) => {
  const { remote, markdown } = props
  const [cleanHTML, setCleanHTML] = React.useState('')

  if (remote && markdown) {
    throw new Error('MarkdownRenderer: remote and markdown props are mutually exclusive')
  }

  useEffect(() => {
    async function fetchMarkdown(url: string) {
      try {
        const resp = await axios.get(url)
        return resp.data
      } catch (error) {
        return String(error)
      }
    }

    ;(async () => {
      let toRender = markdown

      if (!!remote) {
        toRender = await fetchMarkdown(remote)
      }
      setCleanHTML(markdownToHTML(toRender || ''))
    })()
  }, [markdown, remote])

  function markdownToHTML(markdownText: string) {
    return DOMPurify.sanitize(marked.parse(markdownText))
  }

  return <Typography dangerouslySetInnerHTML={{ __html: cleanHTML }}></Typography>
}

export default MarkdownRenderer
