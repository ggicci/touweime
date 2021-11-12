import axios from 'axios'
import reduce from 'lodash/reduce'

export interface StorageTicket {
  header: { [key: string]: string[] }
  method: 'PUT' | 'POST'
  url: string
}

async function uploadWithStorageTicket(file: File, ticket: StorageTicket) {
  await axios.put(ticket.url, file, {
    withCredentials: false,
    headers: reduce<StorageTicket['header'], { [key: string]: string }>(
      ticket.header,
      (acc, value, key) => {
        acc[key] = value[0]
        return acc
      },
      {},
    ),
  })
}

export { uploadWithStorageTicket }
