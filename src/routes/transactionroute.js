const express=require('express');
const router=express.Router();
const {protected}=require('../middlewares/auth');
const validateObjectId = require("../middlewares/validateObjectId");
const {addTransaction, getTransactions, getSummary, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');


router.use(protected);

router.post('/',addTransaction);
router.get('/',getTransactions);
router.get('/summary',getSummary);
router.get('/:id',validateObjectId,getTransactionById);
router.patch('/:id',validateObjectId,updateTransaction);
router.delete('/:id',validateObjectId,deleteTransaction);

module.exports=router;