// backend/controllers/menu/deleteMenuItem.controller.js
const db = require('../../utils/database');

/**
 * @desc    Delete a Menu Item
 * @route   DELETE /api/menu/:menuId
 * @access  Private (Requires admin/owner privileges, bearerAuth)
 */
module.exports = async (req, res) => {
  // TODO: Implement authentication/authorization checks (admin/owner)

  const {menuId} = req.params;

  // Check if menu item exists
  const existingMenu = await db.query(
    'SELECT MenuID FROM Menu WHERE MenuID = ?',
    [menuId],
  );
  if (existingMenu.length === 0) {
    return res
      .status(404)
      .json({message: `Menu item with ID '${menuId}' not found.`});
  }

  // Note: The SQL schema for DefaultRecipe has ON DELETE CASCADE for MenuID.
  // And OrderItem has ON DELETE RESTRICT for MenuID.
  // This means if a menu item is part of an existing order, it cannot be deleted directly.
  // The API spec says "Use with caution, consider soft delete or status change".
  // A true "soft delete" would involve an "isDeleted" flag. Changing status is PATCH.
  // This DELETE operation will attempt a hard delete.

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Attempt to delete from Menu. If it's referenced in OrderItem, this will fail
    // due to the RESTRICT constraint.
    // DefaultRecipe entries will be cascaded.
    const deleteResult = await connection.query(
      'DELETE FROM Menu WHERE MenuID = ?',
      [menuId],
    );

    if (deleteResult.affectedRows === 0) {
      // This should ideally be caught by the foreign key constraint if it's in an order.
      // Or it means the item was already deleted.
      await connection.rollback(); // Rollback just in case, though nothing might have happened
      return res.status(404).json({
        message: `Menu item with ID '${menuId}' not found or already deleted.`,
      });
    }

    await connection.commit();
    res.status(204).send();
  } catch (error) {
    await connection.rollback();
    console.error(`Error deleting menu item ${menuId}:`, error);
    if (
      error.code === 'ER_ROW_IS_REFERENCED_2' ||
      error.sqlMessage?.includes(
        'FOREIGN KEY (`MenuID`) REFERENCES `Menu` (`MenuID`) ON DELETE RESTRICT',
      )
    ) {
      // This specific error code ER_ROW_IS_REFERENCED_2 usually means a foreign key constraint violation
      return res.status(400).json({
        message: `Cannot delete menu item '${menuId}' as it is referenced in existing orders. Consider changing its status to unavailable instead.`,
      });
    }
    res.status(500).json({
      message: 'An unexpected error occurred while deleting the menu item.',
    });
  } finally {
    if (connection) connection.release();
  }
};
