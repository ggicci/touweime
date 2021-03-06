import CryptoHexEncoder from 'crypto-js/enc-hex'
import CryptoLatin1Encoder from 'crypto-js/enc-latin1'
import CryptoMD5 from 'crypto-js/md5'
import CryptoSHA1 from 'crypto-js/sha1'

export async function sha1Hex(blob: Blob | File): Promise<string> {
  const reader = new FileReader()
  reader.readAsBinaryString(blob)

  return new Promise<string>((resolve, reject) => {
    reader.onloadend = async (e) => {
      try {
        const data = e.target!.result as string
        const hash = CryptoSHA1(CryptoLatin1Encoder.parse(data))
        resolve(hash.toString(CryptoHexEncoder))
      } catch (error) {
        reject(error)
      }
    }
  })
}

export async function md5Hex(blob: Blob | File): Promise<string> {
  const reader = new FileReader()
  reader.readAsBinaryString(blob)

  return new Promise<string>((resolve, reject) => {
    reader.onloadend = async (e) => {
      try {
        const data = e.target!.result as string
        const hash = CryptoMD5(CryptoLatin1Encoder.parse(data))
        resolve(hash.toString(CryptoHexEncoder))
      } catch (error) {
        reject(error)
      }
    }
  })
}
