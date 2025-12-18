import { defineStore } from 'pinia'
import type { Movie } from '../types/movie'
import { useAuthStore } from './auth'

export const usePopupStore = defineStore('popup', {
  state: () => ({
    showPopup: false,
    showCreatePopup: false,
    selectedMovie: null as Movie | null,

    newListName: '',
    newListDescription: ''
  }),

  actions: {
    openPopup(movie: Movie) {
      this.selectedMovie = movie
      this.showPopup = true
    },

    openCreatePopup() {
      this.showPopup = false
      this.showCreatePopup = true
    },

    closeCreatePopup() {
      this.showCreatePopup = false
      this.showPopup = true
    },

    closeAll() {
      this.showPopup = false
      this.showCreatePopup = false
      this.selectedMovie = null
      this.newListName = ''
      this.newListDescription = ''
    },

    saveNewWatchlist() {
  if (!this.newListName.trim()) return

  const auth = useAuthStore()

  if (this.selectedMovie) {
    auth.addWatchlist({
      title: this.newListName,
      description: this.newListDescription
    }, this.selectedMovie)
  }

  this.closeAll()
}

  }
})
