import { model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const authSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      trim: true,
      minlength: 8,
    },
    profilePic: {
      type: String,
    },
    phone: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  { timestamps: true }
)

//  Hash password before saving
authSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined
  next()
})

//  Compare passwords
authSchema.methods.comparePassword = function (passwordInDb, passwordFromUser) {
  return bcrypt.compare(passwordFromUser, passwordInDb)
}

// Generate reset token
authSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(16).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordTokenExpire = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  return resetToken
}

const authUser = model('users', authSchema)

export default authUser
