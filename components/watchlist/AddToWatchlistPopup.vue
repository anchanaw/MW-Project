<template>
    <!-- =============== POPUP ADD MOVIE =============== -->
    <div v-if="open && mode === 'select'" class="popup-backdrop">
        <div class="popup-container">

            <div class="popup-header">
                <span class="popup-label-text">Add movie:</span>
                <span class="movie-title">
                    {{ movie?.title }} ({{ movie?.year }})
                </span>
                <button class="close-btn" @click="close">✖</button>
            </div>

            <p class="to-watchlist">To watchlist:</p>

            <div class="watchlist-scroll">
                <div class="watchlist-option" v-for="list in auth.user?.watchlists || []" :key="list.id"
                    @click="addMovieToList(list.id)">
                    <div class="list-icon">
                        {{ list.title.charAt(0).toUpperCase() }}
                    </div>
                    <span class="list-title">{{ list.title }}</span>
                </div>
            </div>

            <button class="new-watchlist" @click="mode = 'create'">
                <span class="plus-icon">+</span>
                New watchlist
            </button>

        </div>
    </div>

    <!-- =============== POPUP CREATE LIST =============== -->
    <div v-if="open && mode === 'create'" class="popup-backdrop">
        <div class="create-popup">

            <h2 class="create-title">Create new watchlist</h2>

            <div class="form-group">
                <label class="input-label">Name</label>
                <input type="text" v-model="newListName" class="input-box" />
            </div>

            <div class="form-group">
                <label class="input-label">Description</label>
                <textarea v-model="newListDescription" class="textarea-box"></textarea>
            </div>

            <button class="cancel-btn" @click="mode = 'select'">
                Cancel
            </button>
            <button class="save-btn" @click="saveNewWatchlist">
                Save
            </button>

        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

/* ================= PROPS ================= */
const props = defineProps({
    open: Boolean,
    movie: Object
})

const emit = defineEmits(['close'])
const auth = useAuthStore()

/* ================= STATE ================= */
const mode = ref('select') // select | create
const newListName = ref('')
const newListDescription = ref('')

/* ================= METHODS ================= */
const close = () => {
    emit('close')
}

const addMovieToList = (listId) => {
    if (!props.movie) return
    auth.addMovieToWatchlist(listId, props.movie)
    close()
}

const saveNewWatchlist = () => {
    if (!newListName.value.trim() || !props.movie) return

    auth.addWatchlist(
        {
            title: newListName.value,
            description: newListDescription.value
        },
        props.movie
    )

    close()
}

/* ================= RESET WHEN OPEN ================= */
watch(
    () => props.open,
    (val) => {
        if (val) {
            mode.value = 'select'
            newListName.value = ''
            newListDescription.value = ''
        }
    }
)
</script>

<style scoped>
/* BACKDROP */
.popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5000;
    font-family: 'Lato', sans-serif;
}

/* POPUP CONTAINER */
.popup-container {
    background: #1d1d1d;
    padding: 30px;
    width: 700px;
    max-height: 300px;
    border-radius: 10px;
    border: 1px solid #444;
    color: white;
    position: relative;
    font-family: 'Lato', sans-serif;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.watchlist-scroll {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
}

/* HEADER */
.popup-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
}

.popup-label-text {
    color: #ddd;
    font-size: 16px;
}

.movie-title {
    font-size: 20px;
    font-weight: 700;
}

.close-btn {
    margin-left: auto;
    background: none;
    border: none;
    color: white;
    font-size: 22px;
    cursor: pointer;
}

.to-watchlist {
    color: #ddd;
    font-size: 16px;
    margin-bottom: 21px;
}

/* WATCHLIST ITEM */
.watchlist-option {
    display: flex;
    align-items: center;
    width: 247px;
    height: 41px;
    gap: 15px;
    background: #000;
    padding: 14px 18px;
    border-radius: 6px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: background 0.15s;
}

.watchlist-option:hover {
    border: 1px #ff5555;
}

.list-icon {
  width: 22px;            
  height: 22px;
  background: #e6e6e6;
  color: #000;
  font-weight: 700;
  border-radius: 8px;       
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;       
  line-height: 1;
}

.list-title {
    font-size: 15px;
    font-weight: 600;
}

/* NEW WATCHLIST BUTTON */
.new-watchlist {
    width: 247px;
    height: 41px;
    background: #ff3b3b;
    padding: 14px;
    border-radius: 6px;
    border: none;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    margin-top: auto;
}

.plus-icon {
  width: 22px;              
  height: 22px;
  background: #fff;
  color: #000;
  border-radius: 8px;       
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;        
  font-weight: 800;
  line-height: 1;

}

.new-watchlist {
    background: #ff3b3b;
    color: #000;
    /* ตัวหนังสือสีดำ */
    border: none;
    border-radius: 6px;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 12px 16px;
    font-weight: 700;
    cursor: pointer;
}


.create-popup {
    position: relative;
    width: 700px;
    height: 300px;
    background: #161616;
    border: 1px solid #E1E1E1;
    border-radius: 4px;
    padding: 30px;
    padding-bottom: 80px;
    box-sizing: border-box;
    color: #E1E1E1;
}

.create-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
}

.form-area {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-top: 20px;
}

.input-label {
    font-size: 16px;
    font-weight: 700;
}

.input-box {
    width: 295px;
    height: 40px;
    padding: 8px 10px;
    background: #161616;
    border: 1px solid #E1E1E1;
    border-radius: 6px;
    color: #E1E1E1;
    margin-left: 41px;
}

.textarea-box {
    width: 295px;
    height: 140px;
    padding: 10px;
    background: #161616;
    border: 1px solid #E1E1E1;
    border-radius: 6px;
    color: #E1E1E1;
    resize: none;
}

.cancel-btn,
.save-btn {
    position: absolute;
}

.cancel-btn {
    right: 150px;
    bottom: 30px;
    background: none;
    border: none;
    color: #F33F3F;
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
}

.save-btn {
    right: 10px;
    bottom: 20px;
    width: 110px;
    height: 41px;
    background: #F33F3F;
    color: black;
    padding: 8px 28px;
    border-radius: 6px;
    border: none;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
}

.save-btn:hover {
    background: #ff5d5d;
}
</style>