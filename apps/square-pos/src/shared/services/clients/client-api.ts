import axios from 'axios'

function createClientApi() {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })
}

export const clientApi = createClientApi()
