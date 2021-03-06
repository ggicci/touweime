import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          {/*
          Noto Sans ** fonts are good for Chinese, Japanese, Korean, and Vietnamese.
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap"
            rel="stylesheet"
          />
          */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
