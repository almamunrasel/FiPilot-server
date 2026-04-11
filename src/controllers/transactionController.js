const Transaction = require("../models/Transaction");



const addTransaction=async(req,res)=>{
  try{
    const { type, category, amount, description, date } = req.body;
 
    if (!type || !category || !amount || !description || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }
 
    const transaction = await Transaction.create({
      type,
      category,
      amount,
      description,
      date,
      email: req.user.email,
      name: req.user.name,
    });
 
    res.status(201).json({ message: "Transaction added successfully!", transaction });

  }catch(error){
    console.error("Add transaction error:", error);
    res.status(500).json({ message: "Failed to add transaction." });

  }
}

const getTransactions=async(req,res)=>{
  try{
    const transactions = await Transaction.find({ email: req.user.email }).sort({
      date: -1,
    });
    res.status(200).json({ transactions });

  }catch(error){
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions." });

  }
}

const getSummary=async(req,res)=>{
  try{
    const result = await Transaction.aggregate([
      {$match:{email:req.user.email}},
      {
        $group:{
          _id:"$type",
          total:{$sum:"$amount"},
        },
      },
    ]);
    let totalIncome=0;
    let totalExpense=0;
    result.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    });
    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });

  }catch(error){
    console.error("Summary error:", error);
    res.status(500).json({ message: "Failed to fetch summary." });

  }
}

const getTransactionById = async (req, res) => {
  try {
    
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
 
    // Ownership check
    if (transaction.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to view this transaction." });
    }
 
    // Also get total amount for this category
    const categoryResult = await Transaction.aggregate([
      { $match: { email: req.user.email, category: transaction.category } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
 
    const categoryTotal = categoryResult[0]?.total || 0;
 
    res.status(200).json({ transaction, categoryTotal });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ message: "Failed to fetch transaction." });
  }
};

const updateTransaction=async(req,res)=>{
  try{
    
    const transaction=await Transaction.findById(req.params.id);
    if(!transaction){
      return res.status(404).json({message:"your Transacton not found"});
    }
    if (transaction.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to update this transaction." });
    }
    const { type, category, amount, description, date } = req.body;
 
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, category, amount, description, date },
      { new: true, runValidators: true }
    );
 
    res.status(200).json({ message: "Transaction updated successfully!", transaction: updated });

  }catch(error){
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Failed to update transaction." });

  }
}

const deleteTransaction=async(req,res)=>{
  try {
    
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
 
    if (transaction.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to delete this transaction." });
    }
 
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Failed to delete transaction." });
  }

}
module.exports = {
  addTransaction,
  getTransactions,
  getSummary,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};