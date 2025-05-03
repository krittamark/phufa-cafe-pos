const pool = require("../../utils/database");
async function deleteIngredient(req, res) {
    const IngredientID = req.params.IngredientID;

    let conn;
    try {
        conn = await pool.getConnection();

        // ตรวจสอบว่า IngredientID ที่ต้องการลบมีอยู่ในฐานข้อมูลหรือไม่
        const existing = await conn.query(
            'SELECT IngredientID FROM Ingredient WHERE IngredientID = ? LIMIT 1', [IngredientID]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Ingredient to delete not found" });
        }


        // ลบวัตถุดิบ
        const deleteQuery = 'DELETE FROM Ingredient WHERE IngredientID = ?';
        const deleteResult = await conn.query(deleteQuery, [IngredientID]);

        console.log(`Ingredient deleted, affected rows:`, deleteResult.affectedRows);
        if (deleteResult.affectedRows > 0) {
            res.status(200).json({ message: 'Ingredient deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete ingredient' });
        }
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ message: 'An error occurred while deleting', error: error.message });
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { deleteIngredient };