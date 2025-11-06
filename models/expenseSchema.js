import { model, Schema } from 'mongoose'


const expenseSchema = new Schema({
 category:
  { 
    type: String, 
    required: true 
},
 amount: 
 { 
    type: Number, 
    required: true 
},
date: 
{ 
    type: String, 
    required: true 
},

note: 
{ 
    type: String, 
    default: "" 
},
}, {timestamps: true})


const Expense = model('Expense', expenseSchema)

export default Expense;
