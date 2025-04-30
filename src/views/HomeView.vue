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
  <div class="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-indigo-800 border-b pb-2 border-indigo-200">
      Community Events
    </h1>

    <!-- Create / Edit Event Form -->
    <Card v-if="userStore.isAuthenticated">
      <div class="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 class="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ editingId ? 'Edit Event' : 'Create New Event' }}
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input 
              v-model="name" 
              placeholder="Enter event name" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input 
              v-model="date" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="description" 
              placeholder="Enter event description" 
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
            ></textarea>
          </div>
  
          <div class="flex gap-3 pt-2">
            <button
              @click="editingId ? handleUpdate() : handleCreate()"
              class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              {{ editingId ? 'Update Event' : 'Create Event' }}
            </button>
            
            <button 
              v-if="editingId" 
              @click="clearForm" 
              class="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Card>

    <!-- Events List -->
    <div class="space-y-6">
      <h2 v-if="events.length > 0" class="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Events
      </h2>
      
      <div v-if="events.length === 0" class="bg-white p-8 rounded-lg shadow-md text-center">
        <p class="text-gray-600">No events available. Create the first one!</p>
      </div>

      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-indigo-800">{{ event.name }}</h3>
            
            <template v-if="userStore.isAuthenticated && userStore.userId === event.created_by">
              <div class="flex items-center space-x-2">
                <button
                  @click="startEditing(event)"
                  class="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button
                  @click="handleDelete(event.id)"
                  class="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </template>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div class="flex items-center text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="font-medium">Date:</span> 
                <span class="ml-1">{{ event.date }}</span>
              </div>
              
              <div class="flex items-start text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <span class="font-medium">Created by:</span> 
                  <span class="ml-1">{{ getUserName(event.created_by) }}</span>
                </div>
              </div>
            </div>
          
            <div class="text-gray-700">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <span class="font-medium">Description:</span>
                  <p class="mt-1">{{ event.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-100">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Participants ({{ event.participants.length }})
            </h4>
            
            <ul v-if="event.participants.length > 0" class="ml-7 list-disc text-gray-700 mb-4">
              <li v-for="p in event.participants" :key="p.id" class="mb-1">
                <span class="font-medium">{{ getUserName(p.id) }}</span>
                <span class="text-sm text-gray-500"> (joined: {{ p.joined_date }})</span>
              </li>
            </ul>
            
            <p v-else class="text-gray-500 ml-7 mb-4">No participants yet. Be the first to join!</p>

            <button
              v-if="userStore.userId && !event.participants.some(p => p.id === userStore.userId)"
              @click="handleJoin(event.id)"
              class="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Event
            </button>
            
            <span v-else-if="userStore.userId && event.participants.some(p => p.id === userStore.userId)" class="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              You're participating
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>