import axios from 'axios'

const baseURL = 'http://localhost:3000'
export async function loginUser(email: string, password: string) {
  try {
    const res = await axios.get(`${baseURL}/users`, {
      params: {
        email,
        password
      }
    })
    const user = res.data[0]
    return user || null
  } catch (err) {
    throw new Error('Failed to connect to server')
  }
}

export async function getEvents() {
  const res = await axios.get(`${baseURL}/events`)
  return res.data
}

export async function getUsers() {
  const res = await axios.get(`${baseURL}/users`)
  return res.data
}

export async function joinEvent(eventId: number, userId: number) {
  const eventRes = await axios.get(`${baseURL}/events/${eventId}`)
  const event = eventRes.data

  const alreadyJoined = event.participants.some((p: any) => p.id === userId)
  if (alreadyJoined) return

  const updatedParticipants = [
    ...event.participants,
    { id: userId, joined_date: new Date().toISOString().split('T')[0] }
  ]

  return axios.patch(`${baseURL}/events/${eventId}`, {
    participants: updatedParticipants
  })
}

export async function createEvent(name: string, date: string, description: string, created_by: number) {
  return await axios.post(`${baseURL}/events`, {
    name,
    date,
    description,
    created_by,
    participants: []
  })
}

export async function deleteEvent(id: number) {
  return await axios.delete(`${baseURL}/events/${id}`)
}

export async function updateEvent(id: number, data: { name: string; date: string; description: string }) {
  return await axios.patch(`${baseURL}/events/${id}`, data)
}
