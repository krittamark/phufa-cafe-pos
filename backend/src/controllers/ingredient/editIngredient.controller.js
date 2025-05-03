// backend/src/controllers/editIngredient.js
const pool = require("../../utils/database");

async function editIngredient(req, res) {
    const IngredientID = req.params.IngredientID;
    const updateData = req.body;

    // ตรวจสอบว่ามีข้อมูลส่งมาหรือไม่
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No data provided for update' });
    }


    let conn;
    try {
        conn = await pool.getConnection();
        console.log("DB Connection obtained for updating Ingredient");

        // ตรวจสอบว่า IngredientID นี้มีอยู่จริงหรือไม่
        const existing = await conn.query(
            'SELECT IngredientID FROM Ingredient WHERE IngredientID = ? LIMIT 1', [IngredientID]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "IngredientID to update not found" });
        }


        // ฟิลด์ที่อนุญาตให้แก้ไข
        const allowedFields = ['Name', 'Quantity', 'Unit', 'CostPerUnit', 'AdjustmentPrice', 'IngredientCategoryID'];

        const updateFields = [];
        const updateValues = [];

        for (const key in updateData) {
            if (allowedFields.includes(key)) {
                const value = typeof updateData[key] === 'string' ? updateData[key].trim() : updateData[key];
                if (value !== undefined && value !== null && value !== '') {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            }
        }

        // ไม่มีฟิลด์ที่สามารถอัปเดตได้
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No editable fields provided' });
        }

        // Construct SQL UPDATE and inject values
        const updateQuery = `UPDATE Ingredient SET ${updateFields.join(', ')} WHERE IngredientID = ?`;
        updateValues.push(IngredientID);

        const updateResult = await conn.query(updateQuery, updateValues);
        console.log(`Ingredient updated, affected rows:`, updateResult.affectedRows);

        res.status(200).json({ message: 'Ingredient updated successfully', affectedRows: updateResult.affectedRows });
    } catch (error) {
        console.error('Error occurred while updating:', error);
        res.status(500).json({ message: 'An error occurred while updating', error: error.message });
    } finally {
        if (conn) conn.release();
    }

}

module.exports = { editIngredient };