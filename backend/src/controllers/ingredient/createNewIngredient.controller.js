const pool = require("../../utils/database");

async function createNewIngredient(req, res) {
    const { IngredientID, Name, Quantity, Unit, CostPerUnit, AdjustmentPrice, IngredientCategoryID } = req.body;

    // ตรวจสอบว่าได้รับข้อมูลครบถ้วนหรือไม่
    if (!IngredientID || !Name || !Quantity || !Unit || !CostPerUnit || !AdjustmentPrice || !IngredientCategoryID) {
        return res.status(400).json({ message: "Incomplete information" });
    }
    let conn;
    try {
        conn = await pool.getConnection();
        // ตรวจสอบว่า IngredientID หรือ Name ซ้ำหรือไม่
        const checkQuery = `
                SELECT * FROM Ingredient 
                WHERE IngredientID = ? OR Name = ?
            `;
        const rows = await conn.query(checkQuery, [IngredientID, Name]);
        if (rows.length > 0) {
            const duplicatedFields = [];
            if (rows.some(row => row.IngredientID === IngredientID)) duplicatedFields.push("IngredientID");
            if (rows.some(row => row.Name === Name)) duplicatedFields.push("Name");

            return res.status(400).json({
                message: `Cannot add: Duplicate data (${duplicatedFields.join(', ')})`
            });
        }
        const insertQuery = `
            INSERT INTO Ingredient (IngredientID, Name, Quantity, Unit, CostPerUnit, AdjustmentPrice, IngredientCategoryID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await conn.query(insertQuery, [IngredientID, Name, Quantity, Unit, CostPerUnit, AdjustmentPrice, IngredientCategoryID]);

        res.status(201).json({
            IngredientID,
            Name,
            Quantity,
            Unit,
            CostPerUnit,
            AdjustmentPrice,
            IngredientCategoryID
        });
    } catch (error) {
        console.error("Error occurred while adding ingredient: ", error);
        res.status(500).json({
            message: "System error occurred"
        });
    } finally {
        if (conn)
            conn.release();
    }
}
module.exports = { createNewIngredient };