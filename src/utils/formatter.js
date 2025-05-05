import { pick } from 'lodash'

export const slugify = (str) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .normalize('NFD') // Tách dấu ra khỏi ký tự
      .replace(/[\u0300-\u036f]/g, '') // Xoá dấu
      .replace(/đ/g, 'd') // Chuyển đ -> d
      .replace(/[^a-z0-9\s-]/g, '') // Xoá ký tự đặc biệt
      .trim() // Xoá khoảng trắng 2 đầu
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu -
      .replace(/-+/g, '-') // Loại bỏ dấu - thừa
  }

export const pickUser = (user) => {
  if (!user) return null
  return pick(user, ['_id', 'email', 'username', 'displayName', 'avatar', 'role', 'isActive', 'createdAt', 'updatedAt'])

}