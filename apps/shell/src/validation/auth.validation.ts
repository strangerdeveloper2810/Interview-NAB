import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'], // lỗi gắn vào field confirmPassword
})

const loginSchema = z.object({
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})



type RegisterForm = z.infer<typeof registerSchema>
type LoginForm = z.infer<typeof loginSchema>

export {
    registerSchema,
    loginSchema
}
export type { RegisterForm, LoginForm }