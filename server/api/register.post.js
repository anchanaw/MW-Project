import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  let name = ""
  let email = ""
  let password = ""
  let avatarUrl = "/uploads/default.png" // เผื่อไม่มีรูปอัปโหลด

  for (const field of formData) {
    if (field.name === "name") name = field.data.toString()
    if (field.name === "email") email = field.data.toString()
    if (field.name === "password") password = field.data.toString()

    // ถ้ามี avatar
    if (field.name === "avatar" && field.filename) {
      const uploadPath = join(process.cwd(), "public/uploads", field.filename)
      await writeFile(uploadPath, field.data)
      avatarUrl = "/uploads/" + field.filename
    }
  }

  // จำลอง insert user ลง database
  const fakeUser = {
    id: Date.now(),
    name,
    email,
    avatar: avatarUrl
  }

  return {
    success: true,
    token: "FAKE_REGISTER_TOKEN_123",
    user: fakeUser
  }
})
