<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getEvents, getUsers, joinEvent,
  createEvent, deleteEvent, updateEvent
} from '@/services/api'
import { useUserStore } from '@/stores/user'

const events = ref([])
const users = ref([])
const name = ref('')
const date = ref('')
const description = ref('')
const editingId = ref<number | null>(null)

const userStore = useUserStore()

const getUserName = (id: number) => {
  const user = users.value.find(u => u.id === id)
  return user ? user.name : 'Unknown'
}

const fetchData = async () => {
  events.value = await getEvents()
  users.value = await getUsers()
}

const handleJoin = async (eventId: number) => {
  if (!userStore.isAuthenticated) return alert('Please login to join.')
  await joinEvent(eventId, userStore.userId)
  fetchData()
}

const handleCreate = async () => {
  if (!userStore.isAuthenticated) return alert('Please login to create events.')
  if (!name.value || !date.value || !description.value) return alert('Please fill in all fields.')

  await createEvent(name.value, date.value, description.value, userStore.userId)
  clearForm()
  fetchData()
}

const handleDelete = async (eventId: number) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await deleteEvent(eventId)
    fetchData()
  }
}

const startEditing = (event: any) => {
  editingId.value = event.id
  name.value = event.name
  date.value = event.date
  description.value = event.description
}

const handleUpdate = async () => {
  if (!editingId.value) return
  await updateEvent(editingId.value, {
    name: name.value,
    date: date.value,
    description: description.value
  })
  clearForm()
  fetchData()
}

const clearForm = () => {
  name.value = ''
  date.value = ''
  description.value = ''
  editingId.value = null
}

onMounted(fetchData)
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Events</h1>

    <!-- Create / Edit Event -->
    <div class="mb-6 border p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">
        {{ editingId ? 'Edit Event' : 'Create Event' }}
      </h2>
      <input v-model="name" placeholder="Event name" class="border p-2 mb-2 w-full rounded" />
      <input v-model="date" type="date" class="border p-2 mb-2 w-full rounded" />
      <textarea v-model="description" placeholder="Description" class="border p-2 mb-2 w-full rounded" />

      <div class="flex gap-2">
        <button
          @click="editingId ? handleUpdate() : handleCreate()"
          class="bg-blue-500 text-white px-4 py-1 rounded"
        >
          {{ editingId ? 'Update' : 'Create' }}
        </button>
        <button v-if="editingId" @click="clearForm" class="bg-gray-300 text-black px-4 py-1 rounded">
          Cancel
        </button>
      </div>
    </div>

    <!-- List Events -->
    <div
      v-for="event in events"
      :key="event.id"
      class="event"
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold">{{ event.name }}</h2>
        <template v-if="userStore.isAuthenticated && userStore.userId === event.created_by">
          <div class="flex gap-2">
            <button
              @click="startEditing(event)"
              class="text-blue-500 underline text-sm"
            >
              Edit
            </button>
            <button
              @click="handleDelete(event.id)"
              class="text-red-500 underline text-sm"
            >
              Delete
            </button>
          </div>
    </template>
      </div>

      <p><strong>Date:</strong> {{ event.date }}</p>
      <p class="mb-2"><strong>Description:</strong> {{ event.description }}</p>
      <p><strong>Created by:</strong> {{ getUserName(event.created_by) }}</p>

      <h3 class="mt-2 font-semibold">Participants:</h3>
      <ul class="list-disc list-inside mb-2">
        <li v-for="p in event.participants" :key="p.id">
          {{ getUserName(p.id) }} (joined: {{ p.joined_date }})
        </li>
      </ul>

      <button
        @click="handleJoin(event.id)"
        class="bg-green-500 text-white px-3 py-1 rounded"
        v-if="userStore.userId && !event.participants.some(p => p.id === userStore.userId)"
      >
        Join Event
      </button>
    </div>
  </div>
</template>
<style scoped>
.event{
  background-color: cornflowerblue;
  margin-top: 1rem;
  padding: 2rem;
  border-radius: 1rem ;
}
.event h2{
  color: white;
  font-size:x-large;
  font-weight: bold;
}
</style>